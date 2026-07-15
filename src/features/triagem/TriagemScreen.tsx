import { Text, TextInput, View } from 'react-native'
import { Button } from '../../components/Button'
import { OpcaoCard } from './components/OpcaoCard'
import { useTriagem } from './useTriagem'

export function TriagemScreen() {
  const {
    pergunta,
    isLastStep,
    podeAvancar,
    respostas,
    isFinishing,
    error,
    selecionarOpcao,
    atualizarTexto,
    atualizarOutro,
    avancar,
  } = useTriagem()

  return (
    <View className="flex-1 justify-center gap-24 bg-background px-24 dark:bg-background-dark">
      <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
        {pergunta.texto}
      </Text>

      {pergunta.tipo === 'escolha' && (
        <View className="gap-12">
          {pergunta.opcoes.map((opcao) => (
            <OpcaoCard
              key={opcao.value}
              label={opcao.label}
              selected={respostas[pergunta.id] === opcao.value}
              onPress={() => selecionarOpcao(opcao.value)}
            />
          ))}

          {pergunta.id === 'atividade_prazer' && respostas.atividade_prazer === 'outro' && (
            <TextInput
              placeholder="Conte com suas palavras"
              placeholderTextColor="#9AA6A0"
              value={respostas.atividade_prazer_outro ?? ''}
              onChangeText={atualizarOutro}
              className="rounded border border-border px-16 py-12 text-text-primary dark:border-border-dark dark:text-text-primary-dark"
            />
          )}
        </View>
      )}

      {pergunta.tipo === 'texto' && (
        <TextInput
          placeholder="Escreva aqui (opcional)"
          placeholderTextColor="#9AA6A0"
          value={respostas[pergunta.id] ?? ''}
          onChangeText={atualizarTexto}
          multiline
          className="min-h-[96px] rounded border border-border px-16 py-12 text-text-primary dark:border-border-dark dark:text-text-primary-dark"
        />
      )}

      {error ? <Text className="text-error">{error}</Text> : null}

      <Button
        label={isLastStep ? 'Concluir' : 'Próximo'}
        onPress={avancar}
        loading={isFinishing}
        disabled={!podeAvancar}
      />
    </View>
  )
}
