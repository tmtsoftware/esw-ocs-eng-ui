import { createContext, useContext } from 'react'

export type StepListTableContextType = {
  handleDuplicate: () => void
  isDuplicateEnabled: boolean
}

const defaultStepListTableContext: StepListTableContextType = {
  handleDuplicate: () => undefined,
  isDuplicateEnabled: false
}

export const StepListTableContext: React.Context<StepListTableContextType> = createContext(
  defaultStepListTableContext
)

export const useStepListContext = (): StepListTableContextType => {
  const context = useContext(StepListTableContext)
  if (context === undefined) {
    throw new Error(
      'StepListTableContext must be used within a StepListContextProvider'
    )
  }
  return context
}
