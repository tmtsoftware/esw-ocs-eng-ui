import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, Step } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import { StepActions } from '../../../../../src/features/sequencer/components/sequencerDetails/StepActions'
import { getMockServices, renderWithAuth } from '../../../../utils/test-utils'

describe('StepActions', () => {
  const mockServices = getMockServices()
  const sequencerService = mockServices.mock.sequencerService
  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const getStepWithBreakpoint = (hasBreakpoint: boolean): Step => ({
    hasBreakpoint: hasBreakpoint,
    status: { _type: 'Success' },
    command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
    id: 'step1'
  })

  it('should give insert breakpoint menu if step does not have breakpoint | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false)}
          handleMenuClick={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Insert breakpoint')
  })

  it('should give remove breakpoint menu if step has breakpoint | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(true)}
          handleMenuClick={() => ({})}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    await screen.findByText('Remove breakpoint')
  })

  it('should call handleMenuClick on click | ESW-490', async () => {
    let called = false
    const handleMenuClick = () => {
      called = !called
    }

    when(sequencerService.removeBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(true)}
          handleMenuClick={handleMenuClick}
        />
      ),
      mockClients: mockServices.serviceFactoryContext
    })

    const removeAction = await screen.findByText('Remove breakpoint')
    userEvent.click(removeAction, { button: 0 })

    expect(called).to.be.true
  })
})
