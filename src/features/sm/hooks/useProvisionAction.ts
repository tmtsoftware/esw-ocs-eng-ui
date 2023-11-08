import type { SequenceManagerService } from '@tmtsoftware/esw-ts'
import { useMutation } from '../../../hooks/useMutation'
import type { UseMutationResult } from '../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../utils/message'
import { AGENTS_STATUS } from '../../queryKeys'

export const useProvisionAction = <T>(
  mutationFn: (agent: SequenceManagerService) => Promise<T>,
  successMsg: string,
  errorMsg: string,
  throwOnError = true
): UseMutationResult<T, unknown, SequenceManagerService> =>
  useMutation({
    mutationFn,
    onSuccess: () => successMessage(successMsg),
    onError: (e) => errorMessage(errorMsg, e),
    invalidateKeysOnSuccess: [[AGENTS_STATUS.key]],
    throwOnError
  })
