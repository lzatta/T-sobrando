create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  meta_id uuid references public.goals (id) on delete set null,
  titulo text not null,
  descricao text not null,
  categoria_gasto text,
  status text not null default 'ativo' check (status in ('ativo', 'concluido', 'descartado')),
  -- gerado_em é o timestamp do cache de IA (ver CLAUDE.md > Banco de dados);
  -- titulo/descricao só mudam junto com uma nova geração, nunca à parte
  gerado_em timestamptz not null default now(),
  concluido_em timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.challenges enable row level security;

create policy "challenges_select_own"
  on public.challenges for select
  using (auth.uid() = user_id);

create policy "challenges_insert_own"
  on public.challenges for insert
  with check (auth.uid() = user_id);

create policy "challenges_update_own"
  on public.challenges for update
  using (auth.uid() = user_id);

create policy "challenges_delete_own"
  on public.challenges for delete
  using (auth.uid() = user_id);

create trigger set_challenges_updated_at
  before update on public.challenges
  for each row
  execute function public.handle_updated_at();

-- garante 1 desafio ativo por usuário no próprio banco, não só na lógica do app
create unique index challenges_um_ativo_por_usuario
  on public.challenges (user_id)
  where status = 'ativo';
