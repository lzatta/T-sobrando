import DateTimePicker from '@react-native-community/datetimepicker'
import { useState } from 'react'
import { Platform, Pressable, Text, View } from 'react-native'

type SeletorDataProps = {
  label: string
  valor: Date
  onChange: (data: Date) => void
  maximumDate?: Date
}

export function SeletorData({ label, valor, onChange, maximumDate }: SeletorDataProps) {
  const [aberto, setAberto] = useState(false)

  return (
    <View className="gap-4">
      <Text className="text-text-secondary dark:text-text-secondary-dark">{label}</Text>

      <Pressable
        onPress={() => setAberto(true)}
        className="rounded border border-border px-16 py-12 dark:border-border-dark"
      >
        <Text className="text-text-primary dark:text-text-primary-dark">{valor.toLocaleDateString('pt-BR')}</Text>
      </Pressable>

      {aberto && (
        <DateTimePicker
          value={valor}
          mode="date"
          display="default"
          maximumDate={maximumDate}
          onChange={(_event, dataSelecionada) => {
            setAberto(Platform.OS === 'ios')
            if (dataSelecionada) onChange(dataSelecionada)
          }}
        />
      )}
    </View>
  )
}
