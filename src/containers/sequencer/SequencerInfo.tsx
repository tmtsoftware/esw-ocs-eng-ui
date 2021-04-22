import { Prefix } from '@tmtsoftware/esw-ts'
import React from 'react'
import { useLocation } from 'react-router'
import { SequencerDetails } from '../../features/sequencer/components/sequencerDetails/SequencerDetails'
import { SequencerError } from '../../features/sequencer/components/SequencerError'

export const SequencerInfo = (): JSX.Element => {
  const { search } = useLocation()
  const query = new URLSearchParams(search)
  const maybePrefix = query.get('prefix')

  if (!maybePrefix)
    return (
      <SequencerError
        title={'Invalid sequencer prefix'}
        subtitle={'Sequencer prefix not present'}
      />
    )

  try {
    const sequencerPrefix = Prefix.fromString(maybePrefix)
    return <SequencerDetails prefix={sequencerPrefix} />
  } catch (e) {
    return (
      <SequencerError
        title={'Invalid sequencer prefix'}
        subtitle={e?.message}
      />
    )
  }
}
