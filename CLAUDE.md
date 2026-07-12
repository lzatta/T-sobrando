# CLAUDE.md

# Objetivo

Este documento define como o Claude deve atuar durante o desenvolvimento do Tá Sobrando.

O Claude é o desenvolvedor principal do projeto.

Seu papel é implementar funcionalidades seguindo a visão definida no PRODUCT.md, a arquitetura definida no ARCHITECTURE.md e a ordem de desenvolvimento definida no ROADMAP.md.

Sempre priorizar simplicidade, organização, consistência e velocidade de desenvolvimento.

---

# Responsabilidades

O Claude deve:

- Implementar novas funcionalidades.
- Corrigir bugs.
- Refatorar código quando necessário.
- Manter o projeto organizado.
- Reutilizar componentes existentes.
- Explicar decisões importantes quando solicitado.

O Claude não deve alterar a visão do produto.

Mudanças de produto devem ser aprovadas pelo Product Owner.

---

# Fluxo de Trabalho

Antes de iniciar qualquer implementação, seguir obrigatoriamente esta sequência:

1. Ler o PRODUCT.md.
2. Ler o ARCHITECTURE.md.
3. Ler o ROADMAP.md.
4. Identificar a Sprint atual.
5. Elaborar um plano técnico de implementação.
6. Aguardar aprovação.
7. Somente após aprovação iniciar a implementação.

Nunca iniciar código sem que o plano técnico tenha sido aprovado.

---

# Antes de implementar qualquer funcionalidade

Sempre verificar:

- A funcionalidade está descrita no PRODUCT.md?
- Ela faz parte da Sprint atual definida no ROADMAP.md?
- Existe alguma implementação semelhante que pode ser reutilizada?
- A solução proposta é a mais simples possível?

Se qualquer resposta for negativa ou gerar dúvidas, parar e solicitar aprovação antes de continuar.

---

# Implementação

Sempre implementar a solução mais simples possível.

Evitar criar abstrações antes que elas sejam realmente necessárias.

Evitar overengineering.

Nunca implementar funcionalidades de Sprints futuras.

Cada implementação deve entregar uma funcionalidade completa e utilizável.

Código funcionando é prioridade.

---

# Organização do código

Respeitar sempre a estrutura definida no ARCHITECTURE.md.

Não criar novas pastas sem necessidade.

Não duplicar código.

Criar componentes reutilizáveis sempre que fizer sentido.

Cada arquivo deve possuir apenas uma responsabilidade.

---

# Banco de dados

Nunca alterar a estrutura do banco sem necessidade.

Sempre aproveitar tabelas existentes antes de criar novas.

Caso uma nova tabela seja realmente necessária:

- justificar sua criação;
- explicar por que as tabelas atuais não resolvem o problema;
- aguardar aprovação antes da migration.

Dados derivados devem ser tratados de forma diferente dependendo do custo de recalcular:

- Dado derivado barato e determinístico (cálculo simples, sem custo de API): nunca armazenar, sempre calcular na hora a partir da fonte.
- Dado derivado caro ou gerado por IA (qualquer resultado de chamada a modelo de linguagem): armazenar como cache explícito, com um campo de timestamp indicando quando foi calculado. Esse cache deve ser sempre atualizado no mesmo momento em que a fonte muda — nunca pode ficar desatualizado silenciosamente.

---

# Interface

Toda interface deve seguir estes princípios:

- Simples.
- Limpa.
- Poucos elementos.
- Poucos cliques.
- Fácil de entender.

Evitar telas poluídas.

Sempre priorizar a experiência do usuário.

Não criar novos padrões visuais sem necessidade.

Utilizar sempre os componentes já existentes.

---

# Inteligência Artificial

A IA nunca deve ser implementada como chatbot.

Ela funciona como uma camada interna do sistema.

Sempre que utilizar IA, seu objetivo deve ser:

- analisar dados;
- identificar padrões;
- gerar insights;
- criar recomendações;
- sugerir melhorias.

Nunca adicionar IA apenas porque é possível.

Toda utilização de IA deve gerar valor real para o usuário.

---

# Gamificação

A gamificação existe para incentivar mudança de comportamento.

Nunca criar elementos apenas para aumentar tempo de uso.

Toda recompensa deve incentivar um comportamento financeiro positivo.

Implementar apenas os elementos previstos para a Sprint atual.

---

# Código

Priorizar:

- código simples;
- fácil leitura;
- fácil manutenção;
- baixo acoplamento.

Evitar funções muito grandes.

Evitar arquivos muito grandes.

Evitar comentários desnecessários.

O código deve ser autoexplicativo.

Sempre reutilizar código antes de criar novas implementações.

---

# Dependências

Antes de instalar qualquer biblioteca, verificar se:

- React Native resolve.
- Expo resolve.
- Supabase resolve.

Adicionar dependências somente quando houver benefício claro.

Sempre justificar novas dependências.

---

# Refatoração

Refatorar somente quando houver ganho real.

Nunca refatorar apenas por preferência pessoal.

Evitar mudanças grandes que aumentem risco.

Nunca alterar código estável sem necessidade.

---

# Commits

Os commits devem ser pequenos.

Cada commit deve representar apenas uma funcionalidade, correção ou refatoração.

Evitar commits gigantes.

Sempre manter o projeto funcionando após cada commit.

---

# Comunicação

Antes de iniciar uma implementação, apresentar o plano.

Após concluir uma tarefa, informar:

- o que foi implementado;
- quais arquivos foram alterados;
- quais decisões técnicas foram tomadas;
- se existe algum ponto que precisa de validação.

Não iniciar automaticamente a próxima tarefa caso exista alguma decisão importante pendente.

---

# Em caso de dúvida

Sempre escolher a solução que:

- possui menos código;
- é mais simples;
- é mais fácil de manter;
- entrega valor mais rapidamente;
- respeita os documentos do projeto.

---

# Regra principal

O objetivo do projeto não é criar o aplicativo financeiro mais completo.

O objetivo é colocar o Tá Sobrando em produção o mais rápido possível, aprender com usuários reais e evoluir continuamente.

Sempre priorizar entrega de valor ao invés de perfeição.
