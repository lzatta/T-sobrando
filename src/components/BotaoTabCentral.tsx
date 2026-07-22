import type { BottomTabBarButtonProps } from '@react-navigation/bottom-tabs'
import { useRouter } from 'expo-router'
import { Pressable, Text } from 'react-native'

export function BotaoTabCentral(_props: BottomTabBarButtonProps) {
  const router = useRouter()

  return (
    <Pressable
      onPress={() => router.push('/(app)/nova-transacao')}
      className="-top-16 h-[56px] w-[56px] items-center justify-center self-center rounded-full bg-primary"
    >
      <Text className="text-2xl font-semibold text-background">+</Text>
    </Pressable>
  )
}
