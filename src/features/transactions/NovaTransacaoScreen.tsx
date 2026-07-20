import { Link } from 'expo-router'
import { KeyboardAvoidingView, Platform, ScrollView, Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { CampoMonetario } from '../../components/CampoMonetario'
import { Input } from '../../components/Input'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { SeletorData } from '../../components/SeletorData'
import { SeletorModal } from '../../components/SeletorModal'
import { INSTITUICOES } from '../../constants/instituicoes'
import { useNovaTransacao } from './useNovaTransacao'

export function NovaTransacaoScreen() {
  const {
    categoriasFiltradas,
    tipo,
    alterarTipo,
    valor,
    setValor,
    instituicao,
    alterarInstituicao,
    instituicaoOutro,
    setInstituicaoOutro,
    categoryId,
    setCategoryId,
    descricao,
    setDescricao,
    data,
    setData,
    formError,
    isSaving,
    salvar,
  } = useNovaTransacao()

  const opcoesCategoria = categoriasFiltradas.map((categoria) => ({ value: categoria.id, label: categoria.nome }))

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerClassName="gap-16 px-24 pt-24 pb-32"
      >
        <SegmentedToggle
          opcoes={[
            { value: 'despesa', label: 'Despesa' },
            { value: 'receita', label: 'Receita' },
          ]}
          valor={tipo}
          onChange={alterarTipo}
        />

        <CampoMonetario label="Valor" value={valor} onChangeValue={setValor} />

        <Input label="Descrição (opcional)" value={descricao} onChangeText={setDescricao} />

        <SeletorData label="Data" valor={data} onChange={setData} maximumDate={new Date()} />

        <SeletorModal
          label="Instituição"
          opcoes={INSTITUICOES}
          valor={instituicao}
          onChange={alterarInstituicao}
          placeholder="Selecione a instituição"
        />

        {instituicao === 'outro' && (
          <Input label="Qual?" value={instituicaoOutro} onChangeText={setInstituicaoOutro} />
        )}

        {opcoesCategoria.length > 0 ? (
          <SeletorModal
            label="Categoria"
            opcoes={opcoesCategoria}
            valor={categoryId}
            onChange={setCategoryId}
            placeholder="Selecione a categoria"
          />
        ) : (
          <View className="gap-8">
            <Text className="text-text-secondary dark:text-text-secondary-dark">
              Você ainda não tem nenhuma categoria de {tipo === 'despesa' ? 'despesa' : 'receita'} cadastrada.
            </Text>
            <Link href="/(app)/categorias" className="text-primary">
              Criar uma categoria
            </Link>
          </View>
        )}

        {formError ? <Text className="text-error">{formError}</Text> : null}

        <Button label="Salvar" onPress={salvar} loading={isSaving} disabled={opcoesCategoria.length === 0} />
      </ScrollView>
    </KeyboardAvoidingView>
  )
}
