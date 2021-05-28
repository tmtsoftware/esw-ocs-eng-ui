import { SequenceCommand, Sequence } from '@tmtsoftware/esw-ts'
import { SequenceCommandsD } from '@tmtsoftware/esw-ts/lib/dist/src/decoders/CommandDecoders'
import { getOrThrow } from '@tmtsoftware/esw-ts/lib/dist/src/utils/Utils'
import { Upload } from 'antd'
import React from 'react'
import { errorMessage } from '../../../utils/message'
import { couldNotDeserialiseSequenceMsg } from './sequencerMessageConstants'

type UploadSequenceProps = {
  setSequence: (sequence: Sequence) => void
  request: () => void
  children: JSX.Element
  disabled?: boolean
  className?: string
  uploadErrorMsg: string
}

export const UploadSequence = ({
  setSequence,
  request,
  disabled,
  children,
  className,
  uploadErrorMsg
}: UploadSequenceProps): JSX.Element => {
  const beforeUpload = (file: File): Promise<void> => {
    console.log('ourside promise')
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      console.log('reading file')
      reader.readAsText(file)
      reader.onerror = () => errorMessage(uploadErrorMsg, reader.error)
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          try {
            setSequence(Sequence.from(JSON.parse(reader.result)))
            console.log('adding data')
            resolve()
          } catch (e) {
            errorMessage(uploadErrorMsg, Error(couldNotDeserialiseSequenceMsg)).then(reject)
          }
        }
      }
    })
  }

  return (
    <Upload
      disabled={disabled}
      beforeUpload={(file: File) => {
        console.log('beforeUPload=================')
        beforeUpload(file)
      }}
      customRequest={request}
      showUploadList={false}
      accept='application/JSON'
      className={className}>
      {children}
    </Upload>
  )
}
