import { OkOrUnhandledResponse, Sequence, SequencerService } from '@tmtsoftware/esw-ts'
import { Button, Upload } from 'antd'
import React, { useState } from 'react'
import { useMutation, UseMutationResult } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { useSequencerService } from '../../hooks/useSequencerService'
import type { SequencerProps } from '../Props'
import { couldNotDeserialiseSequenceMsg } from '../sequencerMessageConstants'

const errorMessagePrefix = 'Failed to load the sequence'

const useLoadAction = (
  sequence?: Sequence
): UseMutationResult<OkOrUnhandledResponse | undefined, unknown, SequencerService> => {
  const mutationFn = async (sequencerService: SequencerService) =>
    sequence && (await sequencerService.loadSequence(sequence))

  return useMutation({
    mutationFn,
    onSuccess: (res) => {
      if (res?._type === 'Ok') return successMessage('Sequence has been loaded successfully')
      return errorMessage(errorMessagePrefix, Error(res?.msg))
    },
    onError: (e) => errorMessage(errorMessagePrefix, e)
  })
}
type LoadSequenceProps = Omit<SequencerProps, 'isSequencerRunning'>

export const LoadSequence = ({ prefix, sequencerState }: LoadSequenceProps): JSX.Element => {
  const sequencerService = useSequencerService(prefix)
  const [sequence, setSequence] = useState<Sequence>()
  const loadSequenceAction = useLoadAction(sequence)

  const beforeUpload = (file: File): Promise<void> => {
    console.log('inside before upload')

    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsText(file)
      reader.onerror = () => errorMessage(errorMessagePrefix, reader.error)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            setSequence(Sequence.from(JSON.parse(reader.result)))
            resolve()
          } catch (e) {
            errorMessage(errorMessagePrefix, Error(couldNotDeserialiseSequenceMsg)).then(reject)
          }
        }
      }
    })
  }

  const request = () => {
    sequencerService && loadSequenceAction.mutate(sequencerService)
  }

  return (
    <Upload beforeUpload={beforeUpload} customRequest={request} showUploadList={false} accept={'application/json'}>
      <Button
        type='primary'
        loading={loadSequenceAction.isLoading}
        role={'LoadSequence'}
        disabled={!sequencerState || !(sequencerState === 'Idle' || sequencerState === 'Loaded')}>
        Load Sequence
      </Button>
    </Upload>
  )
}
