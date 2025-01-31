import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useCardModal } from '@/src/hooks/useCardModal'
import React from 'react'
import { useParams } from 'react-router-dom';
import Header from './Header';
import { fetchCard } from '@/src/lib/api/card';
import { useQuery } from '@tanstack/react-query';

const CardModal = () => {
  const { id, listId, isOpen, onClose } = useCardModal();
  const { boardId } = useParams();

  const { data: card, isLoading } = useQuery({
    queryKey: ['card', boardId, listId, id], // Unique key for caching
    queryFn: () => fetchCard(boardId, listId, id),
    enabled: !!id && !!listId, // Only fetch if id and listId exist
    select: (data) => (data.success ? data.card : {}), // Extract card data
    staleTime: 0, // Always fetch fresh data when id changes
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='poppins-regular'>
        {
          !card || isLoading 
            ? (
              <Header.Skeleton />
            ) : (
              <Header data={card} />
            )
        }
      </DialogContent>
    </Dialog>
  )
}

export default CardModal
