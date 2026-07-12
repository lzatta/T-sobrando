import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useLogin } from './useLogin'

export function LoginScreen() {
  const { form, authError, submit } = useLogin()
  const { control, formState } = form

  return (
    <View className="flex-1 justify-center gap-16 bg-background px-24 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Entrar</Text>

      <Controller
        control={control}
        name="email"
        render={({ field }) => (
          <Input
            label="E-mail"
            autoCapitalize="none"
            keyboardType="email-address"
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.email?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field }) => (
          <Input
            label="Senha"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.password?.message}
          />
        )}
      />

      {authError ? <Text className="text-error">{authError}</Text> : null}

      <Button label="Entrar" onPress={submit} loading={formState.isSubmitting} />

      <View className="flex-row justify-between">
        <Link href="/(auth)/cadastro" className="text-primary">
          Criar conta
        </Link>
        <Link href="/(auth)/recuperar-senha" className="text-primary">
          Esqueci minha senha
        </Link>
      </View>
    </View>
  )
}
