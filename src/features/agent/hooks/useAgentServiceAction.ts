import type { AgentService } from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../../hooks/useAction'
import { errorMessage, successMessage } from '../../../utils/message'
import { SM_STATUS_KEY } from '../../queryKeys'

export const useAgentServiceAction = <T>(
  mutationFn: (agent: AgentService) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  useErrorBoundary: boolean
): UseMutationResult<T, unknown, AgentService> =>
  useAction({
    mutationFn,
    onSuccess: () => successMessage(successMsg),
    onError: (e) => errorMessage(errorMsg, e),
    invalidateKeysOnSuccess: [SM_STATUS_KEY],
    useErrorBoundary
  })
