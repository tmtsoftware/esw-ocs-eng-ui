import { ReactKeycloakProvider } from '@react-keycloak/web'
import { HttpConnection, LocationService, Prefix } from '@tmtsoftware/esw-ts'
import Keycloak from 'keycloak-js'
import React, { useEffect, useState } from 'react'

const locationService = LocationService()

const getAASUrl = async (): Promise<string> => {
  const authConnection = HttpConnection(new Prefix('CSW', 'AAS'), 'Service')
  const location = await locationService.resolve(authConnection, 10, 'seconds')

  if (!location) throw new Error(`${authConnection.prefix.toJSON()} not found`)
  return location.uri
}

// Setup Keycloak instance as needed
// Pass initialization options as required or leave blank to load from 'keycloak.json'
const keycloak = (keycloakUrl: string) =>
  Keycloak({
    url: keycloakUrl,
    realm: 'TMT',
    clientId: 'tmt-frontend-app'
  })

type AuthProviderProps = {
  children: React.ReactNode
}

export const AuthProvider = ({ children }: AuthProviderProps): JSX.Element => {
  const [keycloakUrl, setKeycloakUrl] = useState<string | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)

  useEffect(() => {
    getAASUrl()
      .then(setKeycloakUrl)
      .catch((e) => setError((e as Error).message))
  }, [])

  if (error) return <p>Unable to connect to Auth Server, reason: ${error}</p>
  if (!keycloakUrl) return <p>Loading ...</p>

  return (
    <ReactKeycloakProvider authClient={keycloak(keycloakUrl)}>
      {children}
    </ReactKeycloakProvider>
  )
}
