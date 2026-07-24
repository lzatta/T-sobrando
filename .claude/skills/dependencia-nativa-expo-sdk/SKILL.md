---
name: dependencia-nativa-expo-sdk
description: Use esta skill sempre que for adicionar uma dependência nativa nova (qualquer pacote que não seja JavaScript puro, ex. bibliotecas com módulos Android/iOS), atualizar a versão do Expo SDK, ou resolver erro de instalação/versão relacionado a isso no Tá Sobrando.
---

# Dependência nativa e versão do Expo SDK — Tá Sobrando

## Antes de escolher ou atualizar a versão do Expo SDK

Não presumir que a versão de SDK mais recente publicada pela Expo é a que está disponível no Expo Go das lojas (Apple/Google). Frequentemente o Expo Go das lojas fica travado numa versão mais antiga, por atraso na aprovação da própria loja. Confirmar isso antes de decidir a versão do projeto — se necessário, pesquisar qual é a versão de SDK atualmente disponível no Expo Go, e não apenas a mais recente lançada.

## Ao adicionar qualquer dependência nativa

Baixar o manifesto oficial (`bundledNativeModules.json`) do pacote `expo` da versão de SDK exata usada no projeto, e usar as versões de cada módulo nativo listadas ali — não a versão mais recente publicada no npm. Isso evita incompatibilidade entre o binário pré-compilado do Expo Go e a versão da biblioteca instalada.

## Ao remover uma dependência

Não presumir que "sem uso direto no código" significa "sem necessidade real". Verificar se a dependência é peer dependency obrigatória de outra biblioteca já em uso (ex.: `react-native-worklets` sendo exigido pelo motor do NativeWind, mesmo sem nenhuma importação direta no código do projeto) antes de remover.

## Checklist obrigatório antes de commitar qualquer mudança em `package.json`/`package-lock.json`

1. Apagar `node_modules` e `package-lock.json`, rodar `npm install` puro — sem `--legacy-peer-deps`, sem `--force`. Se só instalar com uma dessas flags, existe um conflito de versão real não resolvido; não commitar nesse estado, mesmo que o bundle compile na sessão de desenvolvimento.
2. Validar com `tsc --noEmit` e `expo export --platform web` antes de considerar a mudança pronta.
3. No resumo da mudança, informar explicitamente se a instalação foi testada do zero sem flags de compatibilidade forçada, ou dizer com todas as letras se isso não foi possível de testar.

## Contexto de ambiente

O Product Owner testa a instalação no Windows, sem as flags de compatibilidade forçada eventualmente usadas na sessão de desenvolvimento. Uma instalação que só funciona com `--legacy-peer-deps` ou `--force` deve ser tratada como não resolvida, mesmo que funcione na sessão atual.
