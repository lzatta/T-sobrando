import { useRouter } from 'expo-router'
import { useState } from 'react'
import { signOut } from './authService'

export function useSignOut() {
  const router = useRouter()
  const [isSigningOut, setIsSigningOut] = useState(false)

  async function submit() {
    setIsSigningOut(true)
    try {
      await signOut()
      router.replace('/(auth)/login')
    } catch (error) {
      console.error('[useSignOut] falha ao sair:', error)
      setIsSigningOut(false)
    }
  }

  return { submit, isSigningOut }
}
