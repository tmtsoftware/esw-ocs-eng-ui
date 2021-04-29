import type {
  Prefix,
  SequenceCommand,
  Step,
  StepList,
  StepStatus
} from '@tmtsoftware/esw-ts'
import { Card, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useState } from 'react'
import { getStepListStatus } from '../../hooks/useSequencersData'
import { useStepList } from '../../hooks/useStepList'
import { StepListContextProvider } from '../../hooks/useStepListContext'
import { typeStatus } from '../SequencersTable'
import { DuplicateAction } from './DuplicateAction'
import styles from './sequencerDetails.module.css'
import { StepComponent } from './StepComponent'

type StepData = {
  id: string
  command: SequenceCommand
  status: StepStatus
  hasBreakpoint: boolean
  index: number
}

const setStepToDisplayParameters = (
  setSelectedStep: (_: Step | undefined) => void,
  stepList?: StepList,
  selectedStep?: Step
) => {
  if (stepList) {
    validStepChecker(setSelectedStep, stepList, selectedStep)
  } else {
    // no step-list
    setSelectedStep(undefined)
  }
}

const validStepChecker = (
  setSelectedStep: (_: Step | undefined) => void,
  stepList: StepList,
  selectedStep?: Step
) => {
  if (!selectedStep) {
    // will be set for the first time
    setSelectedStep(stepList.steps[0])
  } else {
    // will check if selected step is always in the step-list for cases like abort sequence
    !stepList.steps.find((step) => step.id === selectedStep.id) &&
      setSelectedStep(stepList.steps[0])
  }
}

const columns = (
  stepListStatus: keyof typeof typeStatus,
  sequencerPrefix: Prefix,
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
    render: (_, record) =>
      StepComponent(record, record.index + 1, setSelectedStep, sequencerPrefix)
  }
]

export const StepListTable = ({
  sequencerPrefix,
  selectedStep,
  setSelectedStep
}: {
  sequencerPrefix: Prefix
  selectedStep?: Step
  setSelectedStep: (_: Step | undefined) => void
}): JSX.Element => {
  const [isDuplicateEnabled, toggleDuplicateEnabled] = useState<boolean>(false)
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const { isLoading, data: stepList, isError } = useStepList(sequencerPrefix)
  const stepListStatus = getStepListStatus(stepList, isError).status

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: StepData[]) => {
      const sortedRows = selectedRows.sort((a, b) => a.index - b.index)
      setCommands(sortedRows.map((step) => step.command))
    },
    hideSelectAll: true
  }

  useEffect(
    () => setStepToDisplayParameters(setSelectedStep, stepList, selectedStep),
    [stepList, selectedStep, setSelectedStep]
  )

  return (
    <StepListContextProvider
      value={{
        handleDuplicate: () => toggleDuplicateEnabled(!isDuplicateEnabled),
        isDuplicateEnabled,
        stepListStatus
      }}>
      <Card bordered={false} bodyStyle={{ padding: 0 }}>
        <Table
          style={{ marginBottom: '5rem' }}
          rowSelection={isDuplicateEnabled ? { ...rowSelection } : undefined}
          rowKey={(step) => step.id}
          pagination={false}
          loading={isLoading}
          dataSource={stepList?.steps.map((step, index) => ({
            ...step,
            index
          }))}
          columns={columns(stepListStatus, sequencerPrefix, setSelectedStep)}
          onRow={(step) =>
            selectedStep && step.id === selectedStep.id
              ? { id: styles.selectedRow }
              : { className: styles.cell }
          }
          onHeaderRow={() => ({ className: styles.cell })}
          sticky
        />
        {isDuplicateEnabled && (
          <DuplicateAction
            commands={commands}
            sequencerPrefix={sequencerPrefix}
            toggleDuplicateEnabled={() =>
              toggleDuplicateEnabled(!isDuplicateEnabled)
            }
          />
        )}
      </Card>
    </StepListContextProvider>
  )
}
