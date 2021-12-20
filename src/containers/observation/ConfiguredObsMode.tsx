import {
  AkkaConnection,
  ObsMode,
  Prefix,
  SequencerService,
  SequencerState,
  SequencerStateResponse,
  ServiceError,
  StepList,
  Subscription
} from '@tmtsoftware/esw-ts'
import type { VariationInfo } from '@tmtsoftware/esw-ts'
import { Typography } from 'antd'
import React, {useEffect, useMemo, useState} from 'react'
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
import { ObsModeCard, Status } from './CommonComponents'
import { RunningActions } from './ObsModeActions'

type ConfiguredObsModeProps = {
  obsMode: ObsMode
  sequencers: VariationInfo[]
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

const extractObsModeFromComponentName = (str: string): string => Prefix.fromString(str).componentName.split(".")[0]

export const ConfiguredObsMode = ({ obsMode, sequencers, resources }: ConfiguredObsModeProps): JSX.Element => {
  const [gatewayLocation] = useGatewayLocation()
  const locationService = useLocationService()
  const { auth } = useAuth()
  const tf = createTokenFactory(auth)
  const [loading, setLoading] = useState(true)
  const resetSequencerInfoMap = (): SequencerInfoMap =>
    sequencers.map((variationInfo) => [variationInfo.prefix(obsMode).toJSON(), undefined])

  const [sequencersInfoMap, setSequencerInfoMap] = useState<SequencerInfoMap>(() => resetSequencerInfoMap())
  useEffect(() =>
   setSequencerInfoMap(resetSequencerInfoMap())
  ,[obsMode])

  const handleError = (error: ServiceError) => {
    errorMessage(error.message)
    setLoading(false)
  }

  useEffect(() => {
    const handleSequencerStateChange = (currentPrefix: string, sequencerStateResponse?: SequencerStateResponse) => {
      setLoading(false)
      setSequencerInfoMap((previousMap) => {
        const filteredSequencers = previousMap.filter(([sequencerPrefix]) =>
          extractObsModeFromComponentName(sequencerPrefix) === obsMode.name     //-> keep sequencers of current obsMode
          && sequencerPrefix != currentPrefix                                   //-> also remove the sequencer of which, the state is updated.
        )
        return [...filteredSequencers, [currentPrefix, sequencerStateResponse]] //-> add the current sequencer with updated state.
      })
    }

    const services: [SequencerService, Prefix][] = gatewayLocation
      ? sequencers.map((variationInfos) => {
          const seqPrefix = variationInfos.prefix(obsMode)
          return [mkSequencerService(seqPrefix, gatewayLocation, tf), seqPrefix]
        })
      : []

    const subscriptions: Subscription[] = []
    services.map(([sequencerService, sequencerPrefix]) => {
      const seqConnection = AkkaConnection(sequencerPrefix, 'Sequencer')
      const locationSubscription = locationService.track(seqConnection)((event) => {
        switch (event._type) {
          case 'LocationRemoved':
            handleSequencerStateChange(sequencerPrefix.toJSON(), undefined)
            break
          case 'LocationUpdated':
            subscriptions.push(
              sequencerService.subscribeSequencerState()((sequencerState) => {
                handleSequencerStateChange(sequencerPrefix.toJSON(), sequencerState)
              }, handleError)
            )
        }
      }, handleError)
      subscriptions.push(locationSubscription)
    })
    return () => subscriptions.forEach((s) => s.cancel())
  }, [gatewayLocation, locationService, obsMode, sequencers, tf])

  const masterSequencerInfo = sequencersInfoMap.find((state) => Prefix.fromString(state[0]).subsystem === 'ESW')?.[1]

  const sequencersInfo: SequencerInfo[] = sequencersInfoMap.map(([prefix, sequencerStatus]) => {
    const stepList = sequencerStatus?.stepList || new StepList([])
    const stepListInfo = getStepListInfo(stepList, sequencerStatus?.sequencerState._type)

    return {
      key: prefix,
      prefix: prefix,
      currentStepCommandName: getCurrentStepCommandName(stepList),
      stepListInfo,
      sequencerState: sequencerStatus?.sequencerState,
      totalSteps: stepList.steps.length,
      masterSequencerState: masterSequencerInfo && masterSequencerInfo.sequencerState
    }
  })
  const sortedSequencers = sortSequencers(sequencersInfo)

  const sequencerState: SequencerState | undefined = sortedSequencers[0]
    ? sortedSequencers[0].sequencerState
    : { _type: 'Idle' }

  return (
    <ObsModeCard
      title={
        <>
          <Typography.Title level={4}>{obsMode.name}</Typography.Title>
          <Status sequencerState={sequencerState} />
        </>
      }
      extra={<RunningActions obsMode={obsMode} />}>
      <SequencersTable sequencersInfo={sortedSequencers} loading={loading} />
      <ResourcesTable resources={resources} />
    </ObsModeCard>
  )
}
