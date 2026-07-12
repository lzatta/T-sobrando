---
name: gerenciamento-dependencias
description: Use esta skill sempre que for adicionar, remover, atualizar versão, ou resolver conflito de dependências no projeto Tá Sobrando.
---

# Gerenciamento de dependências — Tá Sobrando

O Product Owner testa a instalação no Windows, sem as flags de compatibilidade forçada usadas na sessão de desenvolvimento. Qualquer instalação que só funcione com --legacy-peer-deps ou --force deve ser tratada como não resolvida, mesmo que o bundle compile na sessão de desenvolvimento.

## Checklist obrigatório antes de commitar mudanças em package.json/package-lock.json

1. **Instalação limpa, sem flags de compatibilidade forçada**
   Apagar `node_modules` e `package-lock.json`, rodar `npm install` puro (sem `--legacy-peer-deps`, sem `--force`) e confirmar que termina sem erro de `ERESOLVE`. Se só instalar com uma dessas flags, existe um conflito de versão real não resolvido — não commitar nesse estado.

2. **Verificar uso real antes de remover ou reintroduzir uma dependência**
   Buscar o nome do pacote nos arquivos `.ts`/`.tsx` do projeto antes de removê-lo. Se uma dependência já removida anteriormente (por não ter uso real) reaparecer depois — direta ou indiretamente, por exemplo como peer dependency de outro pacote — isso deve ser reportado explicitamente ao Product Owner antes do commit, explicando a causa. Nunca resolver isso silenciosamente só ajustando versões.

3. **Reportar o resultado do teste de instalação**
   No resumo enviado após qualquer mudança de dependência, informar explicitamente: "instalação testada do zero, sem legacy-peer-deps, sem erros" — ou, caso não tenha sido possível testar dessa forma, dizer isso com todas as letras em vez de omitir.
