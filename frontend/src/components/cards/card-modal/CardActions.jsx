import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useCardModal } from '@/src/hooks/useCardModal'
import { copyCard, deleteCard } from '@/src/lib/api/card'
import useCardStore from '@/src/stores/useCardStore'
import { CopyIcon, Tag, Trash } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import CardLabelPopover from './actions/label/CardLabelPopover'

const CardActions = ({ data }) => {
    const { boardId } = useParams();
    const { pushCard, removeCard } = useCardStore();
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

            pushCard(newCard, newCard.list_id);
            toast.success('Card copied successfully');
        } catch (error) {
            console.error('Error copying card', error)
            toast.error('Error copying card')
        }
    }

    const onDelete = async () => {
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

            removeCard(data._id, data.list_id);
            onClose();
            toast.success('Card deleted successfully');
        } catch (error) {
            console.error('Error deleting card', error)
            toast.error('Error deleting card')
        }
    }

  return (
    <div className='space-y-2 mt-2'>
      <p className='text-xs poppins-semibold'>Actions</p>

      <CardLabelPopover card={data}>
        <Button variant='secondary' size='inline' className='w-full justify-start'>
          <Tag className='h-4 w-4 mr-2' />
          Labels
        </Button>
      </CardLabelPopover>

      <Button
        variant='secondary' size='inline'
        className='w-full justify-start'
        onClick={onCopy}
      >
        <CopyIcon className='h-4 w-4 mr-2' />
        Copy
      </Button>
      <Button
        variant='secondary' size='inline'
        className='w-full justify-start'
        onClick={onDelete}
      >
        <Trash className='h-4 w-4 mr-2' />
        Delete
      </Button>
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