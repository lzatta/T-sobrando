create table public.assets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  nome text not null,
  tipo text not null check (tipo in ('imovel', 'veiculo', 'investimento', 'outro')),
  valor_estimado numeric(12, 2) not null check (valor_estimado >= 0),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.assets enable row level security;

create policy "assets_select_own"
  on public.assets for select
  using (auth.uid() = user_id);

create policy "assets_insert_own"
  on public.assets for insert
  with check (auth.uid() = user_id);

create policy "assets_update_own"
  on public.assets for update
  using (auth.uid() = user_id);

create policy "assets_delete_own"
  on public.assets for delete
  using (auth.uid() = user_id);

create trigger set_assets_updated_at
  before update on public.assets
  for each row
  execute function public.handle_updated_at();
