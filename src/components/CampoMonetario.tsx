import { useEffect, useState } from 'react'
import { InputAccessoryView, Keyboard, Platform, Pressable, Text, TextInput, View } from 'react-native'

type CampoMonetarioProps = {
  label: string
  value: string
  onChangeValue: (value: string) => void
  error?: string
}

const ACCESSORY_ID = 'campo-monetario-accessory'

function apenasDigitos(texto: string) {
  return texto.replace(/\D/g, '')
}

function digitosParaNumero(digitos: string) {
  if (!digitos) return 0
  return parseInt(digitos, 10) / 100
}

function numeroParaDigitos(valor: string) {
  const numero = parseFloat(valor || '0')
  if (Number.isNaN(numero)) return ''
  return Math.round(numero * 100).toString()
}

function formatarExibicao(digitos: string) {
  return digitosParaNumero(digitos).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

// máscara manual, sem biblioteca: os dígitos digitados preenchem os centavos
// da direita pra esquerda (padrão de app bancário) — evita cursor pulando
// no meio de um texto já formatado, que é o problema de mascarar direto
// a exibição
export function CampoMonetario({ label, value, onChangeValue, error }: CampoMonetarioProps) {
  const [digitos, setDigitos] = useState(() => numeroParaDigitos(value))

  // sincroniza quando o valor é resetado de fora (ex.: modal de aporte limpando
  // o campo após confirmar) — round-trip digitos -> número -> digitos é estável,
  // então isso não interfere na digitação normal
  useEffect(() => {
    setDigitos(numeroParaDigitos(value))
  }, [value])

  function handleChangeText(texto: string) {
    const novosDigitos = apenasDigitos(texto)
    setDigitos(novosDigitos)
    const novoValor = digitosParaNumero(novosDigitos)
    onChangeValue(novoValor === 0 ? '' : novoValor.toString())
  }

  return (
    <View className="gap-4">
      <Text className="text-text-secondary dark:text-text-secondary-dark">{label}</Text>

      <TextInput
        value={formatarExibicao(digitos)}
        onChangeText={handleChangeText}
        keyboardType="number-pad"
        inputAccessoryViewID={Platform.OS === 'ios' ? ACCESSORY_ID : undefined}
        className={`rounded border px-16 py-12 text-text-primary dark:text-text-primary-dark ${
          error ? 'border-error' : 'border-border dark:border-border-dark'
        }`}
      />

      {error ? <Text className="text-error">{error}</Text> : null}

      {Platform.OS === 'ios' && (
        <InputAccessoryView nativeID={ACCESSORY_ID}>
          <View className="flex-row justify-end border-t border-border bg-surface px-16 py-8 dark:border-border-dark dark:bg-surface-dark">
            <Pressable onPress={() => Keyboard.dismiss()}>
              <Text className="font-semibold text-primary">Concluído</Text>
            </Pressable>
          </View>
        </InputAccessoryView>
      )}
    </View>
  )
}
