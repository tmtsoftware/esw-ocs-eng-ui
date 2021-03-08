import type { AgentService } from '@tmtsoftware/esw-ts'
import type { UseMutationResult } from 'react-query'
import { useAction } from '../../common/hooks/useAction'
import { SM_STATUS_KEY } from '../../queryKeys'

export const useAgentServiceAction = <T>(
  mutationFn: (agent: AgentService) => Promise<T>,
  successMsg: string,
  errorMsg: string
): UseMutationResult<T, unknown, AgentService> =>
  useAction({
    invalidateKeysOnSuccess: [SM_STATUS_KEY],
    mutationFn,
    successMsg,
    errorMsg
  })
