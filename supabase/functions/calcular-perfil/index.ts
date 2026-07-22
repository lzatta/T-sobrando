import { createClient } from 'jsr:@supabase/supabase-js@2'

// Rótulos legíveis das respostas da triagem — duplicados aqui de propósito:
// esta function roda em Deno, isolada do bundle React Native (src/), então
// não há um jeito simples de importar de lá sem acoplar os dois runtimes.
// Se as perguntas da triagem mudarem (src/features/triagem/types.ts), atualizar aqui também.
const LABELS: Record<string, Record<string, string>> = {
  perfil_gasto: {
    impulso: 'Costuma gastar por impulso',
    controle_parcial: 'Tem controle, mas erra às vezes',
    organizado_quer_economizar: 'É organizado(a), mas quer economizar mais',
    dificuldade_acompanhar: 'Tem dificuldade de acompanhar os gastos',
  },
  gatilho_principal: {
    estresse: 'Estresse ou ansiedade',
    promocoes: 'Promoções e ofertas',
    pressao_social: 'Pressão social / sair com amigos',
    tedio: 'Tédio',
    comemoracao: 'Comemorar ou se recompensar',
  },
  momento_gasto: {
    compras_online_noite: 'Compras online à noite',
    delivery: 'Delivery de comida',
    compras_presenciais: 'Compras presenciais do dia a dia',
    assinaturas_esquecidas: 'Assinaturas/serviços que esquece de cancelar',
  },
  atividade_prazer: {
    series_filmes: 'Assistir séries/filmes',
    esporte: 'Praticar esporte ou exercício',
    cozinhar: 'Cozinhar',
    ler: 'Ler',
    jogos: 'Jogos (vídeo game/celular)',
    tempo_social: 'Passar tempo com amigos/família',
    outro: 'Outra atividade',
  },
  frequencia_planejamento: {
    sempre: 'Sempre planeja os gastos do mês',
    as_vezes: 'Às vezes planeja os gastos do mês',
    quase_nunca: 'Quase nunca planeja os gastos do mês',
    nunca: 'Nunca planeja os gastos do mês',
  },
}

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

// Texto extraído literalmente de PRODUCT.md > "Tom das recomendações".
// Vale pra todo texto gerado aqui (resumo, pontos_atencao, recomendacao_geral) —
// o próprio PRODUCT.md diz que o princípio cobre "qualquer cálculo derivado da
// triagem que gere texto voltado ao usuário", não só a recomendação.
const TOM_RECOMENDACOES = `Toda sugestão de substituição de hábito gerada pela IA deve ser comunicada como ganho, nunca como restrição disfarçada. Em vez de descrever o que a pessoa deixa de gastar ou de fazer, descrever o que ela ganha ao trocar a rotina, mantendo o tom próximo e sem soar como conselho genérico de app financeiro tradicional.

Exemplo do que evitar: "Socialize sem gastar."

Exemplo do tom esperado: "Você curte sair com os amigos — dá para manter isso vivo sem pesar no orçamento. Que tal sugerir um point na casa de alguém dessa vez?"

Esse princípio vale para todo texto que você gerar aqui — resumo, pontos_atencao e recomendacao_geral — não só para a recomendação final.`

type Respostas = {
  perfil_gasto: string
  gatilho_principal: string
  momento_gasto: string
  atividade_prazer: string
  atividade_prazer_outro?: string
  atividade_prazer_detalhe?: string
  frequencia_planejamento: string
}

function montarPrompt(respostas: Respostas) {
  const atividade =
    respostas.atividade_prazer === 'outro' && respostas.atividade_prazer_outro
      ? respostas.atividade_prazer_outro
      : LABELS.atividade_prazer[respostas.atividade_prazer]

  const linhas = [
    `Relação com dinheiro: ${LABELS.perfil_gasto[respostas.perfil_gasto]}`,
    `Principal gatilho de gasto sem planejar: ${LABELS.gatilho_principal[respostas.gatilho_principal]}`,
    `Onde o gasto por impulso mais acontece: ${LABELS.momento_gasto[respostas.momento_gasto]}`,
    `O que gosta de fazer para relaxar/se recompensar: ${atividade}`,
    respostas.atividade_prazer_detalhe ? `Detalhe sobre essa atividade: ${respostas.atividade_prazer_detalhe}` : null,
    `Planejamento dos gastos do mês: ${LABELS.frequencia_planejamento[respostas.frequencia_planejamento]}`,
  ].filter(Boolean)

  return [
    'Você é um analista comportamental financeiro do app Tá Sobrando.',
    'A partir das respostas de triagem abaixo, monte um diagnóstico do padrão de comportamento financeiro do usuário.',
    '',
    ...linhas,
  ].join('\n')
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Não autenticado.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_ANON_KEY')!, {
      global: { headers: { Authorization: authHeader } },
    })

    const {
      data: { user },
      error: erroUsuario,
    } = await supabase.auth.getUser()
    if (erroUsuario || !user) {
      return new Response(JSON.stringify({ error: 'Não autenticado.' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const { data: triagem, error: erroTriagem } = await supabase
      .from('triagem_respostas')
      .select('respostas')
      .eq('user_id', user.id)
      .maybeSingle()

    if (erroTriagem) throw erroTriagem
    if (!triagem?.respostas) {
      return new Response(JSON.stringify({ error: 'Triagem ainda não foi respondida.' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const apiKey = Deno.env.get('ANTHROPIC_API_KEY')
    if (!apiKey) throw new Error('ANTHROPIC_API_KEY não configurada.')

    const respostaAnthropic = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1024,
        system: TOM_RECOMENDACOES,
        tool_choice: { type: 'tool', name: 'registrar_perfil' },
        tools: [
          {
            name: 'registrar_perfil',
            description: 'Registra o diagnóstico do perfil comportamental financeiro do usuário.',
            input_schema: {
              type: 'object',
              properties: {
                resumo: {
                  type: 'string',
                  description: 'Resumo curto (2-3 frases) do padrão de comportamento financeiro do usuário.',
                },
                pontos_fortes: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '1 a 3 pontos fortes identificados nas respostas.',
                },
                pontos_atencao: {
                  type: 'array',
                  items: { type: 'string' },
                  description: '1 a 3 pontos de atenção, sempre no tom de ganho.',
                },
                recomendacao_geral: {
                  type: 'string',
                  description: 'Uma recomendação geral e prática, no tom de ganho.',
                },
              },
              required: ['resumo', 'pontos_fortes', 'pontos_atencao', 'recomendacao_geral'],
            },
          },
        ],
        messages: [{ role: 'user', content: montarPrompt(triagem.respostas as Respostas) }],
      }),
    })

    if (!respostaAnthropic.ok) {
      const textoErro = await respostaAnthropic.text()
      throw new Error(`Falha na API da Anthropic: ${respostaAnthropic.status} ${textoErro}`)
    }

    const dadosAnthropic = await respostaAnthropic.json()
    const blocoFerramenta = dadosAnthropic.content?.find((bloco: { type: string }) => bloco.type === 'tool_use')
    if (!blocoFerramenta) throw new Error('A IA não retornou o perfil no formato esperado.')

    const perfilCalculado = blocoFerramenta.input
    const perfilCalculadoEm = new Date().toISOString()

    const { error: erroUpdate } = await supabase
      .from('triagem_respostas')
      .update({ perfil_calculado: perfilCalculado, perfil_calculado_em: perfilCalculadoEm })
      .eq('user_id', user.id)

    if (erroUpdate) throw erroUpdate

    return new Response(JSON.stringify({ perfilCalculado, perfilCalculadoEm }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('[calcular-perfil] erro:', error)
    return new Response(JSON.stringify({ error: 'Não foi possível calcular o perfil agora.' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
