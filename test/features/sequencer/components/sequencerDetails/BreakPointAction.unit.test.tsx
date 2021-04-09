import { Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import React from 'react'
import { verify, when } from 'ts-mockito'
import { BreakpointAction } from '../../../../../src/features/sequencer/components/sequencerDetails/BreakpointActions'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('stepList table', () => {
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService

  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')
  it('should add breakpoint to given step | ESW-459', async () => {
    const step: Step = {
      hasBreakpoint: false,
      status: { _type: 'Success' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: ''
    }

    when(sequencerService.addBreakpoint(step.id)).thenResolve({ _type: 'Ok' })

    renderWithAuth({
      ui: <BreakpointAction sequencerPrefix={sequencerPrefix} step={step} />,
      mockClients: mockServices.serviceFactoryContext
    })

    verify(sequencerService.addBreakpoint(step.id)).called()
  })
})
