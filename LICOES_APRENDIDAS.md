# LICOES_APRENDIDAS.md

Registro de bugs não triviais já enfrentados no projeto — sintoma, causa raiz e correção — para consulta antes de iniciar qualquer tarefa nova, evitando repetir o mesmo padrão de erro.

---

## Dependências reintroduzidas sem necessidade

**Sintoma:** `react-native-reanimated` apareceu de novo no projeto depois de já ter sido removido por não ter uso real no código.

**Causa raiz:** era dependência transitiva não-opcional de `react-native-css-interop` (motor interno do NativeWind) — o npm auto-instala peers não-opcionais faltando, mesmo sem nenhuma importação direta no código.

**Lição:** antes de remover ou reintroduzir uma dependência, verificar não só se ela é importada diretamente, mas se é peer dependency obrigatória de outra já em uso. "Sem uso direto no código" não significa "sem necessidade real".

---

## Instalação só funcionando com --legacy-peer-deps

**Sintoma:** `npm install` funcionava na sessão de desenvolvimento, mas dava erro ERESOLVE no computador do Product Owner.

**Causa raiz:** usar `--legacy-peer-deps` mascara um conflito de versão real, deixando o `package-lock.json` num estado que só quebra quando alguém instala sem essa flag.

**Lição:** toda mudança em `package.json`/`package-lock.json` deve ser testada com instalação limpa, sem `--legacy-peer-deps` nem `--force`, antes de commitar — mesmo que o bundle compile normalmente na sessão de desenvolvimento.

---

## Peça nova não conectada à peça existente

**Sintoma:** usuário novo não era redirecionado para a triagem automaticamente, mesmo já existindo a lógica de guarda de rota (`useEntryRoute`).

**Causa raiz:** `useLogin.ts` navegava direto para `/(app)` — criado dois dias antes do `useEntryRoute`, que centraliza a decisão de rota. Ninguém atualizou `useLogin.ts` para passar pela guarda depois que ela foi criada.

**Lição:** ao criar um mecanismo central que decide algo (ex.: para onde navegar), verificar todos os pontos que já tomavam essa decisão de forma solta antes, e migrá-los para o novo mecanismo — não presumir que só "quem for escrito depois" vai usá-lo.

---

## Campo obrigatório inicializado como undefined

**Sintoma:** erro genérico do Zod (`Invalid input: expected string, received undefined`) aparecendo em vez da mensagem de validação amigável.

**Causa raiz:** `z.string().min(1, 'mensagem')` só aplica a mensagem customizada depois de passar na checagem de tipo — `undefined` falha antes disso. Campos inicializados como `undefined` (em vez de string vazia `''`) sempre disparam esse erro cru.

**Lição:** campos de formulário obrigatórios devem iniciar como `''`, nunca `undefined`. Para seleção única (dropdown/enum), `z.enum(..., { message })` cobre tanto vazio quanto undefined com a mensagem certa — preferir a `z.string().min()` nesses casos.

---

## Sessão órfã (usuário apagado com sessão ainda ativa)

**Sintoma:** erro `PGRST116 — Cannot coerce the result to a single JSON object` travando a entrada no app.

**Causa raiz:** `.single()` no Supabase lança erro quando a busca retorna zero linhas — aconteceu porque o usuário foi apagado diretamente no painel enquanto a sessão local ainda existia no dispositivo.

**Lição:** usar `.maybeSingle()` em vez de `.single()` sempre que "não encontrar a linha" for um resultado possível e válido (não necessariamente um erro) — e tratar esse caso explicitamente (ex.: forçar logout em sessão órfã), sem generalizar para todo tipo de erro.

---

## Base de cálculo de percentual inconsistente

**Sintoma:** percentuais de "Top Movimentações" somando mais de 100% quando exibidos juntos.

**Causa raiz:** cada item estava sendo calculado contra uma base de 100% diferente (uma para receitas, outra para despesas), em vez de uma base única.

**Lição:** ao exibir múltiplos percentuais lado a lado como se fossem parte do mesmo todo, garantir que todos usam exatamente a mesma base de cálculo — validar somando os percentuais de todos os itens do período (não só os exibidos no top 5) e conferir que bate em 100%.

---

## Versão de SDK do Expo incompatível com o Expo Go das lojas

**Sintoma:** app recusado pelo Expo Go com mensagem de incompatibilidade de versão, mesmo com o app da loja atualizado.

**Causa raiz:** o Expo Go disponível nas lojas (Apple/Google) frequentemente fica travado numa versão de SDK mais antiga que a mais recente lançada, por atraso na aprovação da própria loja.

**Lição:** ao decidir a versão do Expo SDK do projeto, confirmar qual versão está de fato disponível no Expo Go das lojas no momento (não assumir que é sempre a mais recente lançada pela Expo) — e usar o manifesto oficial (`bundledNativeModules.json`) do pacote `expo` daquela versão para alinhar todas as dependências nativas corretamente.

---

## Dado derivado caro (IA) tratado igual a dado derivado barato

**Sintoma:** decisão de remover um campo de perfil calculado, presumindo que "dado derivado nunca deve ser armazenado" se aplicava também a resultado de chamada de IA.

**Causa raiz:** a regra de "calcular sempre na hora, nunca armazenar" vale para cálculo barato e determinístico — não para resultado de IA, que tem custo real em dinheiro e latência a cada chamada.

**Lição:** distinguir dado derivado barato/determinístico (nunca armazenar) de dado derivado caro/gerado por IA (armazenar como cache explícito, com timestamp, sincronizado com a fonte sempre que ela mudar).

---

## Migrations não aplicam automaticamente

Padrão recorrente, não é bug: o ambiente onde o Claude Code roda não tem acesso de rede ao Supabase (nem para aplicar migrations, nem para ler logs de Edge Functions). Toda vez que uma sprint envolve tabela nova ou alteração de schema, a aplicação real no banco (via SQL Editor ou `supabase functions deploy`) é sempre um passo manual do Product Owner.

---

## Sucesso silencioso quando um array obrigatório vem vazio da IA

**Sintoma:** Edge Function respondia `status_code: 200`, sem nenhum erro no log, mas a tabela `habit_pairs` ficava vazia — o perfil em texto era gerado normalmente, só os pares de hábito nunca apareciam.

**Causa raiz:** o schema forçado (tool use) pedia `pares_habito` com `minItems: 1`, mas a API da Anthropic não garante esse tipo de restrição de array com o mesmo rigor que garante `required` em chaves de objeto — o modelo devolveu `pares_habito: []` em pelo menos uma chamada. Como o código nunca validava o tamanho do array antes de seguir, `[].map(...)` e `.insert([])` rodaram sem lançar nenhum erro, e a function terminou com sucesso (200) mesmo sem gravar nenhum par.

**Lição:** `minItems`/`maxItems` num schema de tool use é uma instrução pro modelo, não uma garantia da API — sempre validar explicitamente no código (`array.length > 0`) antes de prosseguir, tratando array vazio como falha real (erro lançado, não sucesso silencioso). Quando o custo de tentar de novo é baixo (uma chamada de IA), vale um retry automático único antes de desistir, em vez de só confiar na primeira resposta.
