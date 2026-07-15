import { View } from 'react-native'

type BarraPercentualProps = {
  percentual: number
}

export function BarraPercentual({ percentual }: BarraPercentualProps) {
  const largura = Math.min(Math.max(percentual, 0), 100)

  return (
    <View className="h-8 rounded bg-border dark:bg-border-dark">
      <View className="h-8 rounded bg-primary" style={{ width: `${largura}%` }} />
    </View>
  )
}
