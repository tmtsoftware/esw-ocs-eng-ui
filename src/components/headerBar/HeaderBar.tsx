import { DownOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Dropdown, Menu } from 'antd'
import { Link } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import TMTLogo from '../../assets/images/TMT_Logo.png'
import { useAuth } from '../../hooks/useAuth'
import { HOME } from '../../routes/RoutesConfig'
import styles from './headerBar.module.css'

export const HeaderBar = (): JSX.Element => {
  const { auth, logout } = useAuth()
  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    setUsername(auth?.tokenParsed()?.preferred_username)
  }, [auth])

  const menu = (
    <Menu>
      <Menu.Item key='1' danger icon={<LogoutOutlined />} onClick={logout}>
        Logout
      </Menu.Item>
    </Menu>
  )

  const Logout = () => (
    <Dropdown trigger={['click']} overlay={menu}>
      {username ? (
        <Button type='text'>
          {username.toUpperCase()}
          <DownOutlined />
        </Button>
      ) : (
        <></>
      )}
    </Dropdown>
  )

  return (
    <>
      <Link to={HOME}>
        <img role='tmt_logo' src={TMTLogo} className={styles.logo} />
      </Link>
      <Logout />
    </>
  )
}
