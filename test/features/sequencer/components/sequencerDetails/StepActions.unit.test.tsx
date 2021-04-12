import { screen } from '@testing-library/react'
import { Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import React from 'react'
import { StepActions } from '../../../../../src/features/sequencer/components/sequencerDetails/StepActions'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('StepActions', () => {
  const mockServices = getMockServices()

  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  it('should give insert breakpoint menu if step does not have breakpoint | ESW-459', async () => {
    const step: Step = {
      hasBreakpoint: false,
      status: { _type: 'Success' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    }

    renderWithAuth({
      ui: <StepActions sequencerPrefix={sequencerPrefix} step={step} />,
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Insert breakpoint')
  })

  it('should give remove breakpoint menu if step has breakpoint | ESW-459', async () => {
    const step: Step = {
      hasBreakpoint: true,
      status: { _type: 'Success' },
      command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
      id: 'step1'
    }

    renderWithAuth({
      ui: <StepActions sequencerPrefix={sequencerPrefix} step={step} />,
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Remove breakpoint')
  })
})
