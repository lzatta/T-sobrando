import { z } from 'zod'

export const triagemRespostasSchema = z.object({
  perfil_gasto: z.enum(['impulso', 'controle_parcial', 'organizado_quer_economizar', 'dificuldade_acompanhar']),
  gatilho_principal: z.enum(['estresse', 'promocoes', 'pressao_social', 'tedio', 'comemoracao']),
  momento_gasto: z.enum(['compras_online_noite', 'delivery', 'compras_presenciais', 'assinaturas_esquecidas']),
  atividade_prazer: z.enum(['series_filmes', 'esporte', 'cozinhar', 'ler', 'jogos', 'tempo_social', 'outro']),
  atividade_prazer_outro: z.string().optional(),
  atividade_prazer_detalhe: z.string().optional(),
  frequencia_planejamento: z.enum(['sempre', 'as_vezes', 'quase_nunca', 'nunca']),
})

export type TriagemRespostas = z.infer<typeof triagemRespostasSchema>

type Opcao = { value: string; label: string }

export type PerguntaEscolha = {
  tipo: 'escolha'
  id: 'perfil_gasto' | 'gatilho_principal' | 'momento_gasto' | 'atividade_prazer' | 'frequencia_planejamento'
  texto: string
  opcoes: Opcao[]
}

export type PerguntaTexto = {
  tipo: 'texto'
  id: 'atividade_prazer_detalhe'
  texto: string
}

export type Pergunta = PerguntaEscolha | PerguntaTexto

export const PERGUNTAS: Pergunta[] = [
  {
    tipo: 'escolha',
    id: 'perfil_gasto',
    texto: 'Como você descreveria sua relação com dinheiro hoje?',
    opcoes: [
      { value: 'impulso', label: 'Costumo gastar por impulso' },
      { value: 'controle_parcial', label: 'Tenho controle, mas erro às vezes' },
      { value: 'organizado_quer_economizar', label: 'Sou organizado(a), mas quero economizar mais' },
      { value: 'dificuldade_acompanhar', label: 'Tenho dificuldade de acompanhar meus gastos' },
    ],
  },
  {
    tipo: 'escolha',
    id: 'gatilho_principal',
    texto: 'O que mais te leva a gastar sem planejar?',
    opcoes: [
      { value: 'estresse', label: 'Estresse ou ansiedade' },
      { value: 'promocoes', label: 'Promoções e ofertas' },
      { value: 'pressao_social', label: 'Pressão social / sair com amigos' },
      { value: 'tedio', label: 'Tédio' },
      { value: 'comemoracao', label: 'Comemorar ou me recompensar' },
    ],
  },
  {
    tipo: 'escolha',
    id: 'momento_gasto',
    texto: 'Onde o gasto por impulso mais acontece?',
    opcoes: [
      { value: 'compras_online_noite', label: 'Compras online à noite' },
      { value: 'delivery', label: 'Delivery de comida' },
      { value: 'compras_presenciais', label: 'Compras presenciais do dia a dia' },
      { value: 'assinaturas_esquecidas', label: 'Assinaturas/serviços que esqueço de cancelar' },
    ],
  },
  {
    tipo: 'escolha',
    id: 'atividade_prazer',
    texto: 'O que você gosta de fazer para relaxar ou se recompensar?',
    opcoes: [
      { value: 'series_filmes', label: 'Assistir séries/filmes' },
      { value: 'esporte', label: 'Praticar esporte ou exercício' },
      { value: 'cozinhar', label: 'Cozinhar' },
      { value: 'ler', label: 'Ler' },
      { value: 'jogos', label: 'Jogos (vídeo game/celular)' },
      { value: 'tempo_social', label: 'Passar tempo com amigos/família' },
      { value: 'outro', label: 'Outro' },
    ],
  },
  {
    tipo: 'texto',
    id: 'atividade_prazer_detalhe',
    texto: 'Quer contar um pouco mais sobre isso? (opcional)',
  },
  {
    tipo: 'escolha',
    id: 'frequencia_planejamento',
    texto: 'Você costuma planejar os gastos do mês?',
    opcoes: [
      { value: 'sempre', label: 'Sempre' },
      { value: 'as_vezes', label: 'Às vezes' },
      { value: 'quase_nunca', label: 'Quase nunca' },
      { value: 'nunca', label: 'Nunca' },
    ],
  },
]
