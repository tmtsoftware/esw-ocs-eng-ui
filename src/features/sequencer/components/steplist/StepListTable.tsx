import type { Prefix, SequenceCommand, SequencerStateResponse, Step, StepList, StepStatus } from '@tmtsoftware/esw-ts'
import { Col, Row, Space, Table, Typography } from 'antd'
import type { ColumnsType } from 'antd/lib/table'
import React, { useEffect, useRef, useState } from 'react'
import { useSequencerService } from '../../hooks/useSequencerService'
import { StepListContextProvider } from '../../hooks/useStepListContext'
import { getStepListInfo, StepListInfo, StepListStatus } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { statusTextType } from '../SequencersTable'
import { DuplicateAction } from './DuplicateAction'
import { PlayPauseSequence } from './PlayPauseSequence'
import { StepComponent } from './StepComponent'
import { StepThroughSequence } from './StepThroughSequence'

type StepData = {
  id: string
  command: SequenceCommand
  status: StepStatus
  hasBreakpoint: boolean
  index: number
}

const isSelectedStepNotPresentInStepList = (stepList: StepList, selectedStep: Step) => {
  return !stepList.steps.find((step) => step.id === selectedStep.id)
}

const findStepByStatus = (stepList: StepList, status: StepStatus['_type']): Step | undefined => {
  return stepList.steps.find((step) => step.status._type === status)
}

export const getRunningStep = (stepList: StepList, stepListStatus: StepListStatus): Step | undefined => {
  switch (stepListStatus) {
    case 'Loaded':
      return stepList.steps[0]
    case 'All Steps Completed':
      return stepList.steps[stepList.steps.length - 1]
    case 'Failed':
      return findStepByStatus(stepList, 'Failure')
    case 'Paused':
      return findStepByStatus(stepList, 'Pending')
    case 'In Progress':
      return findStepByStatus(stepList, 'InFlight')
    default:
      return undefined
  }
}

export const isCurrentStepRunningAndNextPaused = (stepList: StepList, currentStepIndex: number): boolean => {
  return (
    stepList.steps[currentStepIndex]?.status._type === 'InFlight' && stepList.steps[currentStepIndex + 1]?.hasBreakpoint
  )
}
//actual index start from 0, whereas currentStepNumber start from 1, hence we do -1
export const getCurrentStepIndex = (currentStepNumber: number): number => currentStepNumber - 1

export const getCurrentAndNextStepId = (
  stepList: StepList,
  currentStepIndex: number
): [currentStepId: string, nextStepId: string] => {
  const currentStepId = stepList.steps[currentStepIndex]?.id
  const nextStepId = stepList.steps[currentStepIndex + 1]?.id
  return [currentStepId, nextStepId]
}

const columns = (
  setSelectedStep: (_: Step) => void,
  setFollowProgress: (_: boolean) => void,
  stepRefs: React.MutableRefObject<StepRefInfo>
): ColumnsType<StepData> => [
  {
    key: 'index',
    dataIndex: 'status',
    render: (_, record) => StepComponent(record, record.index + 1, setSelectedStep, setFollowProgress, stepRefs)
  }
]

type StepListTitleProps = {
  stepListStatus: StepListStatus
}

const StepListTitle = ({ stepListStatus }: StepListTitleProps): JSX.Element => (
  <Col role='stepListTitle'>
    <Typography.Title level={5} style={{ marginBottom: 0 }}>
      Sequence Steps
    </Typography.Title>
    <Space>
      <Typography.Text type={'secondary'}>Status:</Typography.Text>
      <Typography.Text type={statusTextType[stepListStatus]}>{stepListStatus}</Typography.Text>
    </Space>
  </Col>
)

const StepListHeader = ({
  stepListInfo,
  sequencerStateResponse
}: {
  stepListInfo: StepListInfo
  sequencerStateResponse: SequencerStateResponse
}) => {
  const { sequencerState, stepList } = sequencerStateResponse
  const currentStepIndex = getCurrentStepIndex(stepListInfo.currentStepNumber)
  const [currentStepId, nextStepId] = getCurrentAndNextStepId(stepList, currentStepIndex)

  return (
    <Row style={{ margin: '1rem 1rem' }} justify={'space-between'} align='middle'>
      <StepListTitle stepListStatus={stepListInfo.status} />
      <Space align='center'>
        <PlayPauseSequence
          sequencerState={sequencerState._type}
          isPaused={stepList.isPaused()}
          isCurrentStepRunningAndNextPaused={isCurrentStepRunningAndNextPaused(stepList, currentStepIndex)}
        />
        <StepThroughSequence
          currentStepId={currentStepId}
          nextStepId={nextStepId}
          disabled={stepListInfo.status !== 'Paused'} // TODO see if same as isPaused and use it
        />
      </Space>
    </Row>
  )
}

export type StepListTableProps = {
  sequencerPrefix: Prefix
  selectedStep?: Step
  sequencerStateResponse: SequencerStateResponse
  setSelectedStep: (_: Step | undefined) => void
}

export type StepRefInfo = Record<string, HTMLDivElement>

export const StepListTable = ({
  sequencerPrefix,
  selectedStep,
  setSelectedStep,
  sequencerStateResponse
}: StepListTableProps): JSX.Element => {
  const { stepList } = sequencerStateResponse
  const [isDuplicateEnabled, toggleDuplicateEnabled] = useState<boolean>(false)
  const [commands, setCommands] = useState<SequenceCommand[]>([])
  const [followProgress, setFollowProgress] = useState(true)
  const stepListInfo = getStepListInfo(stepList)

  const stepRefs = useRef<StepRefInfo>({})

  useEffect(() => {
    if (followProgress === true) {
      const runningStep = getRunningStep(stepList, stepListInfo.status)
      setSelectedStep(runningStep)
      if (runningStep) {
        stepRefs.current[runningStep.id].scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        })
      }
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
        <StepListHeader sequencerStateResponse={sequencerStateResponse} stepListInfo={stepListInfo} />
        <Table
          showHeader={false}
          className={isDuplicateEnabled ? styles.duplicateStepListTable : styles.stepListTable}
          rowSelection={isDuplicateEnabled ? { ...rowSelection } : undefined}
          rowKey={(step) => step.id}
          pagination={false}
          dataSource={stepList.steps.map((step, index) => ({
            ...step,
            index
          }))}
          columns={columns(setSelectedStep, setFollowProgress, stepRefs)}
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
          toggleDuplicateEnabled={() => toggleDuplicateEnabled(!isDuplicateEnabled)}
        />
      )}
    </StepListContextProvider>
  )
}
