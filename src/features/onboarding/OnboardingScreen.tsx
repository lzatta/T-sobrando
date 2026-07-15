import { Text, View } from 'react-native'
import { Button } from '../../components/Button'
import { useOnboarding } from './useOnboarding'

export function OnboardingScreen() {
  const { step, isFirstStep, isLastStep, isFinishing, avancar, voltar } = useOnboarding()

  return (
    <View className="flex-1 justify-center gap-24 bg-background px-24 dark:bg-background-dark">
      <View className="gap-16">
        <Text className="text-2xl font-semibold text-text-primary dark:text-text-primary-dark">
          {step.titulo}
        </Text>
        <Text className="text-text-secondary dark:text-text-secondary-dark">{step.descricao}</Text>
      </View>

      <View className="gap-12">
        <Button label={isLastStep ? 'Começar' : 'Próximo'} onPress={avancar} loading={isFinishing} />
        {!isFirstStep && <Button label="Voltar" variant="secondary" onPress={voltar} />}
      </View>
    </View>
  )
}
