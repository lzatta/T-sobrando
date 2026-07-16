import { Link } from 'expo-router'
import { Pressable, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { useSignOut } from '../auth/useSignOut'
import { useSession } from '../../stores/AuthContext'

export function MaisScreen() {
  const { session } = useSession()
  const { submit, isSigningOut } = useSignOut()

  return (
    <View className="flex-1 gap-16 bg-background px-24 pt-64 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Mais</Text>

      <Card className="gap-12">
        <Text className="text-text-secondary dark:text-text-secondary-dark">{session?.user.email}</Text>
        <Button label="Sair" variant="secondary" onPress={submit} loading={isSigningOut} />
      </Card>

      <Link href="/(app)/categorias" asChild>
        <Pressable>
          <Card>
            <Text className="text-text-primary dark:text-text-primary-dark">Categorias</Text>
          </Card>
        </Pressable>
      </Link>

      <Link href="/(app)/extrato-instituicao" asChild>
        <Pressable>
          <Card>
            <Text className="text-text-primary dark:text-text-primary-dark">Extrato por instituição</Text>
          </Card>
        </Pressable>
      </Link>
    </View>
  )
}
