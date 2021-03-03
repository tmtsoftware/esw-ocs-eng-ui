import { AuthContext } from '@tmtsoftware/esw-ts'
import { Button, Result } from 'antd'
import React, { useContext } from 'react'

const LoginPage = (): JSX.Element => {
  const { login } = useContext(AuthContext)
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
