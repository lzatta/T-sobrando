import { useRouter } from 'expo-router'
import { Tabs } from 'expo-router'
import { BotaoTabCentral } from '../../../components/BotaoTabCentral'
import { MenuLateral } from '../../../components/MenuLateral'
import { MenuLateralProvider } from '../../../stores/MenuLateralContext'

export default function TabsLayout() {
  const router = useRouter()

  return (
    <MenuLateralProvider>
      <Tabs screenOptions={{ headerShown: false }}>
        <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
        <Tabs.Screen name="habitos" options={{ title: 'Hábitos' }} />
        <Tabs.Screen
          name="nova-transacao-atalho"
          options={{ title: '', tabBarButton: BotaoTabCentral }}
          listeners={{
            tabPress: (event) => {
              event.preventDefault()
              router.push('/(app)/nova-transacao')
            },
          }}
        />
        <Tabs.Screen name="metas" options={{ title: 'Metas' }} />
        <Tabs.Screen name="desafios" options={{ title: 'Desafios' }} />
      </Tabs>
      <MenuLateral />
    </MenuLateralProvider>
  )
}
