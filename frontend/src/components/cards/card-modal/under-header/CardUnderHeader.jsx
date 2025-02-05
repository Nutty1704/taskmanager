import React from 'react'
import CardUHLabelListItem from './labels/CardUHLabelItem';

const CardUnderHeader = ({ card }) => {
    if (!card) return null;

  return (
    <div className='flex items-center gap-2 poppins-regular'>
        <div className='space-y-1.5'>
          <span className='text-xs font-medium text-muted-foreground'>Labels</span>
          <div className="flex items-center justify-start gap-1.5">
              {card.labels?.map(label => (
                  <CardUHLabelListItem key={label._id} label={label} />
              ))}
          </div>
        </div>
    </div>
  )
}

export default CardUnderHeader
