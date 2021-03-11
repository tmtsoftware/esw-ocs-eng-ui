import { Layout, Menu } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { TelescopeIcon, InfraIcon, SettingsIcon } from '../../components/Icons'
import {
  HOME,
  INFRASTRUCTURE,
  OBSERVATIONS,
  RESOURCES
} from '../../routes/RoutesConfig'
import styles from './sider.module.css'

const getMenuLabel = (
  title: string,
  defaultIcon: React.ReactNode,
  link: string
) => ({
  title,
  link,
  role: title.replace(' ', ''),
  defaultIcon: defaultIcon
})

const menuItemLabels = [
  getMenuLabel(
    'Manage Infrastructure',
    <InfraIcon className={styles.menuIconSize} />,
    INFRASTRUCTURE
  ),
  getMenuLabel(
    'Manage Observations',
    <TelescopeIcon className={styles.menuIconSize} />,
    OBSERVATIONS
  ),
  getMenuLabel(
    'Resources',
    <SettingsIcon className={styles.menuIconSize} />,
    RESOURCES
  )
]
export const Sider = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string>('')
  const location = useLocation()

  const onCollapse = () => setCollapsed(!collapsed)

  useEffect(() => {
    menuItemLabels.forEach((item, i) => {
      if (location.pathname === item.link) setSelectedKey(i.toString())
      else if (location.pathname === HOME) {
        setSelectedKey(HOME)
      }
    })
  }, [location])

  return (
    <Layout.Sider
      theme={'light'}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}>
      <Menu selectedKeys={[selectedKey]}>
        {menuItemLabels.map((item, i) => (
          <Menu.Item
            className={styles.menuItem}
            icon={item.defaultIcon}
            onClick={() => setSelectedKey(i.toString())}
            key={i}>
            <Link role={item.role} to={item.link}>
              {item.title}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  )
}
