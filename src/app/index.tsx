import { Redirect } from 'expo-router'
import { ActivityIndicator, View } from 'react-native'
import { useEntryRoute } from '../hooks/useEntryRoute'

export default function Index() {
  const route = useEntryRoute()

  if (route === 'loading') {
    return (
      <View className="flex-1 items-center justify-center bg-background dark:bg-background-dark">
        <ActivityIndicator />
      </View>
    )
  }

  return <Redirect href={route} />
}
