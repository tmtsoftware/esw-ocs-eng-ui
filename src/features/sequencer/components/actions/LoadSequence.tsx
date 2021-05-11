import {
  OkOrUnhandledResponse,
  Prefix,
  Sequence,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button, Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const useLoadAction = (
  prefix: Prefix,
  sequence?: SequenceCommand[]
): UseMutationResult<
  OkOrUnhandledResponse | undefined,
  unknown,
  SequencerService
> => {
  const mutationFn = async (sequencerService: SequencerService) =>
    sequence && (await sequencerService.loadSequence(sequence))

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res?._type === 'Ok')
        return successMessage('Sequence has been loaded successfully')
      return errorMessage('error', Error(res?.msg))
    },
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, prefix.toJSON()]]
  })
}

export const LoadSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<SequenceCommand[]>()
  const loadSequenceAction = useLoadAction(prefix, sequence)

  const beforeUpload = (file: File): Promise<void> => {
    return new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setSequence(Sequence.fromString(reader.result).commands)
          resolve()
        }
      }
    })
  }

  const request = () => {
    sequencerService && loadSequenceAction.mutate(sequencerService)
  }

  return (
    <Upload
      beforeUpload={beforeUpload}
      customRequest={request}
      showUploadList={false}>
      <Button
        type='primary'
        disabled={
          !sequencerState ||
          !(sequencerState === 'Idle' || sequencerState === 'Loaded')
        }>
        Load Sequence
      </Button>
    </Upload>
  )
}
