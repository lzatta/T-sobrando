create table public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  categoria text not null check (categoria in ('viagem', 'casa', 'carro', 'educacao', 'reserva_emergencia', 'outro')),
  categoria_outro text,
  prioridade integer not null default 0,
  valor_alvo numeric(12, 2) not null check (valor_alvo > 0),
  valor_atual numeric(12, 2) not null default 0 check (valor_atual >= 0),
  prazo date not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

create policy "goals_select_own"
  on public.goals for select
  using (auth.uid() = user_id);

create policy "goals_insert_own"
  on public.goals for insert
  with check (auth.uid() = user_id);

create policy "goals_update_own"
  on public.goals for update
  using (auth.uid() = user_id);

create policy "goals_delete_own"
  on public.goals for delete
  using (auth.uid() = user_id);

create trigger set_goals_updated_at
  before update on public.goals
  for each row
  execute function public.handle_updated_at();
