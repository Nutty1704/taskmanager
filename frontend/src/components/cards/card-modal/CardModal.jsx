import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCardModal } from '@/src/hooks/useCardModal'
import React from 'react'
import { useParams } from 'react-router-dom';
import CardHeader from './CardHeader';
import { fetchCard, fetchCardAuditLog } from '@/src/lib/api/card';
import { useQuery, useQueryClient, QueryClientProvider } from '@tanstack/react-query';
import CardDescription from './CardDescription';
import CardActions from './CardActions';
import CardActivity from './CardActivity';
import CardUnderHeader from './under-header/CardUnderHeader';
import useCardStore from '@/src/stores/useCardStore';
import CardChecklistContainer from './checklist/CardChecklistContainer';
import { getChecklists } from '@/src/lib/api/checklist';

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

  const { data: checklists, isLoadingChecklists } = useQuery({
    queryKey: ['card-checklists', id],
    queryFn: () => getChecklists(id),
    enabled: !!id,
    select: (data) => (data.checklists),
    staleTime: 0,
  });

  const queryClient = useQueryClient();

  const { updateCard } = useCardStore();

  React.useEffect(() => {
    if (!card) return;
    updateCard(card._id, listId, card);
  }, [card]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <QueryClientProvider client={queryClient}>
        <DialogContent className='poppins-regular'>
          <DialogTitle className='mb-4'>
            {
              !card || isLoading
                ? (
                  <CardHeader.Skeleton />
                ) : (
                  <CardHeader data={card} />
                )
            }

            <div className='mt-3'>
              <CardUnderHeader card={card} />
            </div>
          </DialogTitle>

          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 max-h-[60vh] overflow-auto">
            <div className='col-span-3'>
              <div className='w-full space-y-6'>
                {
                  !card || isLoading
                    ? <CardDescription.Skeleton />
                    : <CardDescription data={card} />
                }

                {
                  !card || isLoadingChecklists
                    ? null
                    : <CardChecklistContainer checklists={checklists} card={card} />
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
      </QueryClientProvider>
    </Dialog>
  )
}

export default CardModal
