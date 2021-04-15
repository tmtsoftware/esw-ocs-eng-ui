import { Button } from 'antd'
import React from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import type { UseQueryResult } from '../../../../hooks/useQuery'
import { errorMessage, successMessage } from '../../../../utils/message'
import { OBS_MODES_DETAILS } from '../../../queryKeys'

const btnMsgs = {
  Pause: {
    success: 'Successfully paused sequencer',
    error: 'Failed to pause sequencer'
  },
  Resume: {
    success: 'Successfully resumed sequencer',
    error: 'Failed to resume sequencer'
  },
  Shutdown: {
    success: 'Successfully shutdown sequencer',
    error: 'Failed to shutdown sequencer'
  }
}

export type Title = keyof typeof btnMsgs

type ActionButtonProps<QResult, MResult> = {
  title: Title
  queryResult: UseQueryResult<QResult>
  onClick: (data: QResult) => Promise<MResult>
  invalidateKeysOnSuccess: string[]
}

export const useAction = <QResult, MResult>(
  title: Title,
  onClick: (data: QResult) => Promise<MResult>,
  invalidateKeysOnSuccess: string[]
): UseMutationResult<MResult, unknown, QResult> =>
  useMutation({
    mutationFn: onClick,
    onSuccess: () => successMessage(btnMsgs[title].success),
    onError: (e) => errorMessage(btnMsgs[title].error, e),
    invalidateKeysOnSuccess: invalidateKeysOnSuccess
  })

export const ActionButton = <QRresult, MResult>({
  title,
  queryResult,
  onClick,
  invalidateKeysOnSuccess
}: ActionButtonProps<QRresult, MResult>): JSX.Element => {
  const action = useAction(title, onClick, invalidateKeysOnSuccess)

  return (
    <Button
      disabled={queryResult.isLoading || queryResult.isError}
      loading={action.isLoading}
      onClick={() => queryResult.data && action.mutateAsync(queryResult.data)}>
      {title}
    </Button>
  )
}
