import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="nova-transacao" options={{ headerShown: true, title: 'Nova transação' }} />
      <Stack.Screen name="transacoes" options={{ headerShown: true, title: 'Transações' }} />
      <Stack.Screen name="categorias" options={{ headerShown: true, title: 'Categorias' }} />
      <Stack.Screen
        name="extrato-instituicao"
        options={{ headerShown: true, title: 'Extrato por instituição' }}
      />
      <Stack.Screen name="patrimonio" options={{ headerShown: true, title: 'Patrimônio' }} />
      <Stack.Screen name="nova-meta" options={{ headerShown: true, title: 'Nova meta' }} />
      <Stack.Screen name="configuracoes" options={{ headerShown: true, title: 'Configurações' }} />
    </Stack>
  )
}
