create table public.triagem_respostas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users (id) on delete cascade,
  respostas jsonb not null default '{}'::jsonb,
  -- cache do resultado de IA sobre `respostas`; sempre reescrito junto com `respostas`
  -- no mesmo upsert, nunca calculado à parte (ver CLAUDE.md > Banco de dados)
  perfil_calculado jsonb,
  perfil_calculado_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.triagem_respostas enable row level security;

create policy "triagem_respostas_select_own"
  on public.triagem_respostas for select
  using (auth.uid() = user_id);

create policy "triagem_respostas_insert_own"
  on public.triagem_respostas for insert
  with check (auth.uid() = user_id);

create policy "triagem_respostas_update_own"
  on public.triagem_respostas for update
  using (auth.uid() = user_id);

create trigger set_triagem_respostas_updated_at
  before update on public.triagem_respostas
  for each row
  execute function public.handle_updated_at();
