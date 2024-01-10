import type { ConfigService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { mockServices } from '../utils/test-utils'

console.log('XXX in mock/ConfigServiceContext')

const useCtx = (): [ConfigService, boolean] => [mockServices.instance.configService, false]

const ConfigServiceProvider0 = ({ children }: { children: React.ReactNode }): React.JSX.Element => {
  return <>{children}</>
}

export const [useConfigService, ConfigServiceProvider] = [useCtx, ConfigServiceProvider0]
