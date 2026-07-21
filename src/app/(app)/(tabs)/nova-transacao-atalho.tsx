import { View } from 'react-native'

// rota nunca renderizada de fato: tabPress é interceptado no _layout
// e navega direto pra nova-transacao antes de qualquer troca de aba
export default function NovaTransacaoAtalho() {
  return <View />
}
