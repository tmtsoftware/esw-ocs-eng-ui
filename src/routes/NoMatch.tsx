import { Button, Result } from 'antd'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import { HOME } from './RoutesConfig'

export const NoMatch = (): JSX.Element => {
  const navigate = useNavigate()
  return (
    <Result
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button
          type='primary'
          onClick={() => {
            navigate(HOME)
          }}>
          Back Home
        </Button>
      }
    />
  )
}
