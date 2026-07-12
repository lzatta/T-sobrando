import { View, type ViewProps } from 'react-native'

export function Card({ className = '', ...props }: ViewProps) {
  return (
    <View
      className={`rounded border border-border bg-surface p-16 dark:border-border-dark dark:bg-surface-dark ${className}`}
      {...props}
    />
  )
}
