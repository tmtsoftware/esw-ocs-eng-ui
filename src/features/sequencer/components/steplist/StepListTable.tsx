import { Space, Table, Typography } from 'antd'
import React, { useEffect, useState } from 'react'
import { StepListContextProvider } from '../../hooks/useStepListContext'
import { getStepListInfo, StepListStatus } from '../../utils'
import styles from '../sequencerDetails/sequencerDetails.module.css'
import { statusTextType } from '../SequencersTable'
import { DuplicateAction } from './DuplicateAction'
import { StepComponent } from './StepComponent'
import type {
  Prefix,
  SequenceCommand,
  Step,
  StepList,
  StepStatus
} from '@tmtsoftware/esw-ts'
import type { ColumnsType } from 'antd/lib/table'

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
  sequencerPrefix: Prefix,
  setSelectedStep: (_: Step) => void
): ColumnsType<StepData> => [
  {
    key: 'index',
    dataIndex: 'status',
    render: (_, record) =>
      StepComponent(record, record.index + 1, setSelectedStep, sequencerPrefix)
  }
]

const StepListTitle = ({
  stepListStatus
}: {
  stepListStatus: StepListStatus
}): JSX.Element => (
  <div style={{ margin: '1rem 2rem' }} role='stepListTitle'>
    <Typography.Title level={5} style={{ marginBottom: 0 }}>
      Sequence Steps
    </Typography.Title>
    <Space>
      <Typography.Text type={'secondary'}>Status:</Typography.Text>
      <Typography.Text type={statusTextType[stepListStatus]}>
        {stepListStatus}
      </Typography.Text>
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
  const stepListStatus = getStepListInfo(stepList).status

  const rowSelection = {
    onChange: (_: React.Key[], selectedRows: StepData[]) => {
      const sortedRows = selectedRows.sort((a, b) => a.index - b.index)
      setCommands(sortedRows.map((step) => step.command))
    },
    hideSelectAll: true
  }

  //Both useEffect can be be moved to parent component
  useEffect(
    () => setStepToDisplayParameters(setSelectedStep, stepList, selectedStep),
    [stepList, selectedStep, setSelectedStep]
  )

  useEffect(() => {
    const inFlightStep = stepList?.steps.find(
      (step) => step.status._type === 'InFlight'
    )
    if (
      inFlightStep !== undefined &&
      selectedStep !== undefined &&
      stepList !== undefined
    ) {
      const inFlightStepIndex = stepList.steps.findIndex(
        (step) => step.id === inFlightStep.id
      )
      const selectedStepIndex = stepList.steps.findIndex(
        (step) => step.id === selectedStep.id
      )
      const isSelectedStepPreviousOfInFlightStep =
        inFlightStepIndex - selectedStepIndex === 1
      const isSelectedStepIncomplete = selectedStep.status._type !== 'Success'

      if (isSelectedStepIncomplete && isSelectedStepPreviousOfInFlightStep) {
        setSelectedStep(inFlightStep)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stepList])

  return (
    <StepListContextProvider
      value={{
        handleDuplicate: () => toggleDuplicateEnabled(!isDuplicateEnabled),
        isDuplicateEnabled,
        stepListStatus
      }}>
      <div style={{ height: '90%' }}>
        <StepListTitle stepListStatus={stepListStatus} />
        <Table
          showHeader={false}
          className={
            isDuplicateEnabled
              ? styles.duplicateStepListTable
              : styles.stepListTable
          }
          rowSelection={isDuplicateEnabled ? { ...rowSelection } : undefined}
          rowKey={(step) => step.id}
          pagination={false}
          loading={isLoading}
          dataSource={stepList?.steps.map((step, index) => ({
            ...step,
            index
          }))}
          columns={columns(sequencerPrefix, setSelectedStep)}
          onRow={(step) => ({
            id:
              selectedStep && step.id === selectedStep.id
                ? styles.selectedRow
                : undefined,
            className: isDuplicateEnabled ? styles.cellInDuplicate : styles.cell
          })}
          sticky
        />
      </div>
      {isDuplicateEnabled && (
        <DuplicateAction
          commands={commands}
          sequencerPrefix={sequencerPrefix}
          toggleDuplicateEnabled={() =>
            toggleDuplicateEnabled(!isDuplicateEnabled)
          }
        />
      )}
    </StepListContextProvider>
  )
}