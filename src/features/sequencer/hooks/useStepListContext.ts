import { useContext } from 'react'
import {
  StepListTableContext,
  StepListTableContextType
} from '../components/sequencerDetails/StepListTable'

export const useStepListContext = (): StepListTableContextType => {
  const context = useContext(StepListTableContext)
  if (context === undefined) {
    throw new Error(
      'StepListTableContext must be used within a StepListContextProvider'
    )
  }
  return context
}
