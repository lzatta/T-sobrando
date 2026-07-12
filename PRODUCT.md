# Tá Sobrando
### Descrição completa do produto — versão consolidada

---

## O que é

O Tá Sobrando é um aplicativo focado em **mudança de comportamento financeiro**. O objetivo não é apenas organizar receitas e despesas, mas ajudar o usuário a criar hábitos financeiros melhores através de psicologia comportamental, metas, gamificação e automação.

Organização financeira é uma ferramenta. O problema real que o produto resolve é comportamento.

---

## Filosofia

A maioria dos aplicativos financeiros ajuda o usuário a entender para onde o dinheiro já foi. **O Tá Sobrando existe para ajudar o usuário a tomar melhores decisões antes que o dinheiro seja gasto.**

O produto parte de um princípio comportamental específico: um hábito financeiro ruim não é eliminado, ele é **substituído por algo que a pessoa já gosta de fazer** — não por um "hábito melhor" genérico e imposto de fora. É por isso que a triagem inicial não serve só para diagnosticar o problema, ela também mapeia o que o usuário gosta, para que a substituição tenha uma chance real de grudar. Um hábito só se sustenta se a recompensa continuar existindo; o que muda é a rotina que leva até ela.

Toda funcionalidade do produto deve incentivar uma mudança de comportamento real — não apenas registrar dados.

---

## Público-alvo

Pessoas que:
- possuem dificuldade para economizar;
- gastam por impulso;
- já usaram planilhas ou aplicativos financeiros sem sucesso;
- têm metas financeiras mas não conseguem se manter nelas;
- querem melhorar sua vida financeira sem depender só de força de vontade.

---

## Problemas que resolve

- Falta de controle financeiro
- Gastos por impulso
- Falta de motivação para economizar
- Dificuldade em manter hábitos financeiros
- Pouca conexão entre economia do dia a dia e objetivos pessoais
- Baixo engajamento em aplicativos financeiros tradicionais

---

## Como o produto resolve — os quatro pilares

### 1. Diagnóstico comportamental
Durante o cadastro, o usuário responde uma triagem que identifica seu perfil financeiro, seus hábitos, seus principais gatilhos de gasto **e o que ele gosta de fazer** — essa última parte é o que alimenta o motor de substituição de hábito. O diagnóstico pode ser refeito a qualquer momento.

### 2. Metas financeiras
O usuário define metas com grau de prioridade. Toda recomendação, desafio e sugestão do aplicativo considera sempre a meta prioritária primeiro. O objetivo é mostrar, de forma concreta, como uma pequena mudança de comportamento aproxima o usuário do que ele realmente quer.

### 3. Organização financeira
Base de dados que sustenta os diagnósticos e recomendações:
- receitas
- despesas
- patrimônio
- categorias
- fluxo de caixa
- evolução financeira
- contas, cartões e investimentos

### 4. Mudança de comportamento
O foco central do produto. O sistema identifica padrões e incentiva pequenas mudanças através de desafios, metas, lembretes, recompensas, gamificação, comparativos e acompanhamento de evolução.

---

## Registro de gastos

Prioridade de fricção, do menor pro maior esforço:
1. Comando de voz
2. Widget
3. Digitação manual

O registro deve ser simples, rápido e natural — o menor número de etapas possível entre o gasto acontecer e ele ser registrado.

---

## Gamificação

A gamificação existe para incentivar mudança de comportamento, nunca apenas para aumentar tempo de uso. Usa níveis, XP, conquistas, desafios, sequência diária (streak) e progresso. Toda recompensa deve reforçar um comportamento financeiro positivo.

**Ranking:** mostra nível e desafios cumpridos, não valor de patrimônio ou saldo. O ranking é de consistência de comportamento — quem mantém streak, cumpre desafios e acumula XP — nunca de quem tem mais dinheiro. Isso evita constranger usuários em situação financeira mais difícil, o que iria contra a própria filosofia do produto. Pode incluir exibição das top 5 melhores conquistas do usuário.

---

## Inteligência artificial

O aplicativo **não tem chatbot**. A IA é uma camada interna do sistema, não um personagem com quem o usuário conversa. Ela analisa os dados do usuário para:
- identificar padrões
- detectar desperdícios
- gerar recomendações
- criar desafios personalizados
- acompanhar evolução
- sugerir melhorias

A IA deve aparecer apenas quando conseguir entregar valor real ao usuário — nunca como enfeite ou justificativa de feature.

---

## Escopo por fase

### V1 — núcleo do produto
- Diagnóstico comportamental (triagem inicial + identificação de preferências pessoais)
- Motor de substituição de hábito baseado na triagem
- Metas financeiras com prioridade
- Organização financeira **manual**: receitas, despesas, patrimônio, categorias, fluxo de caixa, evolução
- Registro rápido de gasto por voz (Atalhos/Siri no iPhone, widget no Android), com digitação manual como alternativa
- Gamificação essencial: XP, níveis, streak, desafios conectados às metas, conquistas
- Ranking por consistência de comportamento (nível e desafios, não patrimônio)
- Acesso mobile e via navegador

### Roadmap — depois de validado o núcleo
- Integração automática com contas, cartões e investimentos via Open Finance (Pluggy/Belvo ou similar) — deixado para depois por exigir tratamento de dado bancário sensível, custo por conexão e camada de segurança/compliance que não cabe num V1 solo
- Plano família ou casal, com metas compartilhadas
- Perfil público
- Expansão do sistema de mudança de comportamento para outras áreas da vida (alimentação, sedentarismo, relacionamento)
- Aplicativo desktop nativo (além do acesso via navegador)

---

## Funcionalidades principais

- Dashboard financeiro
- Gestão de receitas e despesas
- Gestão patrimonial
- Metas financeiras com prioridade
- Diagnóstico comportamental
- Registro rápido de gastos (voz, widget, manual)
- Gamificação (XP, níveis, streak, conquistas, ranking por consistência)
- Insights personalizados
- Recomendações financeiras
- Desafios personalizados conectados às metas

---

## Princípios de desenvolvimento

Toda nova funcionalidade deve responder a estas perguntas antes de ser implementada:

1. Resolve um problema real?
2. Incentiva mudança de comportamento?
3. Possui baixa fricção?
4. É simples de utilizar?
5. Gera valor para o usuário?
6. Está alinhada com a filosofia do produto?

Se a resposta for negativa para qualquer uma delas, a funcionalidade deve ser repensada antes de ser implementada. Isso vale também para decidir o que entra no V1 e o que fica pro roadmap — a integração com Open Finance, por exemplo, é validada nos itens 1, 2, 5 e 6, mas falha nos itens 3 e 4 numa fase inicial de projeto solo, o que justifica adiá-la.

---

## Diferenciação frente à concorrência

| Concorrente | O que resolve | O que falta |
|---|---|---|
| Mobills, Organizze, GuiaBolso | Organização e categorização de gasto | Nenhuma camada comportamental |
| ZapGastos | Registro de gasto via WhatsApp + IA | Nenhuma camada comportamental, é só fricção reduzida |
| Método Mahout (terapia financeira) | Mudança de comportamento financeiro de verdade | Só existe como atendimento humano 1 a 1, caro, sem escala |

O Tá Sobrando ocupa o espaço que nenhum dos três cobre sozinho: produto de autoatendimento, escalável, com IA como motor de análise comportamental, não apenas ferramenta de organização.
