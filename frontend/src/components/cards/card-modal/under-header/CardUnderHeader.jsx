import React from 'react'
import CardUHLabelListItem from './labels/CardUHLabelItem';
import CardUHDates from './labels/CardUHDates';
import { useParams } from 'react-router-dom';
import Members from './members/Members';

export const UHHeader = ({ text }) => {
  return (
    <span className='text-xs font-medium text-muted-foreground'>{text}</span>
  )
}

const UHBody = ({ children, className }) => {
  return (
    <div className={`flex flex-col items-start gap-1.5 justify-start ${className}`}>
      {children}
    </div>
  )
}

const CardUnderHeader = ({ card }) => {
  if (!card) return null;
  const { boardId } = useParams();

  return (
    <div className='flex items-start gap-4 poppins-regular'>
      {card.labels?.length > 0 &&
        (
          <UHBody>
            <UHHeader text="Labels" />
            <div className="flex items-center justify-start gap-1.5">
              {card.labels?.map(label => (
                <CardUHLabelListItem key={label._id} label={label} />
              ))}
            </div>
          </UHBody>
        )
      }

      {(card.startDate || card.dueDate) &&
        (
          <UHBody>
            <UHHeader text="Dates" />
            <CardUHDates boardId={boardId} card={card} />
          </UHBody>
        )
      }

      <UHBody>
        <UHHeader text="Members" />
        <Members data={card} />
      </UHBody>
    </div>
  )
}

export default CardUnderHeader
