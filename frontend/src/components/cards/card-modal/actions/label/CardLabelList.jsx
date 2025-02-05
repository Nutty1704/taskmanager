import useLabelStore from '@/src/stores/useLabelStore'
import React from 'react'
import CardLabelItem from './CardLabelItem';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

const CardLabelList = ({ card, labels = [], onShowForm = (label, isUpdate) => {} }) => {
  return (
    <div className='flex flex-col gap-1.5'>
        <div className='text-xs text-muted-foreground font-medium'>Labels</div>
      {labels?.map(label => (
        <CardLabelItem key={label._id} label={label} defaultChecked={card.labels?.some(l => l._id === label._id)} card={card} onShowForm={onShowForm} />
      ))}

      <Separator className='my-2 bg-muted-foreground/50 w-[90%] mx-auto' />

      <Button
        variant='invert'
        className='w-full'
        onClick={() => onShowForm({})}
      >
        Create new label
      </Button>
    </div>
  )
}

export default CardLabelList
