import {
  ObsMode,
  ObsModeDetails,
  SequenceManagerService
} from '@tmtsoftware/esw-ts'
import { Button, message } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { useAction } from '../../../utils/hooks/useAction'
import { useSMService } from '../hooks/useSMService'

const Configure = (): JSX.Element => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [obsMode, setObsMode] = useState<ObsMode>()
  const [obsModesDetails, setObsModesDetails] = useState<ObsModeDetails[]>([])

  const configure = (obsMode: ObsMode | undefined) => async (
    sequenceManagerService: SequenceManagerService
  ) => {
    if (!obsMode) throw Error('Please select obsmode!')

    return sequenceManagerService.configure(obsMode).then((res) => {
      switch (res._type) {
        case 'Success':
          return res
        case 'ConfigurationMissing':
          throw Error(`ConfigurationMissing for ${obsMode}`)
        case 'ConflictingResourcesWithRunningObsMode':
          throw Error(
            `${obsMode} is conflicting with currently running Observation Modes. Running ObsModes: ${res.runningObsMode.join(
              ','
            )} `
          )
        case 'FailedToStartSequencers':
          throw Error(`Failed to start Sequencers. Reason: ${res.reasons}`)
        case 'SequenceComponentNotAvailable':
          throw Error(res.msg)
        case 'LocationServiceError':
          throw Error(res.reason)
        case 'Unhandled':
          throw Error(res.msg)
      }
    })
  }

  const configureAction = useAction(
    'ConfigureAction',
    configure(obsMode),
    `${obsMode} has been configured.`,
    `Failed to configure ${obsMode}`
  )

  const smService = useSMService()

  const fetchObsModesDetails = async () => {
    const response = await smService.data?.getObsModesDetails()
    if (response) {
      switch (response._type) {
        case 'Success':
          return response
        case 'Failed':
          message.error(response.msg)
          break
        case 'LocationServiceError':
          message.error(response.reason)
          break
      }
    }
    throw Error('Failed to fetch ObsModes details')
  }

  const fetchConfigureConfAction = useAction(
    'Obsmodes',
    fetchObsModesDetails,
    'Successfully fetched ObsModes',
    'Failed to fetch Obsmodes',
    true,
    async (data) => {
      setObsModesDetails(
        data.obsModes.filter((x) => x.status._type === 'Configurable')
      )
    }
  )

  const handleModalOk = () => {
    if (obsMode) {
      if (smService.data) configureAction.mutate(smService.data)
      //.mutateAsync(agentServiceQuery.data)
      setModalVisibility(false)
    } else {
      message.error(`Please select observation mode!`)
    }
  }

  const onConfigureClick = () => {
    fetchConfigureConfAction.mutate(smService.data)
    setModalVisibility(true)
  }

  const handleCancel = () => {
    setModalVisibility(false)
    setObsMode(undefined)
  }

  return (
    <>
      <Button disabled={smService.isLoading} onClick={onConfigureClick}>
        Configure
      </Button>
      <SelectionModal
        title='Select an Observation Mode to configure:'
        okText='Configure'
        visible={modalVisibility}
        onOk={handleModalOk}
        onCancel={handleCancel}
        data={obsModesDetails.map(
          (obsModeDetail) => obsModeDetail.obsMode.name
        )}
        selectedItem={obsMode?.name ?? ''}
        onChange={(value: string) => setObsMode(new ObsMode(value))}
      />
    </>
  )
}
export default Configure
