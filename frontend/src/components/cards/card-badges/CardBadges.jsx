import { Text } from 'lucide-react'
import React from 'react'
import CardBadge from './CardBadge'
import DateBadge from './badges/date-badge';
import MemberBadge from './badges/member-badge';

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

  if (data.startDate || data.dueDate) {
    badges.push(
      <DateBadge startDate={data.startDate} dueDate={data.dueDate} badgeSize={badgeSize} key='date-badge' />
    );
  }

  if (data.assignedTo?.length > 0) {
    badges.push(
      <MemberBadge key='member-badge' data={data} badgeSize={badgeSize} />
    )
  }

  if (badges.length === 0) {
    return null;
  }

  return (
    <div className='flex items-center justify-start text-sm text-muted-foreground gap-2'>
      {badges}
    </div>
  )
}

export default CardBadges
