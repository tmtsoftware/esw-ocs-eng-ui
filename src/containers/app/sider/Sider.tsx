import { Layout, Menu } from 'antd'
import { Link, useLocation } from 'react-router-dom'
import React, { useEffect, useState } from 'react'
import {
  InfraIcon,
  ResourceIcon,
  TelescopeIcon
} from '../../../components/icons'
import {
  INFRASTRUCTURE,
  OBSERVATIONS,
  RESOURCES
} from '../../../routes/RoutesConfig'
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
    <ResourceIcon className={styles.menuIconSize} />,
    RESOURCES
  )
]

export const Sider = (): JSX.Element => {
  const [collapsed, setCollapsed] = useState(true)
  const [selectedKey, setSelectedKey] = useState<string>('/')
  const location = useLocation()

  const onCollapse = () => setCollapsed(!collapsed)

  useEffect(() => {
    setSelectedKey(location.pathname)
  }, [location])

  return (
    <Layout.Sider
      theme={'light'}
      collapsible
      collapsed={collapsed}
      onCollapse={onCollapse}>
      <Menu selectedKeys={[selectedKey]}>
        {menuItemLabels.map((item) => (
          <Menu.Item
            className={styles.menuItem}
            icon={item.defaultIcon}
            onClick={() => setSelectedKey(item.link)}
            key={item.link}>
            <Link role={item.role} to={item.link}>
              {item.title}
            </Link>
          </Menu.Item>
        ))}
      </Menu>
    </Layout.Sider>
  )
}
