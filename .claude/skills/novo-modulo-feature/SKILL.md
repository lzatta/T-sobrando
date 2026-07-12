---
name: novo-modulo-feature
description: Use esta skill sempre que for criar uma nova funcionalidade (feature) no Tá Sobrando — por exemplo, ao iniciar uma nova Sprint do ROADMAP.md como Metas, Gamificação, Transações. Garante que o módulo siga exatamente o padrão de pastas e o fluxo Tela → Hook → Service → Supabase definidos em ARCHITECTURE.md.
---

# Novo módulo de feature — Tá Sobrando

Todo módulo novo dentro de `features/` deve seguir esta estrutura, sem exceção:

```
features/
  nome-da-feature/
    NomeScreen.tsx        → tela, só chama o hook e renderiza
    useNomeFeature.ts      → hook, orquestra estado e chama o service
    nomeFeatureService.ts  → toda regra de negócio e acesso ao Supabase
    types.ts               → tipos específicos dessa feature
    components/            → componentes usados só dentro dessa feature
```

## Ordem de implementação

1. **Types primeiro** — definir os tipos TypeScript da feature antes de qualquer código, incluindo o schema Zod de validação se houver formulário envolvido.
2. **Service** — funções puras que conversam com o Supabase. Nunca colocar lógica de negócio na tela ou no hook. O service é a única camada que importa o client do Supabase.
3. **Hook** — consome o service, mantém estado local (useState/useReducer). Só criar um store global (Zustand) se o estado precisar ser compartilhado entre features diferentes — verificar isso antes de criar.
4. **Tela** — consome o hook, nunca chama o service diretamente, nunca importa o Supabase.
5. **Componentes** — antes de criar um componente novo, verificar em `components/` (compartilhados) se já existe algo reaproveitável.

## Checklist antes de considerar o módulo pronto

- [ ] Nenhum arquivo de tela importa `@supabase/supabase-js` diretamente
- [ ] Toda regra de negócio está no service, não espalhada entre hook e tela
- [ ] Validação de formulário via Zod + React Hook Form, se houver input do usuário
- [ ] Nenhuma tabela nova foi criada além das combinadas para a sprint atual
- [ ] Nenhuma dependência nova foi instalada sem checar se Expo/React Native/Supabase já resolvem
- [ ] O módulo responde positivamente às 6 perguntas do PRODUCT.md (resolve problema real, incentiva mudança de comportamento, baixa fricção, simples, gera valor, alinhado à filosofia)

## Quando parar e perguntar

Se, ao implementar, a feature exigir uma tabela nova não prevista, uma dependência nova, ou tocar em uma feature de sprint futura (ex: implementar Gamificação sendo que a Sprint atual é Metas) — parar e perguntar ao Product Owner antes de continuar, conforme CLAUDE.md.
