import { Button, Result } from 'antd'
import { Link } from 'react-router-dom'
import React from 'react'
import { HOME } from '../../../routes/RoutesConfig'

type ErrorProps = {
  title: string
  subtitle: string
}
export const SequencerError = ({
  title,
  subtitle
}: ErrorProps): JSX.Element => (
  <Result
    status='error'
    title={title}
    subTitle={subtitle}
    extra={
      <Link to={HOME}>
        <Button type='primary'>Back Home</Button>
      </Link>
    }
  />
)
