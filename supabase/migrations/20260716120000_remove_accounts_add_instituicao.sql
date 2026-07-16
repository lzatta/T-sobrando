-- Remove account_id de transactions (e a FK/constraint junto)
alter table public.transactions drop column account_id;

-- Adiciona o campo de instituição diretamente na transação
alter table public.transactions
  add column instituicao text not null check (instituicao in (
    'nubank', 'itau', 'bradesco', 'banco_do_brasil', 'caixa', 'santander',
    'inter', 'c6', 'btg', 'xp', 'picpay', 'mercado_pago', 'neon', 'outro'
  )),
  add column instituicao_outro text;

-- Remove a tabela accounts (fluxo de "criar conta" deixou de existir)
drop table public.accounts;

-- Atualiza o trigger de cadastro: para de criar a conta "Carteira" padrão
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id)
  values (new.id);

  insert into public.categories (user_id, nome, tipo)
  values
    (new.id, 'Salário', 'receita'),
    (new.id, 'Alimentação', 'despesa'),
    (new.id, 'Transporte', 'despesa'),
    (new.id, 'Moradia', 'despesa'),
    (new.id, 'Lazer', 'despesa'),
    (new.id, 'Saúde', 'despesa'),
    (new.id, 'Outros', 'despesa');

  return new;
end;
$$;
