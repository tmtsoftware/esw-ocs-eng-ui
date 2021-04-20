import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup, Step, StepStatus } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { when } from 'ts-mockito'
import { StepActions } from '../../../../../src/features/sequencer/components/sequencerDetails/StepActions'
import {
  renderWithAuth,
  sequencerServiceMock
} from '../../../../utils/test-utils'

describe('StepActions', () => {
  const sequencerPrefix = Prefix.fromString('ESW.iris_darknight')

  const stepStatusPending: StepStatus = { _type: 'Pending' }
  const stepStatusInProgress: StepStatus = { _type: 'InFlight' }
  const stepStatusSuccess: StepStatus = { _type: 'Success' }
  const stepStatusFailure: StepStatus = { _type: 'Failure', message: 'error' }

  const getStepWithBreakpoint = (
    hasBreakpoint: boolean,
    status: StepStatus
  ): Step => ({
    hasBreakpoint: hasBreakpoint,
    status,
    command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
    id: 'step1'
  })

  it('should give insert breakpoint option in menu if step does not have breakpoint | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false, stepStatusPending)}
          handleMenuClick={() => ({})}
        />
      )
    })

    await screen.findByText('Insert breakpoint')
  })

  it('should give remove breakpoint option in menu if step has a breakpoint | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(true, stepStatusPending)}
          handleMenuClick={() => ({})}
        />
      )
    })

    await screen.findByText('Remove breakpoint')
  })

  it('should call handleMenuClick when menu item is click| ESW-490', async () => {
    let called = false
    const handleMenuClick = () => {
      called = !called
    }

    when(sequencerServiceMock.removeBreakpoint('step1')).thenResolve({
      _type: 'Ok'
    })
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(true, stepStatusPending)}
          handleMenuClick={handleMenuClick}
        />
      )
    })

    const removeAction = await screen.findByText('Remove breakpoint')
    userEvent.click(removeAction, { button: 0 })

    expect(called).to.be.true
  })

  it('should disable insertBreakpoint and delete when status is in Progress | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false, stepStatusInProgress)}
          handleMenuClick={() => ({})}
        />
      )
    })

    const insertMenu = (await screen.findByRole('menuitem', {
      name: /insert breakpoint/i
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: /delete/i
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-menu-item-disabled')).to.be.true
  })

  it('should disable delete, insert breakpoint and add a step when status is failure | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false, stepStatusFailure)}
          handleMenuClick={() => ({})}
        />
      )
    })

    const insertMenu = (await screen.findByRole('menuitem', {
      name: /insert breakpoint/i
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: /delete/i
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: /add a step/i
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-menu-item-disabled')).to.be.true
    expect(addAStepMenu.classList.contains('ant-menu-item-disabled')).to.be.true
  })

  it('should disable delete, insert breakpoint and add a step when status is success | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false, stepStatusSuccess)}
          handleMenuClick={() => ({})}
        />
      )
    })

    const insertMenu = (await screen.findByRole('menuitem', {
      name: /insert breakpoint/i
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: /delete/i
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: /add a step/i
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-menu-item-disabled')).to.be.true
    expect(addAStepMenu.classList.contains('ant-menu-item-disabled')).to.be.true
  })

  it('should every menu item should enabled when status is pending | ESW-459', async () => {
    renderWithAuth({
      ui: (
        <StepActions
          sequencerPrefix={sequencerPrefix}
          step={getStepWithBreakpoint(false, stepStatusPending)}
          handleMenuClick={() => ({})}
        />
      )
    })

    const insertMenu = (await screen.findByRole('menuitem', {
      name: /insert breakpoint/i
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: /delete/i
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: /add a step/i
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-menu-item-disabled')).to.be.false
    expect(deleteMenu.classList.contains('ant-menu-item-disabled')).to.be.false
    expect(addAStepMenu.classList.contains('ant-menu-item-disabled')).to.be
      .false
  })
})
