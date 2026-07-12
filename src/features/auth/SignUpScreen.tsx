import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useSignUp } from './useSignUp'

export function SignUpScreen() {
  const { form, authError, submit } = useSignUp()
  const { control, formState } = form

  return (
    <View className="flex-1 justify-center gap-16 bg-background px-24 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Criar conta</Text>

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

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field }) => (
          <Input
            label="Confirmar senha"
            secureTextEntry
            value={field.value}
            onChangeText={field.onChange}
            error={formState.errors.confirmPassword?.message}
          />
        )}
      />

      {authError ? <Text className="text-error">{authError}</Text> : null}

      <Button label="Criar conta" onPress={submit} loading={formState.isSubmitting} />

      <Link href="/(auth)/login" className="text-center text-primary">
        Já tenho conta
      </Link>
    </View>
  )
}
