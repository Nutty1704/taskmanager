import { Text } from 'lucide-react'
import React from 'react'
import CardBadge from './CardBadge'

const CardBadges = ({ data }) => {
  const badges = [];
  const badgeSize = 14

  if (data.description) {
    badges.push(
      <CardBadge text='This card has a description.' key='description'>
        <Text size={badgeSize} />
      </CardBadge>
    )
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center justify-start text-sm text-muted-foreground'>
      {badges}
    </div>
  )
}

export default CardBadges
