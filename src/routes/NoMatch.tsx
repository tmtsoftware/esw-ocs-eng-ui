import { Button, Result } from 'antd'
import React from 'react'
import { useHistory } from 'react-router-dom'
import { HOME } from './RoutesConfig'

const NoMatch = (): JSX.Element => {
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

export default NoMatch
