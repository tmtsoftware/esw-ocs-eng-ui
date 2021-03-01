import { AuthContext } from '@tmtsoftware/esw-ts'
import { Avatar, Button } from 'antd'
import React, { useContext, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TMTLogo from '../../assets/images/TMT_Logo.png'
import { RoutesConfig } from '../../routes'
import styles from './headerBar.module.css'

const HeaderBar = (): JSX.Element => {
  const { auth, login, logout } = useContext(AuthContext)
  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    !!auth &&
      !!auth.isAuthenticated() &&
      setUsername(auth.tokenParsed()?.preferred_username)
  }, [auth])

  const Logout = () => (
    <>
      <Avatar size={'small'}>{username?.charAt(0).toUpperCase()}</Avatar>
      <Button type='text' onClick={logout}>
        {username?.toUpperCase()}
      </Button>
    </>
  )

  const Login = () => (
    <Button type='text' onClick={login}>
      Login
    </Button>
  )

  return (
    <>
      {auth?.isAuthenticated() ? <Logout /> : <Login />}
      {/* TODO should we use history.push ? */}
      <Link to={RoutesConfig.home}>
        <img role='tmt_logo' src={TMTLogo} className={styles.logo} />
      </Link>
    </>
  )
}

export default HeaderBar
