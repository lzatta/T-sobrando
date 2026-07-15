# ARCHITECTURE.md

# Objetivo

Este documento define a arquitetura técnica do Tá Sobrando.

Seu objetivo é manter o projeto simples, organizado e consistente durante todo o desenvolvimento.

Toda decisão técnica deve priorizar velocidade de desenvolvimento, facilidade de manutenção e baixo acoplamento.

Sempre que houver dúvida entre duas soluções, escolher a mais simples.

---

# Filosofia

O Tá Sobrando será desenvolvido de forma incremental.

Nunca desenvolver funcionalidades pensando em um futuro distante.

Implementar apenas o necessário para entregar valor ao usuário no V1.

Código simples e funcionando é melhor do que uma arquitetura perfeita que nunca sai do papel.

---

# Stack

## Frontend

- React Native
- Expo
- TypeScript

## Backend

- Supabase

## Banco de Dados

- PostgreSQL (Supabase)

## Autenticação

- Supabase Auth

## Storage

- Supabase Storage

## Navegação

- Expo Router

## Estilização

- NativeWind (Tailwind CSS)

## Formulários

- React Hook Form

## Validação

- Zod

---

# Estrutura do Projeto

```
src/
│
├── app/
├── components/
├── features/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── constants/
```

---

# Organização dos módulos

Cada funcionalidade deve possuir sua própria pasta dentro de **features**.

Exemplo:

```
features/

auth/
dashboard/
transactions/
goals/
gamification/
profile/
onboarding/
```

Cada módulo deve conter apenas os arquivos relacionados àquela funcionalidade.

Sempre evitar dependências desnecessárias entre módulos.

---

# Fluxo da aplicação

A comunicação entre a interface e o banco deve seguir sempre o mesmo padrão.

```
Tela

↓

Hook

↓

Service

↓

Supabase
```

Componentes nunca devem acessar o Supabase diretamente.

Toda regra de negócio deve ficar dentro de **services**.

---

# Componentes

Os componentes devem ser reutilizáveis.

Antes de criar um novo componente, verificar se já existe outro que pode ser reutilizado.

Sempre priorizar composição ao invés de duplicação.

---

# Estado da aplicação

Utilizar estado local sempre que possível.

Somente criar estado global quando realmente necessário.

Evitar adicionar bibliotecas antes que exista uma necessidade real.

---

# Banco de Dados

O banco deve ser organizado por entidades.

Estrutura inicial prevista:

- users
- profiles
- transactions
- categories
- goals
- accounts
- assets
- challenges
- streaks
- xp
- levels
- achievements
- insights

Novas tabelas somente devem ser criadas quando fizerem parte do roadmap do produto.

---

# Inteligência Artificial

A IA é uma camada interna do sistema.

Ela nunca será implementada diretamente nas telas.

Toda lógica relacionada à IA deve ficar isolada em serviços específicos.

As telas apenas exibem os resultados gerados por esses serviços.

---

# Organização do Código

Cada arquivo deve possuir uma única responsabilidade.

Funções longas devem ser divididas.

Evitar arquivos excessivamente grandes.

Priorizar nomes claros para arquivos, funções e componentes.

Código deve ser escrito pensando em fácil leitura.

---

# Dependências

Adicionar uma nova biblioteca somente quando ela resolver um problema real.

Sempre avaliar se o próprio React Native, Expo ou Supabase já oferecem uma solução.

Quanto menos dependências externas, melhor.

---

# Débito técnico

## Casts manuais de tipos do Supabase

Existem casts manuais do tipo `as unknown as X[]` em `transactionsService.ts`, `dashboardService.ts` (e possivelmente em outros services que venham a fazer joins/embeds no futuro). Eles existem porque o client do Supabase (`@supabase/supabase-js`) não infere corretamente relações 1-para-1 (ex.: `accounts(nome)`, `categories(nome)`) sem tipos gerados a partir do schema real do banco — sem esses tipos, o client assume que todo embed é uma lista (`{ nome: any }[]`), mesmo quando a relação é de um único registro.

A solução definitiva é rodar `supabase gen types typescript` e substituir os tipos manuais dos services pelos tipos gerados, eliminando a necessidade desses casts.

Isso deve ser feito num momento de limpeza técnica dedicado, não durante uma sprint de feature nova — não bloqueia nenhuma funcionalidade atual, é só uma questão de tipagem mais correta e menos manutenção manual a cada novo service.

---

# Evolução do Projeto

O projeto será desenvolvido em pequenos incrementos.

Cada Sprint deve entregar uma funcionalidade completa e utilizável.

Nunca iniciar uma nova funcionalidade antes da anterior estar concluída.

---

# Princípios

Todas as decisões técnicas devem seguir estes princípios:

- Simplicidade acima de complexidade.
- Código limpo acima de código inteligente.
- Reutilização acima de duplicação.
- Funcionalidade antes de otimização.
- Entregar valor antes de adicionar novas features.

---

# Regra de Ouro

Em qualquer dúvida durante o desenvolvimento, aplicar esta ordem de prioridade:

1. Resolver o problema do usuário.
2. Manter o código simples.
3. Evitar retrabalho.
4. Reutilizar o que já existe.
5. Entregar uma solução funcional.

O objetivo do Tá Sobrando não é possuir a arquitetura mais sofisticada.

O objetivo é construir um produto sólido, fácil de evoluir e que possa ser colocado em produção o mais rápido possível.
