import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCardModal } from '@/src/hooks/useCardModal'
import { Clock, CopyIcon, ListChecks, Tag, Trash } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import CardLabelPopover from './actions/label/CardLabelPopover'
import CardDatesPopover from './actions/dates/CardDatesPopover'
import CardChecklistPopover from './actions/checklist/CardChecklistPopover'
import DeleteConfirmation from '../../ui/DeleteConfirmation'
import useCardAPI from '@/src/hooks/api/useCardAPI'

const CardActions = ({ data }) => {
    const { boardId } = useParams();

    const { copyCard, deleteCard } = useCardAPI();
    const { onClose } = useCardModal();

    const onCopy = async () => {
        try {
            const body = {
                boardId,
                listId: data.list_id,
                cardId: data._id
            }

            const { success, newCard } = await copyCard(body);

            if (!success) {
                toast.error('Failed to copy card');
                return;
            }

            // local addition handled by socket listener
            toast.success('Card copied successfully');
        } catch (error) {
            console.error('Error copying card', error)
            toast.error('Error copying card')
        }
    }

    const onDelete = async (closeRef) => {
        try {
            const body = {
                boardId,
                listId: data.list_id,
                cardId: data._id
            }

            const { success } = await deleteCard(body);

            if (!success) {
                toast.error('Failed to delete card');
                return;
            }

            // local removal handled by socket listener
            onClose();
            closeRef.current?.click();
            toast.success('Card deleted successfully');
        } catch (error) {
            console.error('Error deleting card', error)
            toast.error('Error deleting card')
        }
    }

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs poppins-semibold'>Actions</p>

      <div className='flex flex-col gap-2 max-h-[15vh] md:max-h-[50vh] overflow-y-auto'>
        <CardDatesPopover card={data} boardId={boardId}>
          <Button variant='secondary' size='inline' className='w-full justify-start'>
            <Clock className='h-4 w-4 mr-2' />
            Dates
          </Button>
        </CardDatesPopover>
        <CardLabelPopover card={data}>
          <Button variant='secondary' size='inline' className='w-full justify-start'>
            <Tag className='h-4 w-4 mr-2' />
            Labels
          </Button>
        </CardLabelPopover>
        <CardChecklistPopover card={data}>
          <Button variant='secondary' size='inline' className='w-full justify-start'>
            <ListChecks className='h-4 w-4 mr-2' />
            Checklists
          </Button>
        </CardChecklistPopover>
        <Button
          variant='secondary' size='inline'
          className='w-full justify-start'
          onClick={onCopy}
        >
          <CopyIcon className='h-4 w-4 mr-2' />
          Duplicate
        </Button>
        <DeleteConfirmation
          message="Are you sure you want to delete this card?"
          onConfirm={onDelete}
        >
          <Button
            variant='secondary' size='inline'
            className='w-full justify-start'
          >
            <Trash className='h-4 w-4 mr-2' />
            Delete
          </Button>
        </DeleteConfirmation>
      </div>
    </div>
  )
}

CardActions.Skeleton = () => {
    return (
        <div className="space-y-2 mt-2">
            <Skeleton className='w-20 h-4 bg-secondary' />
            <Skeleton className='w-full h-8 bg-secondary' />
            <Skeleton className='w-full h-8 bg-secondary' />
        </div>
    )
}

export default CardActions