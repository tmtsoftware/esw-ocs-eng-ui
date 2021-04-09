import type {
  OkOrUnhandledResponse,
  Prefix,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { SequenceCommandD } from '@tmtsoftware/esw-ts/lib/dist/src/decoders/CommandDecoders'
import { getOrThrow } from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { Button, Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'

const validateSequence = (sequenceObj: unknown): SequenceCommand[] => {
  if (!Array.isArray(sequenceObj))
    throw Error('Malformed sequence: should be a list of sequence command')

  return sequenceObj.map((x) => getOrThrow(SequenceCommandD.decode(x)))
}

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
    onSuccess: () => successMessage(''),
    onError: (e) => errorMessage('errorMsg', e),
    invalidateKeysOnSuccess: [prefix.toJSON() + 'state'],
    useErrorBoundary: false
  })
}

export const LoadSequence = ({
  prefix,
  sequencerState
}: SequencerProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<SequenceCommand[]>()
  const loadSequenceAction = useLoadAction(prefix, sequence)

  const beforeUpload = async (file: File): Promise<void> => {
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          const sequence = validateSequence(JSON.parse(reader.result))
          setSequence(sequence)
          resolve()
        }
      }
    })
  }

  const request = () => {
    sequencerService.data && loadSequenceAction.mutate(sequencerService.data)
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
