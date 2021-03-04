import { Button, Result } from 'antd'
import React from 'react'
import { useAuthContext } from '../contexts/useAuthContext'

const LoginPage = (): JSX.Element => {
  const { login } = useAuthContext()
  return (
    <Result
      title='403'
      subTitle='You are not logged in. Please Login'
      extra={
        <Button type='primary' onClick={login}>
          Login
        </Button>
      }
    />
  )
}
export default LoginPage
