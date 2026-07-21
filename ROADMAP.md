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

✅ Concluído (perfil_calculado da triagem adiado deliberadamente para a Sprint 4 — motor de recomendações; respostas já são coletadas e armazenadas)

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

✅ Concluído ("Contas" foi redesenhado para instituição direto na transação, sem cadastro de conta separado — decisão registrada em MAPEAMENTO_WIREFRAME_FINPATCH.md)

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

✅ Concluído (inclui filtro por status — em andamento/concluída/vencida — e indicação visual de meta concluída/vencida na lista; status é dado derivado, calculado a partir de valor_atual, valor_alvo e prazo, sem coluna nova no banco)

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

## Confirmação de e-mail desativada + deep linking pendente

Confirmação de e-mail está desativada no Supabase desde 13/07/2026, para não bloquear testes internos da Sprint 1.

Antes de qualquer lançamento com usuários reais, é obrigatório:

1. Reativar a confirmação de e-mail no Supabase (Authentication → Settings).
2. Implementar deep linking no Expo Router para que os links enviados por e-mail abram o próprio app, em vez de caírem numa URL web que não existe.

Esse deep linking não é exclusivo da confirmação de cadastro: o link de **recuperação de senha** (`recuperar-senha`) depende exatamente da mesma configuração para funcionar de verdade, e hoje tem o mesmo problema — o link enviado por e-mail não abre o app. Os dois fluxos (confirmação de cadastro e recuperação de senha) só funcionam em produção depois dessa configuração ser feita.

Sem isso: (a) qualquer pessoa pode criar conta com e-mail que não é dela, sem nenhuma verificação, e (b) a recuperação de senha não é utilizável de verdade — ambos aceitáveis só durante testes internos, nunca em produção.

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
