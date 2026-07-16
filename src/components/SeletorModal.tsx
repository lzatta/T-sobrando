import { useState } from 'react'
import { FlatList, Modal, Pressable, Text, View } from 'react-native'

type Opcao = { value: string; label: string }

type SeletorModalProps = {
  label: string
  opcoes: readonly Opcao[]
  valor?: string
  onChange: (value: string) => void
  placeholder?: string
}

export function SeletorModal({ label, opcoes, valor, onChange, placeholder = 'Selecionar' }: SeletorModalProps) {
  const [aberto, setAberto] = useState(false)
  const selecionada = opcoes.find((opcao) => opcao.value === valor)

  return (
    <View className="gap-4">
      <Text className="text-text-secondary dark:text-text-secondary-dark">{label}</Text>

      <Pressable
        onPress={() => setAberto(true)}
        className="flex-row items-center justify-between rounded border border-border px-16 py-12 dark:border-border-dark"
      >
        <Text
          className={
            selecionada
              ? 'text-text-primary dark:text-text-primary-dark'
              : 'text-text-secondary dark:text-text-secondary-dark'
          }
        >
          {selecionada ? selecionada.label : placeholder}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark">▾</Text>
      </Pressable>

      <Modal visible={aberto} transparent animationType="slide" onRequestClose={() => setAberto(false)}>
        <Pressable className="flex-1 justify-end bg-black/50" onPress={() => setAberto(false)}>
          <Pressable className="max-h-[70%] rounded-t bg-background p-16 dark:bg-background-dark">
            <Text className="mb-12 text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              {label}
            </Text>
            <FlatList
              data={opcoes}
              keyExtractor={(item) => item.value}
              ItemSeparatorComponent={() => <View className="h-8" />}
              renderItem={({ item }) => (
                <Pressable
                  onPress={() => {
                    onChange(item.value)
                    setAberto(false)
                  }}
                  className={`rounded border p-12 ${
                    item.value === valor ? 'border-primary' : 'border-border dark:border-border-dark'
                  }`}
                >
                  <Text
                    className={
                      item.value === valor
                        ? 'font-semibold text-primary'
                        : 'text-text-primary dark:text-text-primary-dark'
                    }
                  >
                    {item.label}
                  </Text>
                </Pressable>
              )}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  )
}
