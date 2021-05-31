import type { AuthContextType } from '@tmtsoftware/esw-ts'
import { useEffect, useState } from 'react'

export const useUsername = (auth: AuthContextType['auth']): string | undefined => {
  const [username, setUsername] = useState<string>()

  useEffect(() => {
    auth?.loadUserProfile().then((e) => setUsername(e.username))
  }, [auth])

  return username
}
