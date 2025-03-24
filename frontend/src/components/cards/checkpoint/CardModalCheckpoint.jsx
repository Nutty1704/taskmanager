import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useCardCpModal } from '@/src/stores/useCardCpModal';
import React from 'react'
import CardHeader from '../card-modal/CardHeader';
import CardDescription from '../card-modal/CardDescription';
import CardUnderHeader from '../card-modal/under-header/CardUnderHeader';
import CardChecklistContainer from '../card-modal/checklist/CardChecklistContainer';
import CardComplete from '../card-modal/actions/complete/CardComplete';
import CardUHLabelListItem from '../card-modal/under-header/labels/CardUHLabelItem';
import { format } from 'date-fns';
import ToolTip from '../../ui/ToolTip';


const formatDate = (date) => {
  return format(new Date(date), "dd MMM yyyy");
}

const CardModalCheckpoint = () => {
  const { card, isOpen, onClose } = useCardCpModal();

  console.log(card);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={onClose}
    >
      <DialogContent className='poppins-regular'>
        <DialogTitle className='mb-4'>
          <div className='flex items-center gap-2.5'>
            <CardComplete.Static data={card} />
            <div className='font-semibold text-xl md:text-xl px-1 text-foreground bg-transparent border-transparent relative -left-1.5 w-[95%] focus-visible:bg-background focus-visible:border-input mb-0.5 truncate'>
              {card?.title}
            </div>
          </div>

          <div className='flex items-center gap-5 mt-3'>
            {card?.labels?.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className='text-foreground text-sm'>Labels</span>
                <div className='flex gap-1.5'>
                  {card?.labels?.map((label) => (
                    <CardUHLabelListItem key={label._id} label={label} />
                  ))}
                </div>
              </div>
            )}

            {card?.startDate && (
              <div className="flex flex-col gap-2">
                <span className='text-foreground text-sm'>Start Date</span>
                <div className='flex gap-1.5'>
                  <span className='text-foreground text-sm'>{formatDate(card.startDate)}</span>
                </div>
              </div>
            )}

            {card?.dueDate && (
              <div className="flex flex-col gap-2">
                <span className='text-foreground text-sm'>Due Date</span>
                <div className='flex gap-1.5'>
                  <span className='text-foreground text-sm poppins-regular'>{formatDate(card.dueDate)}</span>
                </div>
              </div>
            )}

            {card?.assignedTo?.length > 0 && (
              <div className="flex flex-col gap-2">
                <span className='text-foreground text-sm'>Members</span>
                <div className='flex gap-1.5'>
                  {card?.assignedTo?.map((member) => (
                    <ToolTip key={member.id} text={member.firstName + " " + member.lastName}>
                      <img
                        key={member.id}
                        src={member.imageUrl}
                        alt={member.firstName + " " + member.lastName}
                        className='h-8 w-8 rounded-full'
                      />
                    </ToolTip>
                  ))}
                </div>
              </div>
            )}
          </div>
        </DialogTitle>

        <div className="grid grid-cols-1 md:grid-cols-4 md:gap-4 max-h-[60vh]">
          <div className='col-span-3 overflow-auto'>
            <div className='w-full space-y-6'>
              {
                !card
                  ? <CardDescription.Skeleton />
                  : <CardDescription.Static description={card?.description} />
              }

              {
                !card
                  ? <CardChecklistContainer.Skeleton />
                  : <CardChecklistContainer.Static checklists={card?.checklists} />
              }

            </div>
          </div>

          <div className='col-span-1'>
            <span className='text-foreground text-sm poppins-semibold'>Card Actions</span>
            <p className='text-muted-foreground text-sm mt-1.5'>
              Cannot perform actions in view only mode.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default CardModalCheckpoint
