import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Prefix, Setup } from '@tmtsoftware/esw-ts'
import type { Step, StepStatus } from '@tmtsoftware/esw-ts'
import { expect } from 'chai'
import React from 'react'
import { StepActions } from '../../../../../src/features/sequencer/components/steplist/StepActions'
import { StepListContextProvider } from '../../../../../src/features/sequencer/hooks/useStepListContext'
import {
  addStepConstants,
  replaceStepConstants,
  deleteStepConstants,
  duplicateStepConstants,
  insertBreakPointConstants,
  removeBreakPointConstants
} from '../../../../../src/features/sequencer/sequencerConstants'
import { renderWithAuth, sequencerServiceInstance } from '../../../../utils/test-utils'
import '@ant-design/v5-patch-for-react-19'

describe('StepActions', () => {
  const stepStatusPending: StepStatus = { _type: 'Pending' }
  const stepStatusInProgress: StepStatus = { _type: 'InFlight' }
  const stepStatusSuccess: StepStatus = { _type: 'Success' }
  const stepStatusFailure: StepStatus = { _type: 'Failure', message: 'error' }

  const getStepWithBreakpoint = (hasBreakpoint: boolean, status: StepStatus): Step => ({
    hasBreakpoint: hasBreakpoint,
    status,
    command: new Setup(Prefix.fromString('ESW.test'), 'Command-1'),
    id: 'step1'
  })

  it('should give insert breakpoint option in menu if step does not have breakpoint | ESW-459', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(false, stepStatusPending)} />
    })
    await user.click(await screen.findByRole('stepActions'))

    await screen.findByText(insertBreakPointConstants.menuItemText)
  })

  it('should give remove breakpoint option in menu if step has a breakpoint | ESW-459', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(true, stepStatusPending)} />
    })
    await user.click(await screen.findByRole('stepActions'))
    await screen.findByText(removeBreakPointConstants.menuItemText)
  })

  it('should disable insertBreakpoint and delete when status is in Progress | ESW-459, ESW-490', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(false, stepStatusInProgress)} />
    })
    await user.click(await screen.findByRole('stepActions'))
    const insertMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(insertBreakPointConstants.menuItemText)
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(deleteStepConstants.menuItemText)
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
  })

  it('should disable delete, insert breakpoint and add a step when status is failure | ESW-459, ESW-490, ESW-550', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(false, stepStatusFailure)} />
    })
    await user.click(await screen.findByRole('stepActions'))
    const insertMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(insertBreakPointConstants.menuItemText)
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(deleteStepConstants.menuItemText)
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(addStepConstants.menuItemText)
    })) as HTMLMenuElement

    const replaceStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(replaceStepConstants.menuItemText)
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(addAStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(replaceStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
  })

  it('should disable delete, insert breakpoint and add a step when status is success | ESW-459, ESW-490, ESW-550', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(false, stepStatusSuccess)} />
    })
    await user.click(await screen.findByRole('stepActions'))
    const insertMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(insertBreakPointConstants.menuItemText)
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(deleteStepConstants.menuItemText)
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(addStepConstants.menuItemText)
    })) as HTMLMenuElement

    const replaceStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(replaceStepConstants.menuItemText)
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(deleteMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(addAStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(replaceStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
  })

  it('should enable every menu item when status is pending | ESW-459, ESW-490, ESW-550', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: <StepActions step={getStepWithBreakpoint(false, stepStatusPending)} />
    })
    await user.click(await screen.findByRole('stepActions'))
    const insertMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(insertBreakPointConstants.menuItemText)
    })) as HTMLMenuElement

    const deleteMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(deleteStepConstants.menuItemText)
    })) as HTMLMenuElement

    const addAStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(addStepConstants.menuItemText)
    })) as HTMLMenuElement

    const replaceStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(replaceStepConstants.menuItemText)
    })) as HTMLMenuElement

    expect(insertMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.false
    expect(deleteMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.false
    expect(addAStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.false
    expect(replaceStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.false
  })

  // it('should disable duplicate if stepListStatus is completed | ESW-462', async () => {
  //   renderWithAuth({
  //     ui: (
  //       <StepListContextProvider
  //         value={{
  //           handleDuplicate: () => undefined,
  //           setFollowProgress: () => undefined,
  //           isDuplicateEnabled: false,
  //           stepListStatus: 'All Steps Completed',
  //           sequencerService: sequencerServiceInstance
  //         }}>
  //         <StepActions step={getStepWithBreakpoint(false, stepStatusInProgress)} />
  //       </StepListContextProvider>
  //     )
  //   })
  //
  //   await user.click(await screen.findByRole('stepActions'))
  //
  //   const duplicateMenu = (await screen.findByRole('menuitem', {
  //     name: new RegExp(duplicateStepConstants.menuItemText)
  //   })) as HTMLMenuElement
  //
  //   expect(duplicateMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
  // })

  it('should disable add steps if step Status is completed | ESW-461', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: (
        <StepListContextProvider
          value={{
            handleDuplicate: () => undefined,
            setFollowProgress: () => undefined,
            isDuplicateEnabled: false,
            stepListStatus: 'All Steps Completed',
            sequencerService: sequencerServiceInstance
          }}>
          <StepActions step={getStepWithBreakpoint(false, stepStatusSuccess)} />
        </StepListContextProvider>
      )
    })

    await user.click(await screen.findByRole('stepActions'))

    const addStepsMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(addStepConstants.menuItemText)
    })) as HTMLMenuElement
    const addStepsDiv = (await screen.findByRole('addSteps')) as HTMLDivElement

    expect(addStepsMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    expect(addStepsDiv.style.color).to.be.equal('var(--disabledColor)')
  })
  it('should disable replace steps if step Status is completed | ESW-550', async () => {
    const user = userEvent.setup()
    renderWithAuth({
      ui: (
        <StepListContextProvider
          value={{
            handleDuplicate: () => undefined,
            setFollowProgress: () => undefined,
            isDuplicateEnabled: false,
            stepListStatus: 'All Steps Completed',
            sequencerService: sequencerServiceInstance
          }}>
          <StepActions step={getStepWithBreakpoint(false, stepStatusSuccess)} />
        </StepListContextProvider>
      )
    })

    await user.click(await screen.findByRole('stepActions'))

    const replaceStepMenu = (await screen.findByRole('menuitem', {
      name: new RegExp(replaceStepConstants.menuItemText)
    })) as HTMLMenuElement
    // const replaceStepsDiv = (await screen.findByRole('replaceStep')) as HTMLDivElement

    expect(replaceStepMenu.classList.contains('ant-dropdown-menu-item-disabled')).to.be.true
    //expect(replaceStepsDiv.style.color).to.be.equal('var(--disabledColor)')
  })
})
