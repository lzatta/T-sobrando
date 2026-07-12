import { ActivityIndicator, Pressable, Text, type PressableProps } from 'react-native'

type ButtonProps = PressableProps & {
  label: string
  variant?: 'primary' | 'secondary'
  loading?: boolean
}

export function Button({ label, variant = 'primary', loading = false, disabled, ...props }: ButtonProps) {
  const isPrimary = variant === 'primary'
  const isDisabled = disabled || loading

  return (
    <Pressable
      disabled={isDisabled}
      className={`items-center justify-center rounded border py-12 px-16 ${
        isPrimary ? 'border-primary bg-primary' : 'border-border bg-transparent dark:border-border-dark'
      } ${isDisabled ? 'opacity-50' : ''}`}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={isPrimary ? '#FFFFFF' : '#2F6F4F'} />
      ) : (
        <Text className={isPrimary ? 'font-semibold text-background' : 'font-semibold text-primary'}>
          {label}
        </Text>
      )}
    </Pressable>
  )
}
