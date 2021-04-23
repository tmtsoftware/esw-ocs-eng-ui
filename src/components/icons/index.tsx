import Icon from '@ant-design/icons'
import React from 'react'
import { Infra } from './Infra'
import { Resource } from './Resource'
import { Telescope } from './Telescope'

type CustomIconComponentProps = {
  fill?: string
  className?: string
}

export const TelescopeIcon = (props: CustomIconComponentProps): JSX.Element => (
  <Icon
    component={() => (
      <Telescope className={props.className} fill={props.fill} />
    )}
    {...props}
  />
)

export const ResourceIcon = (props: CustomIconComponentProps): JSX.Element => (
  <Icon
    component={() => <Resource className={props.className} fill={props.fill} />}
    {...props}
  />
)

export const InfraIcon = (props: CustomIconComponentProps): JSX.Element => (
  <Icon
    component={() => <Infra className={props.className} fill={props.fill} />}
    {...props}
  />
)
