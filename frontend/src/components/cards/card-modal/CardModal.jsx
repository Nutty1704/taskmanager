import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCardModal } from '@/src/hooks/useCardModal'
import React from 'react'
import { useParams } from 'react-router-dom';
import CardHeader from './CardHeader';
import { fetchCard, fetchCardAuditLog } from '@/src/lib/api/card';
import { useQuery } from '@tanstack/react-query';
import CardDescription from './CardDescription';
import CardActions from './CardActions';
import CardActivity from './CardActivity';

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

  const { data: auditLog, isLoadingAudit } = useQuery({
    queryKey: ['card-logs', id],
    queryFn: () => fetchCardAuditLog(id),
    enabled: !!id,
    select: (data) => (data.logs),
    staleTime: 0,
  });

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='poppins-regular'>
        <DialogTitle>
          {
            !card || isLoading
              ? (
                <CardHeader.Skeleton />
              ) : (
                <CardHeader data={card} />
              )
          }
        </DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4">
          <div className='col-span-3'>
            <div className='w-full space-y-6'>
              {
                !card || isLoading
                  ? <CardDescription.Skeleton />
                  : <CardDescription data={card} />
              }

              {!auditLog || isLoadingAudit
                ? <CardActivity.Skeleton />
                : <CardActivity items={auditLog} />
              }

            </div>
          </div>

          {!card || isLoading
            ? <CardActions.Skeleton />
            : <CardActions data={card} />
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardModal
