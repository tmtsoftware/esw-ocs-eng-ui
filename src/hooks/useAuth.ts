import { AuthContext } from '@tmtsoftware/esw-ts'
import type { AuthContextType } from '@tmtsoftware/esw-ts/lib/dist/src/components/aas/context/AuthContext'
import { useContext } from 'react'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider')
  }

  return context
}
