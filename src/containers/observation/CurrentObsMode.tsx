import {
  AkkaConnection,
  ObsMode,
  Prefix,
  SequencerService,
  SequencerState,
  SequencerStateResponse,
  ServiceError,
  StepList,
  Subscription,
  Subsystem
} from '@tmtsoftware/esw-ts'
import { Card, Space, Typography } from 'antd'
import type { BaseType } from 'antd/lib/typography/Base'
import React, { useEffect, useState } from 'react'
import { useGatewayLocation } from '../../contexts/GatewayServiceContext'
import { useLocationService } from '../../contexts/LocationServiceContext'
import type { ResourceTableStatus } from '../../features/sequencer/components/ResourcesTable'
import { ResourcesTable } from '../../features/sequencer/components/ResourcesTable'
import { SequencersTable } from '../../features/sequencer/components/SequencersTable'
import { mkSequencerService } from '../../features/sequencer/hooks/useSequencerService'
import { getCurrentStepCommandName, getStepListInfo, SequencerInfo } from '../../features/sequencer/utils'
import { useAuth } from '../../hooks/useAuth'
import { createTokenFactory } from '../../utils/createTokenFactory'
import { errorMessage } from '../../utils/message'
import type { TabName } from './ObservationTabs'
import { ObsModeActions } from './ObsModeActions'

type CurrentObsModeProps = {
  currentTab: TabName
  obsMode: ObsMode
  sequencers: Subsystem[]
  resources: ResourceTableStatus[]
}

/**
 * tuple of sequencers information : [sequencerPrefix, sequencerStateResponse]
 */
type SequencerInfoMap = [string, SequencerStateResponse | undefined][]

const masterSequencer = (sequencersInfo: SequencerInfo[]): SequencerInfo[] => {
  const mayBeMaster = sequencersInfo.find(
    (sequencerInfo) => Prefix.fromString(sequencerInfo.prefix).subsystem === 'ESW'
  )
  return mayBeMaster ? [mayBeMaster] : []
}

const sortSequencers = (sequencerInfo: SequencerInfo[]) => {
  const sortedSequencersWithoutMasterSequencer = sequencerInfo
    .filter((x) => Prefix.fromString(x.prefix).subsystem !== 'ESW')
    .sort((a, b) => (a.prefix > b.prefix ? 1 : -1))

  return masterSequencer(sequencerInfo).concat(sortedSequencersWithoutMasterSequencer)
}

const Text = ({ content, type }: { content: string; type: BaseType }) => (
  <Typography.Text strong type={type}>
    {content}
  </Typography.Text>
)

const getTextType = (runningObsModeStatus: SequencerState): BaseType => {
  return runningObsModeStatus._type === 'Offline' ? 'secondary' : 'success'
}

const Status = ({ isRunning, sequencerState }: { isRunning: boolean; sequencerState?: SequencerState }) => {
  const status =
    isRunning && sequencerState ? (
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

export const CurrentObsMode = ({ currentTab, obsMode, sequencers, resources }: CurrentObsModeProps): JSX.Element => {
  const [gatewayLocation] = useGatewayLocation()
  const locationService = useLocationService()
  const { auth } = useAuth()
  const tf = createTokenFactory(auth)
  const [loading, setLoading] = useState(true)
  const [sequencersInfoMap, setSequencerInfoMap] = useState<SequencerInfoMap>(
    sequencers.map((sub) => [new Prefix(sub, obsMode.name).toJSON(), undefined])
  )

  const isRunningTab = currentTab === 'Running'

  const handleError = (error: ServiceError) => {
    errorMessage(error.message)
    setLoading(false)
  }

  useEffect(() => {
    const handleSequencerStateChange = (currentPrefix: string, sequencerStateResponse: SequencerStateResponse) => {
      setLoading(false)
      setSequencerInfoMap((previousMap) => {
        const filteredSequencers = previousMap.filter(([sequencerPrefix]) => sequencerPrefix !== currentPrefix)
        return [...filteredSequencers, [currentPrefix, sequencerStateResponse]]
      })
    }

    const services: [SequencerService, Prefix][] =
      isRunningTab && gatewayLocation
        ? sequencers.map((seq) => {
            const seqPrefix = new Prefix(seq, obsMode.name)
            return [mkSequencerService(seqPrefix, gatewayLocation, tf), seqPrefix]
          })
        : []
    const subscriptions: Subscription[] = []
    services.map(([sequencerService, sequencerPrefix]) => {
      const seqConnection = AkkaConnection(sequencerPrefix, 'Sequencer')
      locationService.track(seqConnection)((event) => {
        switch (event._type) {
          case 'LocationRemoved':
            setSequencerInfoMap((previousMap) => {
              const filteredSequencers = previousMap.filter(([sp]) => sp !== sequencerPrefix.toJSON())
              return [...filteredSequencers, [sequencerPrefix.toJSON(), undefined]]
            })
            break
          case 'LocationUpdated':
            subscriptions.push(
              sequencerService.subscribeSequencerState()(
                (sequencerState) => handleSequencerStateChange(sequencerPrefix.toJSON(), sequencerState),
                handleError
              )
            )
        }
      }, handleError)
    })
    return () => subscriptions.forEach((s) => s.cancel())
  }, [gatewayLocation, isRunningTab, locationService, obsMode.name, sequencers, tf])

  const sequencersInfo: SequencerInfo[] = sequencersInfoMap.map(([prefix, sequencerStatus]) => {
    const stepList = sequencerStatus?.stepList || new StepList([])
    const stepListInfo = getStepListInfo(stepList, sequencerStatus?.sequencerState._type)

    return {
      key: prefix,
      prefix: prefix,
      currentStepCommandName: getCurrentStepCommandName(stepList),
      stepListInfo,
      sequencerState: sequencerStatus?.sequencerState,
      totalSteps: stepList.steps.length
    }
  })

  const sortedSequencers = sortSequencers(sequencersInfo)

  const sequencerState: SequencerState | undefined =
    sortedSequencers && sortedSequencers[0] ? sortedSequencers[0].sequencerState : { _type: 'Idle' }

  return (
    <Card
      style={{ display: 'flex', flexDirection: 'column', height: '100%' }}
      headStyle={{ paddingBottom: '0.75rem' }}
      bodyStyle={{ overflowY: 'scroll', height: '100%' }}
      title={
        <>
          <Typography.Title level={4}>{obsMode.name}</Typography.Title>
          <Status sequencerState={sequencerState} isRunning={isRunningTab} />
        </>
      }
      extra={
        <Space style={{ paddingRight: '2.5rem' }}>
          <ObsModeActions tabName={currentTab} obsMode={obsMode} />
        </Space>
      }>
      {isRunningTab && <SequencersTable sequencersInfo={sortedSequencers} loading={loading} />}
      <ResourcesTable resources={resources} />
    </Card>
  )
}
