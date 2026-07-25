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

**Nota de atualização:** essa seção foi posteriormente substituída — "Contas" foi removida por completo e virou um campo de instituição diretamente na transação (ver histórico de conversas para o prompt de remoção). Mantida aqui como registro histórico da decisão intermediária.

## 7. Ideias futuras — visualizações gráficas do dashboard (não implementado ainda)

Surgiram durante o teste da Sprint 2:

**Gráficos de pizza** (3, sobrepostos, navegáveis por swipe horizontal):

1. Despesas vs. Receitas (só essas duas fatias)
2. Distribuição por categoria, com cores diferentes e percentual
3. Distribuição por transação individual, para visualizar o que mais consome o dinheiro

**Gráfico de linha — evolução patrimonial:** mostrando como o patrimônio total do usuário cresce ou diminui ao longo dos meses, já que o patrimônio passou a ser um acumulado histórico (ver correção aplicada), não um valor do mês corrente.

Registrado como ideia de produto validada, mas não priorizada para implementação imediata — envolve escolha de biblioteca de gráfico (ou SVG customizado) e, no caso dos gráficos de pizza, gesto de swipe entre telas sobrepostas. Faz sentido avaliar as duas necessidades (pizza + linha) juntas na hora de escolher a biblioteca, para não decidir isso duas vezes separadas.

## 8. Ideias futuras — BrasilAPI (dados públicos brasileiros, gratuito, sem chave)

Identificado como um recurso legítimo e específico para o Brasil, não priorizado para implementação imediata:

**Lista de bancos sempre atualizada:** hoje o campo "Instituição" (em Transações) usa uma lista fixa mantida manualmente (~14 bancos + "Outro"). O endpoint `/api/banks/v1` da BrasilAPI retorna a lista completa e oficial de instituições financeiras registradas no Banco Central, sem necessidade de manutenção manual. Poderia substituir ou complementar a lista fixa atual.

**Tabela FIPE (preço de veículos):** a tela de Patrimônio permite cadastrar um veículo com "valor estimado" digitado livremente pelo usuário. A Tabela FIPE (também disponível via BrasilAPI) é a referência oficial de preço de carro usado no Brasil — poderia ser usada para sugerir ou validar um valor mais preciso na hora de cadastrar um veículo como bem, em vez de depender só de estimativa manual.

Ambas são gratuitas, sem necessidade de chave de API, mantidas por projeto comunitário brasileiro (brasilapi.com.br) — sem custo nem complexidade de autenticação para adotar quando fizer sentido.

## 9. Registro rápido por voz — dois caminhos complementares (não concorrentes)

**Caminho 1 — Atalhos/Siri (iPhone):** frase de ativação personalizada aciona um Atalho que grava a fala, manda para um webhook (Edge Function), que usa IA para extrair valor/categoria/data e grava na transação. Mãos livres, sem abrir nenhum app. Já decidido anteriormente como caminho principal.

**Caminho 2 — WhatsApp, via número de teste gratuito da própria Meta:** a Meta Cloud API tem um número de teste que permite até 5 destinatários pré-cadastrados, sem custo de mensalidade de BSP (Business Solution Provider) — suficiente para validar com um grupo pequeno de usuários reais antes de decidir se vale investir num BSP pago para escalar. Mensagens dentro da janela de 24h de conversa (praticamente todo o caso de uso aqui — usuário manda mensagem, bot responde) são gratuitas, com folga de 1.000 conversas grátis por mês além do número de teste. Requer configuração técnica própria (webhook via Edge Function, sem painel visual de BSP), mas sem custo de mensalidade para a fase de validação.

Os dois caminhos não competem — atendem preferências diferentes de uso (Siri para quem quer o mínimo de fricção possível, WhatsApp para quem prefere um canal de mensagem já familiar). Nenhum dos dois entra nesta fase do projeto — ambos ficam documentados para quando a Sprint correspondente chegar.

## 10. Ideia futura — adicionar hábito manualmente via descrição livre + IA

Surgiu ao testar a tela Hábitos: em vez de um formulário estruturado (gatilho, recompensa, tipo — fricção alta, exige que a pessoa pense como um especialista em comportamento), a pessoa descreve o hábito que quer mudar com as próprias palavras, com um campo opcional para já sugerir uma ideia de substituto.

A IA então:

- Se a pessoa não sugeriu substituto: gera o par completo sozinha, com base no perfil da triagem, mesma lógica já usada na geração automática.
- Se a pessoa sugeriu algo: a IA usa como base, mas aplica os mesmos filtros de qualidade (Duhigg — mantém gatilho/recompensa; Fogg — é fácil de iniciar no momento do gatilho?), podendo refinar a sugestão, não só validar cegamente.
- Se a descrição da pessoa não tiver informação suficiente para identificar gatilho/recompensa com confiança, a IA não deve inventar ou assumir — deve fazer uma ou mais perguntas de esclarecimento antes de gerar o par, para obter um resultado mais preciso em vez de uma suposição frágil.

O novo par entra na lista com prioridade padrão (última posição), reordenável manualmente como os demais.

Não implementar agora — a Sprint 4 já cresceu além do escopo original do ROADMAP.md com a estrutura de pares de hábito; esta adição fica para depois de testar e validar o que já está em implementação.

## 11. Conexão entre hábitos, metas e dados financeiros reais — próximo passo natural após estabilizar os pares de hábito

O campo `beneficio_vida` do hábito substituto deve deixar de ser uma frase genérica e passar a incluir, quando fizer sentido, uma projeção real conectada à vida do usuário — no mesmo espírito do que já existe em Metas ("esse aporte reduz sua meta em X dias").

Importante: o exemplo de delivery + meta financeira é só uma ilustração de um tipo possível de conexão, não o único. A recompensa por adotar o hábito substituto nem sempre precisa estar amarrada a uma meta financeira específica — pode ser outro tipo de benefício real (mais tempo livre, menos ansiedade, mais qualidade de vida), dependendo do que o dado da pessoa sustentar. A lógica de fundo é sempre a mesma (baseado em dado real do app, nunca invenção da IA), mas a "moeda" da recompensa deve variar conforme o que fizer sentido para aquele hábito e aquela pessoa especificamente — não forçar todo hábito a se conectar com uma meta em dias.

Princípio não negociável: a IA nunca inventa nem estima esse número — ela só recebe um valor já calculado deterministicamente e o transforma em frase humana, mesmo padrão de "IA não faz conta, só escreve texto" já usado no resto do produto.

O cálculo em si usa dado real do próprio usuário: média de gasto na categoria relacionada ao hábito ruim (calculada a partir de `transactions`), projetada contra o tempo/valor necessário para a meta de maior prioridade (`goals`), quando essa conexão fizer sentido. Exemplo (ilustrativo, não literal, nem a única forma de conexão possível): usuário tem 4 transações de delivery no período — calcula a média, projeta quanto isso representaria acumulado ao longo do tempo, e quantos dias isso adiantaria a meta prioritária se fosse redirecionado para ela.

Regra importante: se não houver dado suficiente ainda (poucas transações, conta muito nova) para calcular uma média minimamente confiável, a função deve esperar — não forçar uma recomendação com base fraca. Como o histórico de transações cresce rápido depois que a pessoa começa a usar o app no dia a dia, essa limitação deve ser temporária, resolvendo-se sozinha com o tempo de uso.

Implicação técnica: a Edge Function `calcular-perfil` precisaria passar a ler também `transactions` e `goals`, não só a triagem — expansão real de escopo, não ajuste pequeno. Não implementar agora — primeiro estabilizar e testar por completo os pares de hábito e o bug de onboarding já em investigação.

## 12. Ideia futura — check-ins periódicos para refinar o perfil comportamental ao longo do tempo

Complementar à ideia acima: além da triagem inicial (feita uma vez, refazível manualmente), o app poderia fazer perguntas curtas periódicas (ex.: uma vez por mês) para refinar o entendimento do padrão de comportamento da pessoa ao longo do tempo — o perfil deixa de ser uma foto única e passa a evoluir com o uso real, combinando o que a pessoa responde nesses check-ins com o que o app já aprende sozinho através das transações reais registradas. Não implementar agora — registrado como direção de evolução futura do motor de hábitos, depois que a versão atual (triagem única + pares de hábito) estiver validada com uso real.
