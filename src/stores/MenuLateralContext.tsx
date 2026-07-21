import { createContext, useContext, useState, type PropsWithChildren } from 'react'

type MenuLateralContextValue = {
  aberto: boolean
  abrir: () => void
  fechar: () => void
}

const MenuLateralContext = createContext<MenuLateralContextValue | null>(null)

export function MenuLateralProvider({ children }: PropsWithChildren) {
  const [aberto, setAberto] = useState(false)

  return (
    <MenuLateralContext.Provider value={{ aberto, abrir: () => setAberto(true), fechar: () => setAberto(false) }}>
      {children}
    </MenuLateralContext.Provider>
  )
}

export function useMenuLateral() {
  const context = useContext(MenuLateralContext)
  if (!context) throw new Error('useMenuLateral deve ser usado dentro de MenuLateralProvider')
  return context
}
