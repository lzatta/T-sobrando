import { Pressable, Text } from 'react-native'
import { useMenuLateral } from '../stores/MenuLateralContext'

export function BotaoMenu() {
  const { abrir } = useMenuLateral()

  return (
    <Pressable onPress={abrir} hitSlop={12}>
      <Text className="text-2xl text-text-primary dark:text-text-primary-dark">☰</Text>
    </Pressable>
  )
}
