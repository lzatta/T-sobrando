import { useState } from 'react'
import { KeyboardAvoidingView, Modal, Platform, Pressable, Text } from 'react-native'
import { Button } from '../../../components/Button'
import { CampoMonetario } from '../../../components/CampoMonetario'
import { calcularReducaoDias } from '../calcularAporte'
import { aportar } from '../goalsService'
import { aporteSchema, type Meta } from '../types'

type AporteModalProps = {
  meta: Meta | null
  onFechar: () => void
  onConfirmado: () => void
}

export function AporteModal({ meta, onFechar, onConfirmado }: AporteModalProps) {
  const [valor, setValor] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)

  const resultadoValidado = aporteSchema.safeParse({ valor })
  const resultado =
    meta && resultadoValidado.success
      ? calcularReducaoDias(meta.valor_alvo, meta.valor_atual, meta.prazo, resultadoValidado.data.valor)
      : null

  function fechar() {
    setValor('')
    setError(null)
    onFechar()
  }

  async function confirmar() {
    if (!meta || !resultadoValidado.success) {
      setError(resultadoValidado.success ? null : resultadoValidado.error.issues[0].message)
      return
    }

    setError(null)
    setIsSaving(true)
    try {
      await aportar(meta.id, meta.valor_atual + resultadoValidado.data.valor)
      setValor('')
      onConfirmado()
    } catch (err) {
      console.error('[AporteModal] falha ao aportar:', err)
      setError('Não foi possível registrar o aporte.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Modal visible={meta !== null} transparent animationType="slide" onRequestClose={fechar}>
      <Pressable className="flex-1 justify-end bg-black/50" onPress={fechar}>
        <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <Pressable className="gap-16 rounded-t bg-background p-24 dark:bg-background-dark">
            <Text className="text-lg font-semibold text-text-primary dark:text-text-primary-dark">
              Aportar em {meta?.nome}
            </Text>

            <CampoMonetario label="Valor do aporte" value={valor} onChangeValue={setValor} />

            {resultado?.tipo === 'concluida' && (
              <Text className="font-semibold text-success">Esse aporte conclui a meta.</Text>
            )}
            {resultado?.tipo === 'prazo_vencido' && (
              <Text className="text-text-secondary dark:text-text-secondary-dark">
                O prazo dessa meta já passou — vale revisar a data.
              </Text>
            )}
            {resultado?.tipo === 'normal' &&
              (resultado.diasReduzidos > 0 ? (
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  Esse aporte reduz sua meta em {resultado.diasReduzidos}{' '}
                  {resultado.diasReduzidos === 1 ? 'dia' : 'dias'}.
                </Text>
              ) : (
                <Text className="text-text-secondary dark:text-text-secondary-dark">
                  Esse aporte te aproxima da meta.
                </Text>
              ))}

            {error ? <Text className="text-error">{error}</Text> : null}

            <Button label="Confirmar aporte" onPress={confirmar} loading={isSaving} />
          </Pressable>
        </KeyboardAvoidingView>
      </Pressable>
    </Modal>
  )
}
