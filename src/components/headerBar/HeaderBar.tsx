import { DownOutlined, LogoutOutlined } from '@ant-design/icons'
import { Button, Dropdown, MenuProps, Space } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import styles from './headerBar.module.css'
import { useAuth } from '../../hooks/useAuth'
import { HOME } from '../../routes/RoutesConfig'
import { getUsername } from '../../utils/getUsername'

export const HeaderBar = (): React.JSX.Element => {
  const { auth, logout } = useAuth()
  const [username, setUsername] = useState<string | undefined>(undefined)

  useEffect(() => {
    setUsername(getUsername(auth))
  }, [auth])

  const items: MenuProps['items'] = [
    {
      label: 'Logout',
      key: '1',
      icon: <LogoutOutlined />,
      danger: true
    }
  ]

  const menuProps = {
    items,
    onClick: logout
  }

  const Logout = () => (
    <Dropdown menu={menuProps}>
      {username ? (
        <Button type='text'>
          <Space>
            {username!.toUpperCase()}
            <DownOutlined />
          </Space>
        </Button>
      ) : (
        <></>
      )}
    </Dropdown>
  )

  return (
    <>
      <Link to={HOME}>
        <img role='tmt_logo' src={'TMT_Logo.png'} className={styles.logo} alt='tmt_logo' />
      </Link>
      <Logout />
    </>
  )
}
