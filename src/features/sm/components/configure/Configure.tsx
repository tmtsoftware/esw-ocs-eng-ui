import {
  ObsMode,
  ObsModeDetails,
  SequenceManagerService
} from '@tmtsoftware/esw-ts'
import { Button, message } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { useAction } from '../../../common/hooks/useAction'
import { AGENTS_STATUS_KEY } from '../../../queryKeys'
import { useSMService } from '../../hooks/useSMService'

type ConfigureProps = {
  disabled: boolean | undefined
}
const Configure = ({ disabled }: ConfigureProps): JSX.Element => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [obsMode, setObsMode] = useState<ObsMode>()
  const [obsModesDetails, setObsModesDetails] = useState<ObsModeDetails[]>([])

  const configure = async (sequenceManagerService: SequenceManagerService) => {
    return (
      obsMode &&
      sequenceManagerService.configure(obsMode).then((res) => {
        switch (res._type) {
          case 'Success':
            return res
          case 'ConfigurationMissing':
            throw Error(`ConfigurationMissing for ${obsMode?.name}`)
          case 'ConflictingResourcesWithRunningObsMode':
            throw Error(
              `${
                obsMode?.name
              } is conflicting with currently running Observation Modes. Running ObsModes: ${res.runningObsMode.map(
                (x) => x.name
              )}`
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
    )
  }

  const configureAction = useAction({
    mutationFn: configure,
    invalidateKeysOnSuccess: [AGENTS_STATUS_KEY],
    successMsg: `${obsMode?.name} has been configured.`,
    errorMsg: `Failed to configure ${obsMode?.name}`,
    useErrorBoundary: false
  })

  const smService = useSMService(false)

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

  const fetchConfigureConfAction = useAction({
    mutationFn: fetchObsModesDetails,
    useErrorBoundary: false,
    onSuccess: async (data) => {
      setObsModesDetails(
        data.obsModes.filter((x) => x.status._type === 'Configurable')
      )
      setObsMode(undefined) // on success clear the local selected obsMode
    }
  })

  const handleModalOk = () => {
    if (obsMode) {
      if (smService.data) {
        configureAction.mutate(smService.data)
      }
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
      <Button
        disabled={disabled || smService.isLoading || smService.isError}
        onClick={onConfigureClick}>
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
