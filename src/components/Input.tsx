import { Text, TextInput, View, type TextInputProps } from 'react-native'

type InputProps = TextInputProps & {
  label: string
  error?: string
}

export function Input({ label, error, ...props }: InputProps) {
  return (
    <View className="gap-4">
      <Text className="text-text-secondary dark:text-text-secondary-dark">{label}</Text>
      <TextInput
        className={`rounded border px-16 py-12 text-text-primary dark:text-text-primary-dark ${
          error ? 'border-error' : 'border-border dark:border-border-dark'
        }`}
        placeholderTextColor="#9AA6A0"
        {...props}
      />
      {error ? <Text className="text-error">{error}</Text> : null}
    </View>
  )
}
