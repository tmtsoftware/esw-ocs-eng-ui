import React from 'react'
import { mockServices } from '../utils/test-utils'
import type { ConfigService } from '@tmtsoftware/esw-ts'

const useCtx = (): [ConfigService, boolean] => [
  mockServices.instance.configService,
  false
]

const ConfigServiceProvider0 = ({
  children
}: {
  children: React.ReactNode
}): JSX.Element => {
  return <>{children}</>
}

export const [useConfigService, ConfigServiceProvider] = [
  useCtx,
  ConfigServiceProvider0
]
