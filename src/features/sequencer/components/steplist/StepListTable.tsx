import { Space, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { useSequencerService } from '../../hooks/useSequencerService'
import { StepListContextProvider } from '../../hooks/useStepListContext'
import { getStepListInfo, StepListStatus } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { statusTextType } from '../SequencersTable'
import { DuplicateAction } from './DuplicateAction'
import { StepComponent } from './StepComponent'
import type { Prefix, SequenceCommand, Step, StepList, StepStatus } from '@tmtsoftware/esw-ts'
import type { ColumnsType } from 'antd/lib/table'

type StepData = {
  id: string
  command: SequenceCommand
  status: StepStatus
  hasBreakpoint: boolean
  index: number
}

const isSelectedStepNotPresentInStepList = (stepList: StepList, selectedStep: Step) => {
  return !stepList?.steps.find((step) => step.id === selectedStep.id)
}

export const getRunningStep = (stepList: StepList, stepListStatus: StepListStatus): Step | undefined => {
  switch (stepListStatus) {
    case 'Loaded':
      return stepList.steps[0]
    case 'All Steps Completed':
      return stepList.steps[stepList.steps.length - 1]
    case 'Failed':
      return stepList.steps.find((step) => step.status._type === 'Failure')
    case 'Paused':
      return stepList.steps.find((step) => step.status._type === 'Pending')
    case 'In Progress':
      return stepList.steps.find((step) => step.status._type === 'InFlight')
    default:
      return undefined
  }
}

const columns = (
  setSelectedStep: (_: Step) => void,
  setFollowProgress: (_: boolean) => void
): ColumnsType<StepData> => [
  {
    key: 'index',
    dataIndex: 'status',
    render: (_, record) => StepComponent(record, record.index + 1, setSelectedStep, setFollowProgress)
  }
]

const StepListTitle = ({ stepListStatus }: { stepListStatus: StepListStatus }): JSX.Element => (
  <div style={{ margin: '1rem 2rem' }} role='stepListTitle'>
    <Typography.Title level={5} style={{ marginBottom: 0 }}>
      Sequence Steps
    </Typography.Title>
    <Space>
      <Typography.Text type={'secondary'}>Status:</Typography.Text>
      <Typography.Text type={statusTextType[stepListStatus]}>{stepListStatus}</Typography.Text>
    </Space>
  </div>
)

export type StepListTableProps = {
  sequencerPrefix: Prefix
  selectedStep?: Step
  stepList: StepList
  isLoading: boolean
  setSelectedStep: (_: Step | undefined) => void
}

export const StepListTable = ({
  sequencerPrefix,
  selectedStep,
  setSelectedStep,
  stepList,
  isLoading
}: StepListTableProps): JSX.Element => {
  const [isDuplicateEnabled, toggleDuplicateEnabled] = useState<boolean>(false)
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const [followProgress, setFollowProgress] = useState(true)
  const stepListInfo = getStepListInfo(stepList)

  useEffect(() => {
    if (followProgress === true) {
      const runningStep = getRunningStep(stepList, stepListInfo.status)
      setSelectedStep(runningStep)
    }
    //fallback to follow progress mode for cases like abort sequence, load sequence(twice) when user selected step does not exist in stepList anymore
    else if (selectedStep && isSelectedStepNotPresentInStepList(stepList, selectedStep)) {
      setFollowProgress(true)
    }
  }, [followProgress, selectedStep, stepList, stepListInfo.status, setSelectedStep])
  const sequencerService = useSequencerService(sequencerPrefix)

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: StepData[]) => {
      const sortedRows = selectedRows.sort((a, b) => a.index - b.index)
      setCommands(sortedRows.map((step) => step.command))
    },
    hideSelectAll: true
  }

  return (
    <StepListContextProvider
      value={{
        handleDuplicate: () => toggleDuplicateEnabled(!isDuplicateEnabled),
        isDuplicateEnabled,
        stepListStatus: stepListInfo.status,
        sequencerService
      }}>
      <div style={{ height: '90%' }}>
        <StepListTitle stepListStatus={stepListInfo.status} />
        <Table
          showHeader={false}
          className={isDuplicateEnabled ? styles.duplicateStepListTable : styles.stepListTable}
          rowSelection={isDuplicateEnabled ? { ...rowSelection } : undefined}
          rowKey={(step) => step.id}
          pagination={false}
          loading={isLoading}
          dataSource={stepList?.steps.map((step, index) => ({
            ...step,
            index
          }))}
          columns={columns(setSelectedStep, setFollowProgress)}
          onRow={(step) => ({
            id: selectedStep && step.id === selectedStep.id ? styles.selectedRow : undefined,
            className: isDuplicateEnabled ? styles.cellInDuplicate : styles.cell
          })}
          sticky
        />
      </div>
      {isDuplicateEnabled && (
        <DuplicateAction
          commands={commands}
          sequencerPrefix={sequencerPrefix}
          toggleDuplicateEnabled={() => toggleDuplicateEnabled(!isDuplicateEnabled)}
        />
      )}
    </StepListContextProvider>
  )
}
