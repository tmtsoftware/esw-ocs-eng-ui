import { Card, Col, Row, Typography } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'
import { InfraIcon, ResourceIcon, TelescopeIcon } from '../../components/icons'
import { SMCard } from '../../features/sm/components/smcard/SMCard'
import {
  INFRASTRUCTURE,
  OBSERVATIONS,
  RESOURCES
} from '../../routes/RoutesConfig'
import styles from './home.module.css'

type CardDetail = {
  title: string
  icon: JSX.Element
  link: string
}

const cards: CardDetail[] = [
  {
    title: 'Manage Infrastructure',
    icon: (
      <InfraIcon
        className={styles.commonIconSize}
        fill={'var(--activeColor)'}
      />
    ),
    link: INFRASTRUCTURE
  },
  {
    title: 'Manage Observations',
    icon: (
      <TelescopeIcon className={styles.commonIconSize} fill={'var(--purple)'} />
    ),
    link: OBSERVATIONS
  },
  {
    title: 'Resources',
    icon: <ResourceIcon className={styles.settingsIcon} />,
    link: RESOURCES
  }
]

const HomePageCard = (card: CardDetail) => (
  <Link role={card.title} to={card.link}>
    <Card hoverable>
      {card.icon}
      <Typography.Title className={styles.cardTitle} level={3}>
        {card.title}
      </Typography.Title>
    </Card>
  </Link>
)

export const Home = (): JSX.Element => (
  <>
    <Row justify='center'>
      <Col xs={24} className={styles.smCard}>
        {<SMCard />}
      </Col>
    </Row>
    <Row gutter={[32, 32]} className={styles.homePageCardsRow}>
      {cards.map((x, index) => (
        <Col key={index} xs={24} md={12} xl={8}>
          {HomePageCard(x)}
        </Col>
      ))}
    </Row>
  </>
)
// TODO : extract SMCardRow and otherCardRow
