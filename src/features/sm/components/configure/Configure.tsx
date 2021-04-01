import { ObsMode, ObsModeDetails } from '@tmtsoftware/esw-ts'
import { Button } from 'antd'
import React, { useState } from 'react'
import { SelectionModal } from '../../../../components/Modal/SelectionModal'
import { errorMessage } from '../../../../utils/message'
import { useConfigureAction } from '../../hooks/useConfigureAction'
import { useObsModesDetails } from '../../hooks/useObsModesDetails'
import { useSMService } from '../../hooks/useSMService'

type ConfigureProps = {
  disabled: boolean | undefined
}
const Configure = ({ disabled }: ConfigureProps): JSX.Element => {
  const [modalVisibility, setModalVisibility] = useState(false)
  const [obsMode, setObsMode] = useState<ObsMode>()
  const [obsModesDetails, setObsModesDetails] = useState<ObsModeDetails[]>([])

  const smService = useSMService(false)
  const { data } = useObsModesDetails()

  const configureAction = useConfigureAction(obsMode)
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
      setObsModesDetails(data.Configurable)
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
