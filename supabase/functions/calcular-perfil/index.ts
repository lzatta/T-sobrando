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
// Vale pra todo texto gerado aqui (resumo, pontos_atencao, recomendacao_geral,
// e agora também os campos de pares_habito) — o próprio PRODUCT.md diz que o
// princípio cobre "qualquer cálculo derivado da triagem que gere texto voltado
// ao usuário", não só a recomendação.
const TOM_RECOMENDACOES = `Toda sugestão de substituição de hábito gerada pela IA deve ser comunicada como ganho, nunca como restrição disfarçada. Em vez de descrever o que a pessoa deixa de gastar ou de fazer, descrever o que ela ganha ao trocar a rotina, mantendo o tom próximo e sem soar como conselho genérico de app financeiro tradicional.

Exemplo do que evitar: "Socialize sem gastar."

Exemplo do tom esperado: "Você curte sair com os amigos — dá para manter isso vivo sem pesar no orçamento. Que tal sugerir um point na casa de alguém dessa vez?"

Esse princípio vale para todo texto que você gerar aqui — resumo, pontos_atencao, recomendacao_geral e todos os campos de pares_habito (especialmente beneficio_vida) — não só para a recomendação final.`

// Base de psicologia comportamental — obrigatória para os pares de hábito.
// Frameworks reconhecidos, não invenção da IA: cite-os implicitamente através
// da estrutura dos campos pedidos, sem citar os nomes dos autores no texto
// exibido ao usuário (isso é orientação de raciocínio interno, não conteúdo).
const BASE_COMPORTAMENTAL = `Ao gerar os pares de hábito (habito_ruim / habito_substituto), fundamente-se explicitamente nestes frameworks reconhecidos de psicologia comportamental:

- Loop do hábito (Charles Duhigg, "O Poder do Hábito"): todo hábito tem uma deixa (gatilho), uma rotina e uma recompensa. Nunca sugira eliminar um hábito — sempre substitua a rotina mantendo a MESMA deixa e uma recompensa psicologicamente equivalente. Por isso o campo "gatilho" do hábito substituto deve repetir o gatilho do hábito ruim sempre que fizer sentido.
- Sistema 1 / Sistema 2 (Daniel Kahneman, "Rápido e Devagar"): no momento do gatilho, a decisão é dominada pelo Sistema 1 (rápido, automático, emocional) — por isso o substituto precisa ser algo escolhível no calor do momento, não uma decisão que dependa de força de vontade racional (Sistema 2).
- Modelo de comportamento B=MAP (BJ Fogg): um comportamento só acontece quando motivação, habilidade (facilidade de execução) e um gatilho coincidem no mesmo momento. O hábito substituto precisa ser fácil de iniciar bem ali, no momento do gatilho — não algo que exija preparo ou planejamento prévio.

Gere entre 1 e 4 pares — um por padrão de comportamento realmente distinto identificável nas respostas, não um par para cada opção marcada (várias respostas podem apontar para o mesmo padrão real). Ordene os pares da maior prioridade sugerida para a menor: o índice no array vira a prioridade inicial exibida ao usuário, que pode reordenar livremente depois.`

const AJUSTES_DE_FORMATO = `Gere todo o texto direto, sem aspas ao redor das frases — as aspas usadas nos exemplos acima são só ilustração de tom, não fazem parte da formatação esperada.

Cada campo do perfil (resumo, pontos_fortes, pontos_atencao, recomendacao_geral) deve trazer uma ideia distinta das demais — nunca reformule o mesmo ponto ou o mesmo exemplo em mais de um campo.`

type Respostas = {
  perfil_gasto: string
  gatilho_principal: string[]
  momento_gasto: string[]
  atividade_prazer: string[]
  atividade_prazer_outro?: string
  atividade_prazer_detalhe?: string
  frequencia_planejamento: string
}

// gatilho_principal, momento_gasto e atividade_prazer são seleção múltipla —
// junta os rótulos numa lista legível; "outro" (só existe em atividade_prazer)
// é substituído pelo texto livre da pessoa, quando houver
function rotularLista(valores: string[], labels: Record<string, string>, outro?: string) {
  return valores.map((valor) => (valor === 'outro' && outro ? outro : (labels[valor] ?? valor))).join(', ')
}

function montarPrompt(respostas: Respostas) {
  const linhas = [
    `Relação com dinheiro: ${LABELS.perfil_gasto[respostas.perfil_gasto]}`,
    `Principais gatilhos de gasto sem planejar: ${rotularLista(respostas.gatilho_principal, LABELS.gatilho_principal)}`,
    `Onde o gasto por impulso mais acontece: ${rotularLista(respostas.momento_gasto, LABELS.momento_gasto)}`,
    `O que gosta de fazer para relaxar/se recompensar: ${rotularLista(respostas.atividade_prazer, LABELS.atividade_prazer, respostas.atividade_prazer_outro)}`,
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
        max_tokens: 2048,
        system: [TOM_RECOMENDACOES, AJUSTES_DE_FORMATO, BASE_COMPORTAMENTAL].join('\n\n'),
        tool_choice: { type: 'tool', name: 'registrar_perfil_e_habitos' },
        tools: [
          {
            name: 'registrar_perfil_e_habitos',
            description:
              'Registra o diagnóstico do perfil comportamental financeiro do usuário e os pares de hábito ruim/substituto sugeridos.',
            input_schema: {
              type: 'object',
              properties: {
                perfil: {
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
                pares_habito: {
                  type: 'array',
                  minItems: 1,
                  maxItems: 4,
                  description: 'Ordenado da maior prioridade sugerida para a menor.',
                  items: {
                    type: 'object',
                    properties: {
                      habito_ruim: {
                        type: 'object',
                        properties: {
                          nome: { type: 'string', description: 'Nome curto do hábito ruim identificado.' },
                          tipo: { type: 'string', description: 'Frase curta descrevendo a natureza desse hábito.' },
                          gatilho: { type: 'string', description: 'A deixa que dispara esse hábito.' },
                          recompensa: {
                            type: 'string',
                            description: 'O que a pessoa ganha psicologicamente hoje ao ceder a esse hábito.',
                          },
                        },
                        required: ['nome', 'tipo', 'gatilho', 'recompensa'],
                      },
                      habito_substituto: {
                        type: 'object',
                        properties: {
                          nome: { type: 'string', description: 'Nome curto do hábito substituto sugerido.' },
                          tipo: { type: 'string', description: 'Frase curta descrevendo a natureza desse hábito.' },
                          gatilho: {
                            type: 'string',
                            description: 'Idealmente o mesmo gatilho do hábito ruim correspondente.',
                          },
                          recompensa: {
                            type: 'string',
                            description: 'A recompensa psicologicamente equivalente que esse hábito entrega.',
                          },
                          beneficio_vida: {
                            type: 'string',
                            description:
                              'O que esse hábito ajuda a alcançar na vida da pessoa — conexão com uma meta ou benefício de vida maior, não só financeiro.',
                          },
                        },
                        required: ['nome', 'tipo', 'gatilho', 'recompensa', 'beneficio_vida'],
                      },
                    },
                    required: ['habito_ruim', 'habito_substituto'],
                  },
                },
              },
              required: ['perfil', 'pares_habito'],
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

    const perfilCalculado = blocoFerramenta.input.perfil
    const paresHabito = blocoFerramenta.input.pares_habito as Array<{
      habito_ruim: Record<string, string>
      habito_substituto: Record<string, string>
    }>
    const geradoEm = new Date().toISOString()

    const { error: erroUpdate } = await supabase
      .from('triagem_respostas')
      .update({ perfil_calculado: perfilCalculado, perfil_calculado_em: geradoEm })
      .eq('user_id', user.id)

    if (erroUpdate) throw erroUpdate

    // substitui os pares por completo a cada geração — prioridade é editável
    // pelo usuário e não há hoje nenhum fluxo de "refazer triagem" que exija
    // preservar a ordem entre gerações (decisão registrada no plano técnico)
    const { error: erroDelete } = await supabase.from('habit_pairs').delete().eq('user_id', user.id)
    if (erroDelete) throw erroDelete

    const linhasParaInserir = paresHabito.map((par, index) => ({
      user_id: user.id,
      habito_ruim: par.habito_ruim,
      habito_substituto: par.habito_substituto,
      prioridade: index,
      gerado_em: geradoEm,
    }))

    const { data: pares, error: erroInsert } = await supabase
      .from('habit_pairs')
      .insert(linhasParaInserir)
      .select('id, habito_ruim, habito_substituto, prioridade')
      .order('prioridade', { ascending: true })

    if (erroInsert) throw erroInsert

    return new Response(JSON.stringify({ perfilCalculado, perfilCalculadoEm: geradoEm, pares }), {
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
