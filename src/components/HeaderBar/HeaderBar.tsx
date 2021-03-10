import { DownOutlined, LogoutOutlined } from '@ant-design/icons'
import { useKeycloak } from '@react-keycloak/web'
import { Button, Dropdown, Menu } from 'antd'
import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import TMTLogo from '../../assets/images/TMT_Logo.png'
import { HOME } from '../../routes/RoutesConfig'
import styles from './headerBar.module.css'

const HeaderBar = (): JSX.Element => {
  const { keycloak } = useKeycloak()

  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    keycloak.loadUserProfile().then((profile) => setUsername(profile.username))
  }, [keycloak])

  const menu = (
    <Menu>
      <Menu.Item
        key='1'
        danger
        icon={<LogoutOutlined />}
        onClick={() => keycloak.logout()}>
        Logout
      </Menu.Item>
    </Menu>
  )

  const Logout = () => (
    <>
      <Dropdown trigger={['click']} overlay={menu}>
        <Button type={'text'}>
          {username?.toUpperCase()} <DownOutlined />
        </Button>
      </Dropdown>
    </>
  )

  const Login = () => (
    <Button type='text' onClick={() => keycloak.login()}>
      Login
    </Button>
  )

  return (
    <>
      {keycloak.authenticated ? <Logout /> : <Login />}
      <Link to={HOME}>
        <img role='tmt_logo' src={TMTLogo} className={styles.logo} />
      </Link>
    </>
  )
}

export default HeaderBar
