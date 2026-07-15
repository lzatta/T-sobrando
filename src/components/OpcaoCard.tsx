import { Pressable, Text } from 'react-native'

type OpcaoCardProps = {
  label: string
  selected: boolean
  onPress: () => void
}

export function OpcaoCard({ label, selected, onPress }: OpcaoCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className={`rounded border p-16 ${
        selected ? 'border-primary' : 'border-border dark:border-border-dark'
      }`}
    >
      <Text
        className={
          selected ? 'font-semibold text-primary' : 'text-text-primary dark:text-text-primary-dark'
        }
      >
        {label}
      </Text>
    </Pressable>
  )
}
