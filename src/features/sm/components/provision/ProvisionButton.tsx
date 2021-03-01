import {
  AgentProvisionConfig,
  ConfigService,
  Prefix,
  ProvisionConfig,
  SequenceManagerService
} from '@tmtsoftware/esw-ts'
import { Button, message, Modal } from 'antd'
import React, { useState } from 'react'
import { useAction } from '../../../common/hooks/useAction'
import { useConfigService } from '../../../config/hooks/useConfigService'
import { ProvisionConfPath } from '../../constants'
import { useProvisionAction } from '../../hooks/useProvisionAction'
import { useSMService } from '../../hooks/useSMService'
import styles from './provision.module.css'
import { ProvisionTable } from './ProvisionTable'

type ProvisionRecord = Record<string, number>

const provision = (provisionRecord: ProvisionRecord) => (
  sequenceManagerService: SequenceManagerService
) => {
  const provisionConfig = parseProvisionConf(provisionRecord)
  return sequenceManagerService.provision(provisionConfig).then((res) => {
    switch (res._type) {
      case 'Success':
        return res
      case 'LocationServiceError':
        throw Error(res.reason)
      case 'Unhandled':
        throw Error(res.msg)
      case 'SpawningSequenceComponentsFailed':
        throw Error(res.failureResponses.join('\n'))
      case 'CouldNotFindMachines':
        throw Error(
          `Could not found following machine:\n ${res.prefix
            .map((x) => x.toJSON())
            .join('\n')}`
        )
    }
  })
}

const parseProvisionConf = (provisionRecord: ProvisionRecord) => {
  const agentProvisionConfigs = Object.entries(provisionRecord).map(
    ([prefixStr, num]) => {
      return new AgentProvisionConfig(Prefix.fromString(prefixStr), num)
    }
  )
  return new ProvisionConfig(agentProvisionConfigs)
}

const fetchProvisionConf = async (
  configService: ConfigService
): Promise<ProvisionRecord> => {
  const confOption = await configService.getActive(ProvisionConfPath)
  if (!confOption) throw Error('Provision conf is not present')
  const provisionConfRecord = await confOption.fileContentAsString()
  return JSON.parse(provisionConfRecord)
}

export const ProvisionButton = (): JSX.Element => {
  const useErrorBoundary = false
  const [modalVisibility, setModalVisibility] = useState(false)
  const [provisionRecord, setProvisionRecord] = useState<ProvisionRecord>({})

  const handleModalCancel = () => setModalVisibility(false)

  const configService = useConfigService(useErrorBoundary)
  const smService = useSMService(useErrorBoundary)

  const fetchProvisionConfAction = useAction(
    'provisionConfig',
    fetchProvisionConf,
    'Successfully fetched Provision Config from ConfigService',
    'Failed to fetch Provision Config',
    useErrorBoundary,
    async (data) => {
      if (Object.values(data).length <= 0) {
        await message.error('Provision config is empty')
      } else {
        setProvisionRecord(data)
        setModalVisibility(true)
      }
    }
  )

  const provisionAction = useProvisionAction(
    provision(provisionRecord),
    'Successfully provisioned',
    'Failed to provision',
    useErrorBoundary
  )

  const onProvisionClick = () => {
    if (configService.data) fetchProvisionConfAction.mutate(configService.data)
  }

  const handleModalOk = () => {
    if (smService.data) provisionAction.mutate(smService.data)
    setModalVisibility(false)
  }

  return (
    <>
      <Button
        type='primary'
        size='middle'
        disabled={smService.isLoading || smService.isError}
        loading={provisionAction.isLoading}
        onClick={onProvisionClick}>
        Provision
      </Button>
      <Modal
        title='Provision Config'
        okText='Provision'
        centered
        visible={modalVisibility}
        confirmLoading={provisionAction.isLoading}
        bodyStyle={{ padding: 0 }}
        className={styles.modalHeader}
        onOk={handleModalOk}
        onCancel={handleModalCancel}>
        <ProvisionTable
          provisionRecord={provisionRecord}
          setProvisionRecord={setProvisionRecord}
        />
      </Modal>
    </>
  )
}
