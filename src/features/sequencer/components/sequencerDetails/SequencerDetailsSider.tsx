import { CopyOutlined } from '@ant-design/icons'
import type {
  Prefix,
  SequenceCommand,
  SequencerService,
  Step,
  StepStatus
} from '@tmtsoftware/esw-ts'
import { Button, Card, Row, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { createContext, useState } from 'react'
import { useMutation } from '../../../../hooks/useMutation'
import { errorMessage, successMessage } from '../../../../utils/message'
import { SEQUENCER_STEPS } from '../../../queryKeys'
import { getStepListStatus } from '../../hooks/useSequencersData'
import { useSequencerService } from '../../hooks/useSequencerService'
import { useStepList } from '../../hooks/useStepList'
import { typeStatus } from '../SequencersTable'
import styles from './sequencerDetails.module.css'
import { StepComponent } from './StepComponent'
import { StepListTable } from './StepListTable'

type StepData = {
  id: string
  command: SequenceCommand
  status: StepStatus
  hasBreakpoint: boolean
  index: number
}

const columns = (
  stepListStatus: keyof typeof typeStatus,
  setSelectedStep: (_: Step) => void
): ColumnsType<StepData> => [
  {
    title: (
      <>
        <Typography.Title level={5} style={{ marginBottom: 0 }}>
          Sequence Steps
        </Typography.Title>
        <Space>
          <Typography.Text type={'secondary'}>Status:</Typography.Text>
          <Typography.Text type={typeStatus[stepListStatus]}>
            {stepListStatus}
          </Typography.Text>
        </Space>
      </>
    ),
    key: 'index',
    dataIndex: 'status',
    render: (_, record) => {
      return StepComponent(record, record.index + 1, setSelectedStep)
    }
  }
]

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

const DuplicateStepListTable = ({
  sequencerPrefix,
  toggleDuplicateEnabled,
  setSelectedStep
}: {
  sequencerPrefix: Prefix
  toggleDuplicateEnabled: () => void
  setSelectedStep: (_: Step) => void
}): JSX.Element => {
  const { isLoading, data: stepList, isError } = useStepList(sequencerPrefix)
  const stepListStatus = getStepListStatus(stepList, isError).status

  const sequencerService = useSequencerService(sequencerPrefix)
  const [selectedRows, setSelectedRow] = useState<SequenceCommand[]>([])

  const duplicateAction = useMutation({
    mutationFn: addCommands(selectedRows),
    onError: (e) => errorMessage('Failed to duplicate steps', e),
    onSuccess: () => successMessage('Successfully duplicated steps'),
    invalidateKeysOnSuccess: [SEQUENCER_STEPS(sequencerPrefix).key],
    useErrorBoundary: false
  })

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: StepData[]) => {
      console.log('selectedRows: ', selectedRows)
      const sortedRows = selectedRows.sort((a, b) => a.index - b.index)
      setSelectedRow(sortedRows.map((step) => step.command))
    },
    hideSelectAll: true
  }

  return (
    <Card bordered={false} bodyStyle={{ padding: 0 }}>
      <Table
        style={{ marginBottom: '5rem' }}
        rowSelection={{ ...rowSelection }}
        rowKey={(step) => step.id}
        pagination={false}
        loading={isLoading}
        dataSource={stepList?.steps.map((step, index) => ({ ...step, index }))}
        columns={columns(stepListStatus, setSelectedStep)}
        onRow={() => ({ className: styles.cellInDuplicate })}
        onHeaderRow={() => ({ className: styles.cell })}
        sticky
      />
      <Card
        bordered={false}
        style={{
          position: 'fixed',
          bottom: 0,
          width: '18rem'
        }}>
        <Row justify='space-around'>
          <Button onClick={toggleDuplicateEnabled}>Cancel</Button>
          <Button
            type='primary'
            loading={duplicateAction.isLoading}
            disabled={selectedRows.length === 0}
            onClick={() => {
              sequencerService && duplicateAction.mutateAsync(sequencerService)
              toggleDuplicateEnabled()
            }}>
            <CopyOutlined />
            Duplicate
          </Button>
        </Row>
      </Card>
    </Card>
  )
}

export type StepListTableContextType = {
  handleDuplicate: () => void
}

const defaultStepListTableContext: StepListTableContextType = {
  handleDuplicate: () => undefined
}

export const StepListTableContext: React.Context<StepListTableContextType> = createContext(
  defaultStepListTableContext
)

export const SequencerDetailsSider = ({
  sequencerPrefix,
  selectedStep,
  setSelectedStep
}: {
  sequencerPrefix: Prefix
  selectedStep?: Step
  setSelectedStep: (_: Step | undefined) => void
}): JSX.Element => {
  const [isDuplicateEnabled, toggleDuplicateEnabled] = useState<boolean>(false)
  if (isDuplicateEnabled) {
    return (
      <DuplicateStepListTable
        sequencerPrefix={sequencerPrefix}
        toggleDuplicateEnabled={() =>
          toggleDuplicateEnabled(!isDuplicateEnabled)
        }
        setSelectedStep={setSelectedStep}
      />
    )
  }
  return (
    <StepListTableContext.Provider
      value={{
        handleDuplicate: () => toggleDuplicateEnabled(!isDuplicateEnabled)
      }}>
      <StepListTable
        sequencerPrefix={sequencerPrefix}
        setSelectedStep={setSelectedStep}
        selectedStep={selectedStep}
      />
    </StepListTableContext.Provider>
  )
}
