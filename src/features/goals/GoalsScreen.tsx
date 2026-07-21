import { Link } from 'expo-router'
import { useState } from 'react'
import { FlatList, Pressable, Text, View } from 'react-native'
import { BarraPercentual } from '../../components/BarraPercentual'
import { BotaoMenu } from '../../components/BotaoMenu'
import { Button } from '../../components/Button'
import { Card } from '../../components/Card'
import { SegmentedToggle } from '../../components/SegmentedToggle'
import { AporteModal } from './components/AporteModal'
import { calcularStatusMeta, type StatusMeta } from './calcularAporte'
import { CATEGORIAS_META, type Meta } from './types'
import { useGoals } from './useGoals'

const FILTROS: { value: StatusMeta; label: string }[] = [
  { value: 'em_andamento', label: 'Em andamento' },
  { value: 'concluida', label: 'Concluídas' },
  { value: 'vencida', label: 'Vencidas' },
]

function formatarMoeda(valor: number) {
  return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function formatarData(data: string) {
  return new Date(`${data}T00:00:00`).toLocaleDateString('pt-BR')
}

function nomeCategoria(meta: Meta) {
  if (meta.categoria === 'outro') return meta.categoria_outro || 'Outro'
  return CATEGORIAS_META.find((categoria) => categoria.value === meta.categoria)?.label ?? meta.categoria
}

export function GoalsScreen() {
  const { metas, isLoading, error, remover, moverPrioridade, recarregar } = useGoals()
  const [metaAportando, setMetaAportando] = useState<Meta | null>(null)
  const [filtro, setFiltro] = useState<StatusMeta>('em_andamento')

  const metasFiltradas = metas.filter(
    (meta) => calcularStatusMeta(meta.valor_atual, meta.valor_alvo, meta.prazo) === filtro
  )

  return (
    <>
      <FlatList
        className="flex-1 bg-background dark:bg-background-dark"
        contentContainerClassName="gap-12 px-24 pt-64 pb-32"
        data={metasFiltradas}
        keyExtractor={(item) => item.id}
        refreshing={isLoading}
        ListHeaderComponent={
          <View className="gap-16 pb-4">
            <View className="flex-row items-center justify-between">
              <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">Metas</Text>
              <BotaoMenu />
            </View>
            <Link href="/(app)/nova-meta" asChild>
              <Button label="Nova meta" />
            </Link>
            <SegmentedToggle opcoes={FILTROS} valor={filtro} onChange={setFiltro} />
            {error ? <Text className="text-error">{error}</Text> : null}
          </View>
        }
        ItemSeparatorComponent={() => <View className="h-12" />}
        renderItem={({ item }) => {
          const index = metas.findIndex((meta) => meta.id === item.id)
          const progresso = item.valor_alvo > 0 ? Math.min((item.valor_atual / item.valor_alvo) * 100, 100) : 0
          const status = calcularStatusMeta(item.valor_atual, item.valor_alvo, item.prazo)

          return (
            <Card className="gap-8">
              <View className="flex-row items-center justify-between">
                <Text className="flex-1 text-text-primary dark:text-text-primary-dark">{item.nome}</Text>
                <Pressable onPress={() => remover(item.id)}>
                  <Text className="text-error">Excluir</Text>
                </Pressable>
              </View>

              <Text className="text-text-secondary dark:text-text-secondary-dark">
                {nomeCategoria(item)} · até {formatarData(item.prazo)}
                {status === 'vencida' ? <Text className="text-error"> · Prazo vencido</Text> : null}
              </Text>

              {status === 'concluida' ? (
                <>
                  <Text className="font-semibold text-success">Meta concluída</Text>
                  <Text className="text-text-secondary dark:text-text-secondary-dark">
                    Meta alcançada! {formatarMoeda(item.valor_atual)} de {formatarMoeda(item.valor_alvo)}
                  </Text>
                </>
              ) : (
                <>
                  <BarraPercentual percentual={progresso} />
                  <Text className="text-text-secondary dark:text-text-secondary-dark">
                    {formatarMoeda(item.valor_atual)} de {formatarMoeda(item.valor_alvo)}
                  </Text>
                </>
              )}

              <View className="flex-row items-center justify-between">
                <View className="flex-row gap-16">
                  <Pressable onPress={() => moverPrioridade(index, 'cima')} disabled={index === 0}>
                    <Text className={index === 0 ? 'text-text-secondary dark:text-text-secondary-dark' : 'text-primary'}>
                      ▲
                    </Text>
                  </Pressable>
                  <Pressable onPress={() => moverPrioridade(index, 'baixo')} disabled={index === metas.length - 1}>
                    <Text
                      className={
                        index === metas.length - 1 ? 'text-text-secondary dark:text-text-secondary-dark' : 'text-primary'
                      }
                    >
                      ▼
                    </Text>
                  </Pressable>
                </View>
                {status === 'em_andamento' && (
                  <Button label="Aportar" variant="secondary" onPress={() => setMetaAportando(item)} />
                )}
              </View>
            </Card>
          )
        }}
      />

      <AporteModal
        meta={metaAportando}
        onFechar={() => setMetaAportando(null)}
        onConfirmado={() => {
          setMetaAportando(null)
          recarregar()
        }}
      />
    </>
  )
}
