import { AuthContext } from '@tmtsoftware/esw-ts'
import { useContext } from 'react'
import type { AuthContextType } from '@tmtsoftware/esw-ts'

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext)

  if (context === undefined) {
    throw new Error('useAuthContext must be used within a AuthContextProvider')
  }

  return context
}
