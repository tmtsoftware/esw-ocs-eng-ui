import { Button, Result } from 'antd'
import { useHistory } from 'react-router-dom'
import React from 'react'
import { HOME } from './RoutesConfig'

export const NoMatch = (): JSX.Element => {
  const history = useHistory()
  return (
    <Result
      title='404'
      subTitle='Sorry, the page you visited does not exist.'
      extra={
        <Button
          type='primary'
          onClick={() => {
            history.push(HOME)
          }}>
          Back Home
        </Button>
      }
    />
  )
}
