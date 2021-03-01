import { Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { InfraIcon, SettingsIcon, TelescopeIcon } from '../../components/Icons'
import SMCard from '../../features/sm/components/smcard/SMCard'
import { RoutesConfig } from '../../routes'
import styles from './home.module.css'

type CardDetail = {
  title: string
  icon: JSX.Element
  link: string
}

const cards: CardDetail[] = [
  {
    title: 'Manage Infrastructure',
    icon: <InfraIcon className={styles.commonIconSize} fill={'#1890FF'} />,
    link: RoutesConfig.infrastructure
  },
  {
    title: 'Manage Observations',
    icon: <TelescopeIcon className={styles.commonIconSize} fill={'#9254DE'} />,
    link: RoutesConfig.observations
  },
  {
    title: 'Resources',
    icon: <SettingsIcon className={styles.settingsIcon} />,
    link: RoutesConfig.resources
  }
]

const HomePageCard = (card: CardDetail) => (
  <Link role={card.title} to={card.link}>
    <Card hoverable className={styles.homePageCards}>
      {card.icon}
      <Typography.Title className={styles.cardTitle} level={3}>
        {card.title}
      </Typography.Title>
    </Card>
  </Link>
)

const Home = (): JSX.Element => (
  <>
    <Row align={'middle'} className={styles.inheritMinHeight}>
      <Row className={styles.smCard}>
        <Col>{<SMCard />}</Col>
      </Row>
      <Col span={24}>
        <Row gutter={[32, 32]} className={styles.homePageCardsRow}>
          {cards.map((x, index) => (
            <Col key={index} span={8}>
              {HomePageCard(x)}
            </Col>
          ))}
        </Row>
      </Col>
    </Row>
  </>
)

export default Home
