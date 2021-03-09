import type { AgentService } from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../common/message'
import { SM_STATUS_KEY } from '../../queryKeys'

export const useAgentServiceAction = <T>(
  mutationFn: (agent: AgentService) => Promise<T>,
  successMsg: string,
  errorMsg: string
): UseMutationResult<T, unknown, AgentService> =>
  useAction({
    mutationFn,
    onSuccess: () => successMessage(successMsg),
    onError: (e) => errorMessage(errorMsg, e),
    invalidateKeysOnSuccess: [SM_STATUS_KEY]
  })
