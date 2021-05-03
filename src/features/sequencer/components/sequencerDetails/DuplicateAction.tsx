import { CopyOutlined } from '@ant-design/icons'
import type {
  Prefix,
  SequenceCommand,
  SequencerService
} from '@tmtsoftware/esw-ts'
import { Button, Card, Space } from 'antd'
import React from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { GET_SEQUENCE } from '../../../queryKeys'
import { useSequencerService } from '../../hooks/useSequencerService'

const addCommands = (commands: SequenceCommand[]) => (
  sequencerService: SequencerService
) => {
  return sequencerService.add(commands).then((res) => {
    switch (res._type) {
      case 'Ok':
        return res

      case 'Unhandled':
        throw new Error(res.msg)
    }
  })
}

export const DuplicateAction = ({
  sequencerPrefix,
  commands: selectedCommands,
  toggleDuplicateEnabled
}: {
  sequencerPrefix: Prefix
  commands: SequenceCommand[]
  toggleDuplicateEnabled: () => void
}): JSX.Element => {
  const sequencerService = useSequencerService(sequencerPrefix)
  const duplicateAction = useMutation({
    mutationFn: addCommands(selectedCommands),
    onError: (e) => errorMessage('Failed to duplicate steps', e),
    onSuccess: () => successMessage('Successfully duplicated steps'),
    invalidateKeysOnSuccess: [[GET_SEQUENCE.key, sequencerPrefix.toJSON()]],
    useErrorBoundary: false
  })

  return (
    <Card
      bordered={false}
      style={{
        position: 'fixed',
        bottom: 0,
        width: '18rem'
      }}>
      <Space>
        <Button onClick={toggleDuplicateEnabled}>Cancel</Button>
        <Button
          type='primary'
          loading={duplicateAction.isLoading}
          disabled={selectedCommands.length === 0}
          onClick={() => {
            sequencerService && duplicateAction.mutateAsync(sequencerService)
            toggleDuplicateEnabled()
          }}>
          <CopyOutlined />
          Duplicate
        </Button>
      </Space>
    </Card>
  )
}
