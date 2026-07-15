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

  insert into public.accounts (user_id, nome, tipo, saldo_inicial)
  values (new.id, 'Carteira', 'carteira', 0);

  return new;
end;
$$;
