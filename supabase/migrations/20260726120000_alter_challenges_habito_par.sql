-- challenges deixa de ter um gerador de IA próprio: o desafio ativo é derivado
-- deterministicamente do habit_pair de maior prioridade (ver plano técnico da
-- Sprint 4, passo 4) — meta_id/categoria_gasto eram do modelo antigo e nunca
-- seriam preenchidos sob esse novo desenho.
alter table public.challenges
  drop column meta_id,
  drop column categoria_gasto,
  add column habito_par_id uuid references public.habit_pairs (id) on delete set null;
