import { useRouter } from 'expo-router'
import { useEffect, useRef } from 'react'
import { Animated, Dimensions, Modal, Pressable, Text, View } from 'react-native'
import { useSignOut } from '../features/auth/useSignOut'
import { useSession } from '../stores/AuthContext'
import { useMenuLateral } from '../stores/MenuLateralContext'

const LARGURA_MENU = Math.min(Dimensions.get('window').width * 0.8, 320)

const LINKS = [
  { href: '/(app)/transacoes', label: 'Transações' },
  { href: '/(app)/categorias', label: 'Categorias' },
  { href: '/(app)/extrato-instituicao', label: 'Extrato por instituição' },
  { href: '/(app)/patrimonio', label: 'Patrimônio' },
  { href: '/(app)/configuracoes', label: 'Configurações' },
] as const

export function MenuLateral() {
  const { aberto, fechar } = useMenuLateral()
  const { session } = useSession()
  const { submit: sair, isSigningOut } = useSignOut()
  const router = useRouter()
  const posicaoX = useRef(new Animated.Value(-LARGURA_MENU)).current

  useEffect(() => {
    Animated.timing(posicaoX, {
      toValue: aberto ? 0 : -LARGURA_MENU,
      duration: 220,
      useNativeDriver: true,
    }).start()
  }, [aberto, posicaoX])

  function navegar(href: (typeof LINKS)[number]['href']) {
    fechar()
    router.push(href)
  }

  const inicial = session?.user.email?.charAt(0).toUpperCase() ?? '?'

  return (
    <Modal visible={aberto} transparent animationType="none" onRequestClose={fechar}>
      <Pressable className="flex-1 bg-black/50" onPress={fechar}>
        <Animated.View
          style={{ width: LARGURA_MENU, transform: [{ translateX: posicaoX }] }}
          className="h-full gap-24 bg-background pt-64 dark:bg-background-dark"
        >
          <Pressable onPress={(event) => event.stopPropagation()} className="flex-1 gap-24 px-24 pb-32">
            <View className="flex-row items-start justify-between">
              <View className="gap-12">
                <View className="h-48 w-48 items-center justify-center rounded-full bg-primary">
                  <Text className="text-lg font-semibold text-background">{inicial}</Text>
                </View>
                <View>
                  <Text className="text-text-primary dark:text-text-primary-dark">{session?.user.email}</Text>
                  <Text className="text-text-secondary dark:text-text-secondary-dark">Nível 1 · 0 XP</Text>
                </View>
              </View>
              <Pressable onPress={fechar} hitSlop={12}>
                <Text className="text-xl text-text-secondary dark:text-text-secondary-dark">✕</Text>
              </Pressable>
            </View>

            <View className="gap-16">
              {LINKS.map((link) => (
                <Pressable key={link.href} onPress={() => navegar(link.href)}>
                  <Text className="text-text-primary dark:text-text-primary-dark">{link.label}</Text>
                </Pressable>
              ))}
            </View>

            <View className="flex-1 justify-end">
              <Pressable onPress={sair} disabled={isSigningOut}>
                <Text className="text-error">{isSigningOut ? 'Saindo...' : 'Sair'}</Text>
              </Pressable>
            </View>
          </Pressable>
        </Animated.View>
      </Pressable>
    </Modal>
  )
}
