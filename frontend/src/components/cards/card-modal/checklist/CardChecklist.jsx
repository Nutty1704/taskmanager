import { ListChecks } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import AddItemForm from './AddItemForm'
import ChecklistItem from './ChecklistItem'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import toast from 'react-hot-toast'
import { useQueryClient } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { removeChecklist, updateChecklist } from '@/src/lib/api/checklist'
import ChecklistTitleForm from './ChecklistTitleForm'
import DeleteConfirmation from '@/src/components/ui/DeleteConfirmation'


const ItemWrapper = ({ children }) => {
  return (
    <div className='flex items-center ml-7'>
      { children }
    </div>
  )
}

const getProgressClass = (progress) => {
  if (progress >= 100) return 'bg-success';
  else if (progress >= 30) return 'bg-warning/60';
  else return 'bg-destructive/60';
}

const CardChecklist = ({ checklist, ...props }) => {
  const [ completedCount, setCompletedCount ] = useState(checklist.items.filter(item => item.isCompleted).length);
  const [ progress, setProgress ] = useState(0);
  const queryClient = useQueryClient();
  const { boardId } = useParams();

  const markCompleted = () => {
    setCompletedCount(completedCount + 1);
  }

  const markIncomplete = () => {
    setCompletedCount(completedCount - 1);
  }

  const onDelete = async (closeBtnRef) => {
    try {
      const { success } = await removeChecklist(props.card._id, props.card.list_id, boardId, checklist._id);

      if (success) {
        queryClient.invalidateQueries(['card-checklists', props.card?._id]);
        closeBtnRef.current?.click();
      } else {
        toast.error("Failed to delete checklist", 1000);
      }
    } catch (error) {
      console.error("Error deleting checklist", error);
      toast.error("Failed to delete checklist", 1000);
    }
  }

  const onTitleUpdate = async (title) => {
    try {
      const { success } = await updateChecklist(props.card?._id, checklist._id, title);

      if (success) queryClient.invalidateQueries(['card-checklists', props.card?._id]);

      return success;
    } catch (error) {
      console.error("Error updating title", error);
    }
  }

  useEffect(() => {
    if (checklist.items.length === 0) setProgress(0);
    else setProgress((completedCount / checklist.items.length) * 100);
  }, [completedCount]);

  useEffect(() => {
    setCompletedCount(checklist.items.filter(item => item.isCompleted).length);
  }, [checklist]);

  return (
    <div className='w-full my-2 poppins-regular'>

        {/* Title */}
        <div className='flex items-center justify-between text-foreground w-full mb-2'>
          <div className='w-full grid grid-cols-[1fr_25fr] items-center gap-x-1'>
            <ListChecks size={17} className='mt-0.5 w-full' />
            <div className='w-full flex items-center gap-x-1'>
              <ChecklistTitleForm title={checklist.title} onUpdate={onTitleUpdate} />
              {progress === 100 && (
                <span className='text-xs bg-success rounded-md text-background px-2 py-0.5'>Completed</span>
              )}
            </div>
          </div>

          <DeleteConfirmation
            message='Are you sure you want to delete this checklist?'
            onConfirm={onDelete}
          >
            <Button
              size='xs'
              variant='translucent'
              className='text-xs px-2 py-1'
            >
              Delete
            </Button>
          </DeleteConfirmation>
        </div>

        {/* Progress Bar */}
        <div className='w-full grid grid-cols-[1fr_25fr] gap-2 items-center mb-2'>
          <span className='text-xs text-muted-foreground'>{Math.round(progress)}%</span>
          <Progress
            value={progress}
            indicatorClass={getProgressClass(progress)}
            className='h-1.5'
          />
        </div>

        {/* Items */}
        <div className="w-full space-y-2">
          {checklist.items.map(item => (
            <ChecklistItem
              key={item._id}
              item={item}
              cardId={props.card?._id}
              checklistId={checklist._id}
              onComplete={markCompleted}
              onIncomplete={markIncomplete}
            />
          ))}

          <ItemWrapper>
            <AddItemForm checklist={checklist} {...props} />
          </ItemWrapper>
        </div>
    </div>
  )
}

export default CardChecklist
