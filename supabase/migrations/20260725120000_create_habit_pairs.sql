create table public.habit_pairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  habito_ruim jsonb not null,
  habito_substituto jsonb not null,
  prioridade integer not null default 0,
  -- gerado_em é o timestamp do cache de IA (ver CLAUDE.md > Banco de dados);
  -- habito_ruim/habito_substituto só mudam junto com uma nova geração.
  -- prioridade é editável pelo usuário depois de gerado, por isso não faz
  -- parte do cache — nunca é sobrescrita silenciosamente por um recálculo
  gerado_em timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.habit_pairs enable row level security;

create policy "habit_pairs_select_own"
  on public.habit_pairs for select
  using (auth.uid() = user_id);

create policy "habit_pairs_insert_own"
  on public.habit_pairs for insert
  with check (auth.uid() = user_id);

create policy "habit_pairs_update_own"
  on public.habit_pairs for update
  using (auth.uid() = user_id);

create policy "habit_pairs_delete_own"
  on public.habit_pairs for delete
  using (auth.uid() = user_id);

create trigger set_habit_pairs_updated_at
  before update on public.habit_pairs
  for each row
  execute function public.handle_updated_at();
