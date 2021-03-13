import type { AgentService } from '@tmtsoftware/esw-ts'
import { useMutation, UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { SM_STATUS_KEY } from '../../queryKeys'

export const useAgentServiceAction = <T>(
  mutationFn: (agent: AgentService) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  useErrorBoundary: boolean
): UseMutationResult<T, unknown, AgentService> =>
  useMutation({
    mutationFn,
    onSuccess: () => successMessage(successMsg),
    onError: (e) => errorMessage(errorMsg, e),
    invalidateKeysOnSuccess: [SM_STATUS_KEY],
    useErrorBoundary
  })
