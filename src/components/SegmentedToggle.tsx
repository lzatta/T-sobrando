import { Pressable, Text, View } from 'react-native'

type Opcao<T extends string> = { value: T; label: string }

type SegmentedToggleProps<T extends string> = {
  opcoes: Opcao<T>[]
  valor: T
  onChange: (value: T) => void
}

export function SegmentedToggle<T extends string>({ opcoes, valor, onChange }: SegmentedToggleProps<T>) {
  return (
    <View className="flex-row gap-12">
      {opcoes.map((opcao) => (
        <Pressable
          key={opcao.value}
          onPress={() => onChange(opcao.value)}
          className={`flex-1 items-center rounded border p-12 ${
            valor === opcao.value ? 'border-primary' : 'border-border dark:border-border-dark'
          }`}
        >
          <Text
            className={
              valor === opcao.value ? 'font-semibold text-primary' : 'text-text-primary dark:text-text-primary-dark'
            }
          >
            {opcao.label}
          </Text>
        </Pressable>
      ))}
    </View>
  )
}
