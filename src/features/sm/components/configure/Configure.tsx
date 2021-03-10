import {
  ObsMode,
  ObsModeDetails,
  SequenceManagerService
} from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { useAction } from '../../../common/hooks/useAction'
import { errorMessage, successMessage } from '../../../common/message'
import { AGENTS_STATUS_KEY } from '../../../queryKeys'
import { useObsModesDetails } from '../../hooks/useObsModesDetails'
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
    onSuccess: () => successMessage(`${obsMode?.name} has been configured.`),
    onError: (e) => errorMessage(`Failed to configure ${obsMode?.name}`, e),
    invalidateKeysOnSuccess: [AGENTS_STATUS_KEY],
    useErrorBoundary: false
  })

  const smService = useSMService(false)

  const { data } = useObsModesDetails()

  const handleModalOk = () => {
    if (obsMode) {
      if (smService.data) {
        configureAction.mutate(smService.data)
      }
      setModalVisibility(false)
    } else {
      errorMessage(`Please select observation mode!`)
    }
  }

  const onConfigureClick = () => {
    if (data) {
      setObsModesDetails(
        data.obsModes.filter((x) => x.status._type === 'Configurable')
      )
    }
    setObsMode(undefined)
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
