import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox'
import { removeItem, updateItem } from '@/src/lib/api/checklist';
import { useQueryClient } from '@tanstack/react-query';
import { Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import toast from 'react-hot-toast';

const ChecklistItem = ({ item, checklistId, cardId, onComplete, onIncomplete }) => {
  const [isChecked, setIsChecked] = useState(item.isCompleted);
  const queryClient = useQueryClient();

  const onCheckedChange = async (checked) => {
    setIsChecked(checked);
    
    try {
      const { success } = await updateItem(cardId, checklistId, item._id, item.text, checked);

      if (success) {
        if (checked) onComplete();
        else onIncomplete();

        console.log('Item updated');
        queryClient.invalidateQueries(['card-checklists', cardId]);
      } else {
        setIsChecked(!checked);
      }
    } catch (error) {
      setIsChecked(!checked);
    }
  }

  const onDelete = async () => {
    try {
      const { success } = await removeItem(cardId, checklistId, item._id);

      if (success) {
        queryClient.invalidateQueries(['card-checklists', cardId]);
      } else {
        toast.error('Failed to delete item');
      }
    } catch (error) {
      toast.error('Failed to delete item');
      console.error("Error deleting item", error);
    }
  }

  return (
    <div className='flex items-center gap-2'>
      <Checkbox
        className='w-4 h-4 rounded-full border-success data-[state=checked]:bg-success disabled:cursor-pointer'
        checkClass='text-background h-3 w-3'
        defaultChecked={isChecked}
        onCheckedChange={onCheckedChange}
        strokeWidth={3}
      />
      <div className='w-full hover:cursor-pointer hover:bg-foreground/10 rounded-md py-1 px-2 group flex'>
        <span className={`transition-all duration-200 ${isChecked && 'line-through text-muted-foreground'}`}>
          {item.text}
        </span>

        <div className='ml-auto hidden group-hover:flex items-center'>
          <Button
            variant='transparent'
            size='xs'
            className='rounded-full p-1'
            onClick={onDelete}
          >
            <Trash2 className='h-4 w-4 text-muted-foreground' />
          </Button>
        </div>
      </div>
    </div>
  )
}

export default ChecklistItem