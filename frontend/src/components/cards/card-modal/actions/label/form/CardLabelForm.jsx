import React, { useState } from 'react'
import colors from '@/src/config/labelColors.json'
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import LabelColorGrid from './LabelColorGrid';

const CardLabelForm = ({
  label,
  onSave = (title, color) => { },
  onDelete = (id) => { }
}) => {
  const [title, setTitle] = useState(label.title || '');
  const [color, setColor] = useState(label.color || 6);

  const onColorSelect = (color) => {
    setColor(color);
  }

  return (
    <div className='w-full flex flex-col gap-2'>
      <div className='bg-gray-900 w-full py-10 px-8 rounded-sm'>
        <div
          className='h-7 rounded-md'
          style={{ backgroundColor: colors[color]?.hex }}
        >
          <span className='text-xs pl-2 poppins-medium text-primary-foreground w-full overflow-hidden z-10 relative'>{title}</span>
        </div>
      </div>

      <div className='space-y-1'>
        <span className='text-sm text-muted-foreground font-medium'>Title</span>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-3 py-1 border-b text-sm bg-secondary focus:outline-none rounded-md text-muted-foreground font-medium'
          autoFocus
        />
      </div>

      <div className='space-y-1'>
        <span className='text-sm text-muted-foreground font-medium'>Colors</span>
        <LabelColorGrid onSelect={onColorSelect} selectedColor={colors[color]} />
      </div>

      <Separator className='my-2' />

      <div className="flex items-center justify-between">
        <Button
          size='sm'
          variant='secondary'
          onClick={() => onSave(title, color, label._id)}
        >
          Save
        </Button>
        {label._id &&
          <Button
            size='sm'
            variant='destructive'
            onClick={() => onDelete(label._id)}
          >
            Delete
          </Button>}
      </div>
    </div>
  )
}

export default CardLabelForm
