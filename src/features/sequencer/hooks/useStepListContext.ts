import type { SequencerService, Option } from '@tmtsoftware/esw-ts'
import { createContext, useContext } from 'react'
import type { StepListStatus } from '../utils'

export type StepListTableContextType = {
  handleDuplicate: () => void
  isDuplicateEnabled: boolean
  stepListStatus: StepListStatus
  sequencerService: Option<SequencerService>
}

const defaultStepListTableContext: StepListTableContextType = {
  handleDuplicate: () => undefined,
  isDuplicateEnabled: false,
  stepListStatus: 'NA',
  sequencerService: undefined
}

const StepListTableContext: React.Context<StepListTableContextType> = createContext(defaultStepListTableContext)

export const StepListContextProvider = StepListTableContext.Provider

export const useStepListContext = (): StepListTableContextType => {
  const context = useContext(StepListTableContext)
  if (context === undefined) {
    throw new Error('StepListTableContext must be used within a StepListContextProvider')
  }
  return context
}
