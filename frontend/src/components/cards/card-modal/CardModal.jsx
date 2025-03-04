import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCardModal } from '@/src/hooks/useCardModal'
import React from 'react'
import { useParams } from 'react-router-dom';
import CardHeader from './CardHeader';
import { useQuery, useQueryClient, QueryClientProvider } from '@tanstack/react-query';
import CardDescription from './CardDescription';
import CardActions from './CardActions';
import CardActivity from './CardActivity';
import CardUnderHeader from './under-header/CardUnderHeader';
import useCardStore from '@/src/stores/useCardStore';
import CardChecklistContainer from './checklist/CardChecklistContainer';
import useChecklistAPI from '@/src/hooks/api/useChecklistAPI';
import useCardAPI from '@/src/hooks/api/useCardAPI';

const CardModal = () => {
  const { id, listId, isOpen, onClose } = useCardModal();
  const { boardId } = useParams();

  const { fetchCard, fetchCardAuditLog } = useCardAPI();
  const { getChecklists } = useChecklistAPI();
  const { data: card, isLoading } = useQuery({
    queryKey: ['card', listId, id], // Unique key for caching
    queryFn: () => fetchCard(boardId, listId, id),
    enabled: isOpen && !!id && !!listId,
    select: (data) => (data.success ? data.card : {}),
    staleTime: 0,
  });

  const { data: auditLog, isLoadingAudit } = useQuery({
    queryKey: ['card-logs', id],
    queryFn: () => fetchCardAuditLog(id),
    enabled: isOpen && !!id,
    select: (data) => (data.logs),
    staleTime: 0,
  });

  const { data: checklists, isLoadingChecklists } = useQuery({
    queryKey: ['card-checklists', id],
    queryFn: () => getChecklists(id),
    enabled: isOpen && !!id,
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

          <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 max-h-[60vh]">
            <div className='col-span-3 overflow-auto'>
              <div className='w-full space-y-6'>
                {
                  !card || isLoading
                    ? <CardDescription.Skeleton />
                    : <CardDescription data={card} />
                }

                {
                  !card || isLoadingChecklists
                    ? <CardChecklistContainer.Skeleton />
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
