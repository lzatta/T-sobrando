import { Link } from 'expo-router'
import { Controller } from 'react-hook-form'
import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { useForgotPassword } from './useForgotPassword'

export function ForgotPasswordScreen() {
  const { form, authError, emailSent, submit } = useForgotPassword()
  const { control, formState } = form

  if (emailSent) {
    return (
      <View className="flex-1 justify-center gap-16 bg-background px-24 dark:bg-background-dark">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
          Verifique seu e-mail
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark">
          Enviamos um link para redefinir sua senha.
        </Text>
        <Link href="/(auth)/login" className="text-primary">
          Voltar para o login
        </Link>
      </View>
    )
  }

  return (
    <View className="flex-1 justify-center gap-16 bg-background px-24 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
        Recuperar senha
      </Text>

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

      {authError ? <Text className="text-error">{authError}</Text> : null}

      <Button label="Enviar link" onPress={submit} loading={formState.isSubmitting} />

      <Link href="/(auth)/login" className="text-center text-primary">
        Voltar para o login
      </Link>
    </View>
  )
}
