import { KeyboardAvoidingView, Platform, ScrollView, Text } from 'react-native'
import { Button } from '../../components/Button'
import { CampoMonetario } from '../../components/CampoMonetario'
import { Input } from '../../components/Input'
import { SeletorData } from '../../components/SeletorData'
import { SeletorModal } from '../../components/SeletorModal'
import { CATEGORIAS_META } from './types'
import { useNovaMeta } from './useNovaMeta'

export function NovaMetaScreen() {
  const {
    nome,
    setNome,
    categoria,
    alterarCategoria,
    categoriaOutro,
    setCategoriaOutro,
    valorAlvo,
    setValorAlvo,
    prazo,
    setPrazo,
    formError,
    isSaving,
    salvar,
  } = useNovaMeta()

  return (
    <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerClassName="gap-16 px-24 pt-24 pb-32"
      >
        <Input label="Nome da meta" value={nome} onChangeText={setNome} />

        <SeletorModal
          label="Categoria"
          opcoes={CATEGORIAS_META}
          valor={categoria}
          onChange={alterarCategoria}
          placeholder="Selecione a categoria"
        />

        {categoria === 'outro' && <Input label="Qual?" value={categoriaOutro} onChangeText={setCategoriaOutro} />}

        <CampoMonetario label="Valor alvo" value={valorAlvo} onChangeValue={setValorAlvo} />

        <SeletorData label="Prazo" valor={prazo} onChange={setPrazo} minimumDate={new Date()} />

        {formError ? <Text className="text-error">{formError}</Text> : null}

        <Button label="Salvar" onPress={salvar} loading={isSaving} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
