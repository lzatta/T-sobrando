-- Fase 1 do redesenho de Desafios: check-in diário substitui a conclusão
-- única para desafios de origem comportamental. "consolidado" é um status
-- novo e final, separado de concluido/descartado — o hábito virou automático.
alter table public.challenges
  add column origem text not null default 'comportamental' check (origem in ('comportamental', 'financeira')),
  add column ultimo_marco_perguntado integer;

-- nome do constraint segue a convenção padrão do Postgres pra check inline
-- (<tabela>_<coluna>_check) — se o nome real for outro, o ALTER abaixo falha
-- e precisa ser ajustado manualmente antes de reaplicar
alter table public.challenges drop constraint challenges_status_check;
alter table public.challenges add constraint challenges_status_check
  check (status in ('ativo', 'concluido', 'descartado', 'consolidado'));

create table public.habit_checkins (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  data date not null,
  tipo text not null check (tipo in ('cumprido', 'falhou')),
  descricao text,
  -- pergunta_ia/resposta_pergunta_ia são da Fase 3 (ainda não usadas) —
  -- criadas já aqui pra não exigir outra migration de coluna depois
  pergunta_ia text,
  resposta_pergunta_ia text,
  created_at timestamptz not null default now(),
  unique (challenge_id, data)
);

alter table public.habit_checkins enable row level security;

create policy "habit_checkins_select_own"
  on public.habit_checkins for select
  using (auth.uid() = user_id);

create policy "habit_checkins_insert_own"
  on public.habit_checkins for insert
  with check (auth.uid() = user_id);

create policy "habit_checkins_update_own"
  on public.habit_checkins for update
  using (auth.uid() = user_id);

create policy "habit_checkins_delete_own"
  on public.habit_checkins for delete
  using (auth.uid() = user_id);
