import {
  ObsMode,
  Option,
  Prefix,
  SequencerService,
  SequencerState,
  SequencerStateResponse,
  Step,
  StepList,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import React, { memo, useEffect, useMemo } from 'react'
import { useGatewayLocation } from '../../contexts/GatewayServiceContext'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import {
  getStepListStatus,
  SequencerInfo
} from '../../features/sequencer/hooks/useSequencersData'
import { mkSequencerService } from '../../features/sequencer/hooks/useSequencerService'
import { useAuth } from '../../hooks/useAuth'
import { createTokenFactory } from '../../utils/createTokenFactory'
import type { TabName } from './ObservationTabs'
import { ObsModeActions } from './ObsModeActions'
import type { BaseType } from 'antd/lib/typography/Base'

type CurrentObsModeProps = {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}

const Text = ({ content, type }: { content: string; type: BaseType }) => (
  <Typography.Text strong type={type}>
    {content}
  </Typography.Text>
)

const Status = ({
  isRunning,
  sequencerState
}: {
  isRunning: boolean
  sequencerState: SequencerState
}) => {
  const status =
    sequencerState && isRunning ? (
      <Text content={sequencerState._type} type={getTextType(sequencerState)} />
    ) : (
      <Text content='NA' type='secondary' />
    )

  return (
    <Space>
      <Text type='secondary' content='Status: ' />
      {status}
    </Space>
  )
}

export const CurrentObsMode = ({
  currentTab,
  obsMode,
  sequencers,
  resources
}: CurrentObsModeProps): JSX.Element => {
  const [gatewayLocation] = useGatewayLocation()
  const { auth } = useAuth()
  const tf = createTokenFactory(auth)

  const sortedSequencers: Prefix[] = sequencers.reduce(
    (acc: Prefix[], elem) => {
      const sequencer = new Prefix(elem, obsMode.name)
      if (elem === 'ESW') return [sequencer].concat(acc)
      return acc.concat(sequencer)
    },
    []
  )
  const sequencersInfoMap: Record<
    string,
    {
      data: SequencerStateResponse | undefined
      onevent: (sequencerStateResponse: SequencerStateResponse) => void
    }
  > = useMemo(() => ({}), [])

  useEffect(() => {
    for (const key of sortedSequencers) {
      sequencersInfoMap[key.toJSON()] = {
        data: undefined,
        onevent: (sequencerStateResponse: SequencerStateResponse) => {
          sequencersInfoMap[key.toJSON()]['data'] = sequencerStateResponse
        }
      }
    }

    const services: [SequencerService, Prefix][] | undefined =
      gatewayLocation &&
      sortedSequencers.map((seq) => [
        mkSequencerService(seq, gatewayLocation, tf),
        seq
      ])

    const subscriptions = services?.map(
      ([sequencerService, sequencerPrefix]) => {
        console.log('subscribing for ', sequencerPrefix)
        return sequencerService.subscribeSequencerState()(
          sequencersInfoMap[sequencerPrefix.toJSON()]['onevent']
        )
      }
    )
    return () => subscriptions?.forEach((subscription) => subscription.cancel())
  }, [])

  const sequencersInfo: SequencerInfo[] = Object.entries(sequencersInfoMap).map(
    ([prefix, sequencerStatus]) => {
      const stepList = sequencerStatus.data?.stepList
      const stepListStatus = getStepListStatus(stepList)

      return {
        key: prefix,
        prefix: prefix,
        currentStepCommandName: getCurrentStepCommandName(stepList),
        stepListStatus,
        sequencerState: sequencerStatus.data?.sequencerState ?? {
          _type: 'Idle'
        },
        totalSteps: stepList ? stepList.steps.length : ('NA' as const)
      }
    }
  )
  const isRunningTab = currentTab === 'Running'
  return (
    <>
      <Card
        style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
        headStyle={{ paddingBottom: '0.75rem' }}
        bodyStyle={{ overflowY: 'scroll', height: '100%' }}
        title={
          <>
            <Typography.Title level={4}>{obsMode.name}</Typography.Title>
            <Status
              sequencerState={
                sequencersInfo.length > 0
                  ? sequencersInfo[0].sequencerState
                  : { _type: 'Idle' }
              }
              isRunning={isRunningTab}
            />
          </>
        }
        extra={
          <Space style={{ paddingRight: '2.5rem' }}>
            <ObsModeActions tabName={currentTab} obsMode={obsMode} />
          </Space>
        }>
        {isRunningTab && <SequencersTable sequencersInfo={sequencersInfo} />}
        <ResourcesTable resources={resources} />
      </Card>
    </>
  )
}

export const MemoisedCurrentObsMode = memo(CurrentObsMode, (prev, next) => {
  return (
    prev.obsMode.name === next.obsMode.name &&
    prev.currentTab === next.currentTab
  )
})

const getTextType = (runningObsModeStatus: SequencerState): BaseType => {
  return runningObsModeStatus._type === 'Offline' ? 'secondary' : 'success'
}

const currentStep = (stepList: StepList): Option<Step> => {
  return stepList.steps.find((e) => e.status._type !== 'Success')
}

const getCurrentStepCommandName = (stepList: Option<StepList>): string => {
  if (stepList === undefined) {
    return 'NA'
  }

  const step = currentStep(stepList)

  if (step === undefined) {
    return 'NA'
  }
  return step.command.commandName
}
