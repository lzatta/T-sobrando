import { Stack } from 'expo-router'

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="nova-transacao" options={{ headerShown: true, title: 'Nova transação' }} />
      <Stack.Screen name="categorias" options={{ headerShown: true, title: 'Categorias' }} />
      <Stack.Screen name="contas" options={{ headerShown: true, title: 'Contas' }} />
    </Stack>
  )
}
