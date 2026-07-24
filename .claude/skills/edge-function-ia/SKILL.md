---
name: edge-function-ia
description: Use esta skill sempre que for criar ou modificar qualquer funcionalidade que envolva chamada a uma API de IA (Anthropic ou outro provedor) no Tá Sobrando — por exemplo, gerar-desafio, ou qualquer recomendação/insight futuro gerado por modelo de linguagem.
---

# Edge Function + IA — Tá Sobrando

## Arquitetura obrigatória

A chamada para qualquer API de IA nunca acontece direto do app mobile. O app sempre chama uma Supabase Edge Function, que por sua vez chama o provedor de IA. A chave de API do provedor é configurada como secret da Edge Function (`supabase secrets set NOME_DA_CHAVE=...`), nunca como variável `EXPO_PUBLIC_...` no `.env` do app — isso a exporia dentro do próprio aplicativo instalado.

O deploy da function (`supabase functions deploy nome-da-function`) e a configuração da secret são sempre passos manuais do Product Owner — a sessão do Claude Code não tem acesso de rede para fazer isso diretamente.

## Escolha de modelo

Usar Claude Haiku (o mais recente disponível) para tarefas de classificação, resumo e geração de texto curto — é a opção mais barata e rápida, adequada para a maioria das necessidades do produto. Só considerar um modelo mais caro (Sonnet, Opus) se houver uma necessidade real de raciocínio mais complexo, justificando o custo adicional.

## Formato de resposta da IA

Sempre usar tool use forçado (schema estruturado), nunca parsing de texto livre. Isso evita que uma variação natural na resposta da IA quebre o código que processa o resultado.

## Tom das recomendações — obrigatório

Toda vez que a IA gerar texto que será exibido diretamente ao usuário (recomendação, desafio, insight, resumo de perfil), o prompt enviado à IA deve incluir, como instrução de sistema, o texto completo da seção "Tom das recomendações" do PRODUCT.md — não uma referência resumida ou parafraseada. Isso garante que o texto já nasça no tom certo (ganho, não restrição disfarçada), em vez de depender de revisão posterior.

## Dado derivado caro (cache explícito)

Resultado de chamada de IA é dado derivado caro — deve ser armazenado como cache explícito (campo de resultado + campo de timestamp de quando foi calculado), nunca recalculado a cada tela aberta. O cache é atualizado sempre que a fonte que o originou mudar (ex.: recalcular perfil quando a triagem for refeita), nunca deixado desatualizado silenciosamente. Isso é diferente de dado derivado barato e determinístico (somas, contagens), que deve sempre ser calculado na hora e nunca armazenado.

## Controle de custo

Toda geração de conteúdo por IA deve ser disparada por ação explícita do usuário ou por um evento pontual e raro (ex.: completar a triagem), nunca automaticamente a cada carregamento de tela ou em loop. Antes de conectar uma Edge Function de IA a um botão real, considerar um limite simples de geração por usuário por dia, como proteção contra bug de disparo repetido.

## Antes de implementar

Verifique se a secret necessária já está configurada no projeto (pergunte ao Product Owner se não tiver certeza) e apresente o texto exato do prompt enviado à IA para revisão antes de aplicar — o tom e o conteúdo desse prompt são decisão de produto, não só de código.
