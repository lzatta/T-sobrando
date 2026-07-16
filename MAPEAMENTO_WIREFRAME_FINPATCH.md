# Mapeamento do wireframe original (FinPatch) para o Tá Sobrando

Este documento cruza as 17 telas desenhadas originalmente no Miro (projeto "FinPatch", renomeado para "Tá Sobrando") com o estado atual do produto — separando o que já está alinhado, o que precisa de decisão consciente, e o que é claramente roadmap futuro.

## 1. Já validado — bate com o que está em construção agora

**Tela de Metas (pág. 12)** — prioridade, categoria, prazo, progresso visual, botão "Aportar" com cálculo de "esse aporte reduz sua meta em X dias". Isso confirma, com bastante detalhe, o desenho da Sprint 3 já planejada no ROADMAP.md. Nenhuma mudança necessária — só reaproveitar esse layout quando chegar a hora, ajustando o texto de recomendação para o tom humano já definido no PRODUCT.md.

**Barra de filtros (pág. 13)** — Categorias, Período (com atalhos de mês/3/6/12 meses + intervalo personalizado com dois calendários), Tipo (Receita/Despesa). Serve de referência direta para o dashboard funcional da Sprint 2.

**Fluxo de login/cadastro (pág. 15, 16)** — já implementado e aprovado, sem mudanças necessárias.

## 2. Funcionalidades novas identificadas — candidatas à Sprint 2, pendentes de decisão

### Top Movimentações e Top Categorias (pág. 1, 14, 17)

Ranking das 5 maiores movimentações (ou categorias) do mês, cada uma com uma barra mostrando que percentual da receita mensal aquele item representa. O cálculo do percentual deve ser sempre baseado na receita mensal total do usuário (não na soma dos 5 itens exibidos), para a barra continuar confiável mesmo quando existem outras despesas fora do top 5.

Custo de implementação: baixo — é dado derivado calculado em cima da tabela `transactions` já planejada, sem necessidade de tabela nova. Boa candidata a entrar ainda na Sprint 2, se você aprovar.

### Dívidas / Passivos (pág. 14)

Área nova para o usuário acompanhar dívidas, parcelamentos, financiamentos e boletos atrasados. Campos previstos, por dívida: data de início, data de término, número de parcelas total, parcelas pagas, parcelas restantes, valor total, valor pago até agora, valor restante. Visualização resumida na lista, com detalhe completo em uma tela própria (acessada via "mais detalhes" / três pontinhos).

Isso é uma entidade nova que a Sprint 2 atual não cobre — hoje só existe `assets` (patrimônio positivo). Patrimônio líquido de verdade é ativo menos dívida, então essa lacuna é real. Duas partes com custo bem diferente:

- Tabela + CRUD básico de dívidas (rastrear valores e datas): custo moderado, mesma complexidade das outras tabelas da Sprint 2.
- Simulador de quitação (calcular quanto abater no prazo ou na parcela, a partir de taxa de juros e modelo de financiamento): custo alto — envolve matemática de amortização real (sistemas Price ou SAC, os dois modelos mais comuns de financiamento no Brasil), não é uma conta simples. Recomendo tratar isso como funcionalidade separada, de uma sprint futura, mesmo que a tabela de dívidas entre antes.

Decisão pendente: incluir a tabela de dívidas (sem o simulador) já na Sprint 2, ou documentar tudo para uma sprint própria mais adiante?

## 3. Confirmado como Pós-V1 (roadmap)

**Família (pág. 3, 4, 5, 6)** — criar/entrar em família por tag, escolha de tema/cor, mensagem de boas-vindas, metas e desafios compartilhados. Rico e bem pensado, mas já estava corretamente classificado como pós-V1 no ROADMAP.md.

**Investimentos (pág. 2, 11)** — conecta o usuário a uma corretora. Ponto importante para o roadmap de monetização: o fluxo direciona para o WhatsApp de um corretor específico com mensagem pronta — isso sugere um modelo de indicação/afiliado (você sendo remunerada por indicação de cliente à corretora). Vale manter essa ideia registrada para quando chegar a hora de pensar em monetização, não só como feature de produto.

**Gamificação avançada (pág. 9, 10)** — sistema de raridade de conquistas (Comum, Incomum, Rara, Épica, Lendária, Colecionador), avatares e efeitos visuais desbloqueáveis, ranking de comunidade por nível/XP (nunca por dinheiro — coerente com a decisão de segurança já tomada). É uma evolução natural da gamificação simples do V1 atual (XP, níveis, streak, conquistas básicas), mas faz mais sentido amadurecer para esse nível depois que o núcleo estiver validado com usuários reais.

**Chat com "Fin" (pág. 8, 11)** — assistente conversacional completo, onde o usuário troca mensagens diretamente com o mascote. Você confirmou que isso não entra nesta versão — mantemos a decisão já registrada no CLAUDE.md de que a IA funciona apenas como camada interna, sem chatbot. Fica documentado aqui como decisão de produto já tomada conscientemente (não an esquecimento), para caso a ideia seja reconsiderada no futuro.

## 4. Ajuste necessário em telas reaproveitadas

**Tom das recomendações (pág. 7, 12)** — os textos originais ("Considere reduzir gastos com lazer em 20%") seguem um tom prescritivo que contraria o princípio de "Tom das recomendações" já registrado no PRODUCT.md. O conceito das telas (card de recomendação, botão "Simular") continua bom e reaproveitável — só o texto precisa ser reescrito seguindo o padrão humano já definido, quando essas telas forem implementadas de verdade (Sprint 4).

## 5. Ajuste necessário por ser mobile-first

O wireframe foi desenhado pensando em layout de desktop (colunas lado a lado, barra de filtros inteira visível horizontalmente). Como o Tá Sobrando é mobile-first (React Native/Expo), isso precisa ser adaptado na implementação, não copiado diretamente:

- Colunas lado a lado (conteúdo principal + "Top Movimentações"/"Top Categorias" na lateral) devem virar empilhamento vertical ou navegação por abas.
- A barra de filtros com múltiplos pills visíveis ao mesmo tempo deve virar um botão único ("Filtros") que abre uma tela ou modal com as opções.

## Resumo de decisões pendentes

1. Incluir Top Movimentações e Top Categorias na Sprint 2 atual? (custo baixo, dado derivado)
2. Incluir a tabela de Dívidas (sem simulador) na Sprint 2, ou deixar para uma sprint própria?
3. Simulador de quitação de dívida: confirmado como funcionalidade separada, de sprint futura (não Sprint 2).

## 6. Redesenho de "Contas" — decisão tomada após teste real da Sprint 2

O modelo original de tipos genéricos (conta corrente, carteira, poupança, cartão de crédito, investimento) se mostrou confuso na prática e foi revisado:

- Cartão de crédito não é conta — é uma linha de crédito, representando dívida futura (fatura), não saldo positivo guardado. Removido de "Contas"; passa a pertencer à Sprint 6 — Dívidas e Passivos, como mais um tipo de dívida/parcelamento.
- "Carteira" (dinheiro em espécie) removida do V1 — reconhecida como um conceito legítimo (uso comum de dinheiro físico no Brasil), mas que merece uma tela/feature própria no futuro, não um tipo genérico dentro de "Contas". Fica registrada como ideia de roadmap, não implementada agora.
- Novo modelo de "Contas": o propósito da tela é simples — o usuário saber quanto tem em cada lugar. O fluxo passa a ser: escolher o banco/instituição (lista dos mais populares do Brasil + opção "Outro" com campo de texto livre), escolher o tipo (conta corrente ou poupança), e informar o saldo atual total.
- Conta de corretora de investimento também aparece em "Contas", mostrando o saldo atual disponível ali — isso é diferente da feature completa de "Investimentos" do roadmap (que vai mostrar os ativos investidos, rendimentos, aportes). Em "Contas", é só mais um lugar onde o usuário tem dinheiro parado, com o mesmo tratamento das contas bancárias.
- O campo permanece tecnicamente `saldo_inicial` no banco (representa o saldo no momento do cadastro daquela conta, ajustado depois pelas transações), mas a pergunta na tela deve ser formulada como "saldo atual", já que não há Open Finance ainda e o usuário precisa manter isso atualizado manualmente.

### Mudanças no schema e na tela de Contas

- Remover o tipo `cartao_credito` do enum de tipo de conta — cartão de crédito não pertence a "Contas". Isso vai ser tratado futuramente na Sprint 6 (Dívidas e Passivos), não implementado agora, só removido daqui.
- Remover também o tipo `carteira` (dinheiro em espécie) do V1 — é uma ideia válida, mas fica registrada como roadmap futuro (feature própria), não como tipo dentro de Contas por enquanto.
- O fluxo de criar uma conta passa a ser em duas escolhas: primeiro o banco/instituição, depois o tipo (conta corrente ou poupança). Lista de bancos populares no Brasil, com opção "Outro" liberando um campo de texto livre para o nome: Nubank, Itaú, Bradesco, Banco do Brasil, Caixa Econômica Federal, Santander, Banco Inter, C6 Bank, BTG Pactual, XP Investimentos, PicPay, Mercado Pago, Neon, Outro.
- Corretoras de investimento (ex: XP, BTG) também aparecem nessa mesma lista de bancos/instituições, com o mesmo tratamento — o usuário informa o saldo disponível ali, sem relação com a feature completa de Investimentos do roadmap (que trata de ativos, rendimentos, aportes — isso é outra coisa, mais pra frente).
- Tipo de conta, agora só duas opções: conta corrente ou poupança.
- O campo continua `saldo_inicial` na estrutura do banco, mas a pergunta na tela deve ser "Qual o saldo atual dessa conta?" — sempre saldo total, nunca "inicial" do ponto de vista do usuário.

### Sobre a conta padrão criada automaticamente no cadastro

Como o tipo `carteira` foi removido, a automação que cria uma conta "Carteira" no signup também precisa mudar. Sugestão em avaliação: manter a criação automática de uma conta padrão no cadastro (baixa fricção continua importante), mas renomeada para algo genérico tipo "Minha conta principal", sem banco/tipo fixo pré-definido, que o usuário edita depois com os dados reais.

## 7. Ideia futura — gráficos de pizza no dashboard (não implementado ainda)

Surgiu durante o teste da Sprint 2: o dashboard deveria ter 3 gráficos de pizza sobrepostos, navegáveis por arraste horizontal (swipe):

1. Despesas vs. Receitas (só essas duas fatias)
2. Distribuição por categoria, com cores diferentes e percentual
3. Distribuição por transação individual, para visualizar o que mais consome o dinheiro

Registrado como ideia de produto validada, mas não priorizada para implementação imediata — envolve escolha de biblioteca de gráfico (ou SVG customizado) e gesto de swipe entre telas sobrepostas, o que é escopo próprio, não uma correção pontual.
