import { ScrollView, Text } from 'react-native'
import { Button } from '../../components/Button'
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

      <Input label="Valor" keyboardType="numeric" value={valor} onChangeText={setValor} />

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

      {opcoesCategoria.length > 0 && (
        <SeletorModal
          label="Categoria (opcional)"
          opcoes={opcoesCategoria}
          valor={categoryId}
          onChange={(value) => setCategoryId(value === categoryId ? undefined : value)}
          placeholder="Selecione a categoria"
        />
      )}

      {formError ? <Text className="text-error">{formError}</Text> : null}

      <Button label="Salvar" onPress={salvar} loading={isSaving} />
    </ScrollView>
  )
}
