import { DeleteOutlined } from '@ant-design/icons'
import type { GenericResponse, SequencerService } from '@tmtsoftware/esw-ts'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { SEQUENCER_STEPS } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerStepProps } from './StepComponent'

const handleDeleteResponse = (res: GenericResponse) => {
  switch (res._type) {
    case 'Ok':
      return res

    case 'Unhandled':
      throw new Error(res.msg)

    case 'CannotOperateOnAnInFlightOrFinishedStep':
      throw new Error('Cannot operate on in progress or finished step')

    case 'IdDoesNotExist':
      throw new Error(`${res.id} does not exist`)
  }
}

const deleteStep = (id: string) => (sequencerService: SequencerService) => {
  return sequencerService.delete(id).then(handleDeleteResponse)
}

export const DeleteAction = ({
  step,
  sequencerPrefix
}: SequencerStepProps): JSX.Element => {
  const { data: sequencerService } = useSequencerService(sequencerPrefix)
  const deleteAction = useMutation({
    mutationFn: deleteStep(step.id),
    onSuccess: () => successMessage('Successfully deleted step'),
    onError: (e) => errorMessage('Failed to delete step', e),
    invalidateKeysOnSuccess: [SEQUENCER_STEPS(sequencerPrefix).key]
  })

  return (
    <div
      onClick={() =>
        sequencerService && deleteAction.mutateAsync(sequencerService)
      }>
      <DeleteOutlined />
      Delete
    </div>
  )
}
