# ROADMAP.md

# Objetivo

Este documento define a ordem de desenvolvimento do Tá Sobrando.

Toda funcionalidade nova deve seguir esta sequência.

Não iniciar funcionalidades de uma fase futura antes da fase atual estar concluída.

---

# MVP

Objetivo:

Ter um aplicativo utilizável por um usuário real.

O usuário deve conseguir:

- criar conta;
- fazer a triagem;
- cadastrar receitas;
- cadastrar despesas;
- criar metas;
- acompanhar quanto sobrou;
- receber os primeiros insights.

Nada além disso.

---

# Sprint 1 — Fundação

Objetivo:

Criar a base do aplicativo.

Funcionalidades:

- Login
- Cadastro
- Recuperação de senha
- Onboarding
- Triagem comportamental
- Estrutura do banco
- Navegação
- Dashboard inicial

Status:

⬜ Não iniciado

---

# Sprint 2 — Controle Financeiro

Objetivo:

Permitir registrar e acompanhar a vida financeira.

Funcionalidades:

- Cadastro de receitas
- Cadastro de despesas
- Categorias
- Contas
- Patrimônio
- Dashboard funcional

Status:

⬜ Não iniciado

---

# Sprint 3 — Metas

Objetivo:

Dar propósito ao dinheiro.

Funcionalidades:

- Criar metas
- Prioridade das metas
- Progresso
- Tela de metas

Status:

⬜ Não iniciado

---

# Sprint 4 — Mudança de comportamento

Objetivo:

Começar a entregar o diferencial do produto.

Funcionalidades:

- Motor de desafios
- Recomendações simples
- Primeiro insight personalizado
- Registro de evolução

Status:

⬜ Não iniciado

---

# Sprint 5 — Gamificação

Objetivo:

Aumentar retenção.

Funcionalidades:

- XP
- Níveis
- Streak
- Conquistas

Status:

⬜ Não iniciado

---

# V1

O V1 será considerado pronto quando o usuário conseguir:

- Criar conta.
- Completar a triagem.
- Registrar receitas e despesas.
- Criar metas.
- Visualizar o dashboard.
- Receber insights.
- Participar dos desafios.
- Evoluir na gamificação.

---

# Pendências bloqueantes antes de produção com usuários reais

## Confirmação de e-mail desativada (temporário)

Confirmação de e-mail está desativada no Supabase desde 13/07/2026, para não bloquear testes internos da Sprint 1.

Antes de qualquer lançamento com usuários reais, é obrigatório:

1. Reativar a confirmação de e-mail no Supabase (Authentication → Settings).
2. Implementar deep linking no Expo Router para que o link do e-mail de confirmação abra o próprio app, em vez de cair numa URL web que não existe.

Sem isso, qualquer pessoa pode criar conta com e-mail que não é dela, sem nenhuma verificação — aceitável só durante testes internos, nunca em produção.

---

# Pós V1

Somente após validar o produto com usuários reais.

Funcionalidades previstas:

- Open Finance
- Plano Família
- Perfil público
- Ranking
- Compartilhamento de metas
- Aplicativo Desktop
- Expansão para outros hábitos

---

# Regras

Nunca desenvolver funcionalidades fora da Sprint atual.

Nunca iniciar uma Sprint sem concluir a anterior.

Caso surja uma nova ideia durante o desenvolvimento:

- avaliar;
- decidir se entra na Sprint atual;
- caso contrário, mover para Pós V1.

---

# Critério de sucesso

Cada Sprint deve terminar com uma versão funcional do aplicativo.

Ao final de cada Sprint o projeto deve estar em condições de ser executado, testado e publicado internamente.

O objetivo é evoluir continuamente através de pequenas entregas.
