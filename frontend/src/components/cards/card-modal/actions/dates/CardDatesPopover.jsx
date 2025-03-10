import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'
import CalendarForm from '@/src/components/form/calendar-form'
import useCardAPI from '@/src/hooks/api/useCardAPI'
import useIsMobileView from '@/src/hooks/useIsMobileView'
import useCardStore from '@/src/stores/useCardStore'
import { useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useRef, useState } from 'react'
import toast from 'react-hot-toast'

const CardDatesPopover = ({ children, card, boardId, ...props }) => {
    const closeButton = useRef(null);

    const { updateCard } = useCardAPI();
    const queryClient = useQueryClient();
    const { updateCard: updateCardLocal } = useCardStore();

    const isMobileView = useIsMobileView();
    const [isOpen, setIsOpen] = useState(false);

    const onSubmit = async (startDate, dueDate) => {
        try {
            const data = {
                startDate, dueDate,
                cardId: card._id,
                listId: card.list_id,
                boardId
            };

            const { success } = await updateCard(data);

            if (!success) {
                toast.error("Failed to update card dates");
                return;
            }

            // update card on the client
            queryClient.invalidateQueries(['card', card._id]);
            updateCardLocal(card._id, card.list_id, { startDate, dueDate });
            toast.success("Card dates updates", { duration: 1750 });

            closeButton.current?.click();
        } catch (error) {
            console.log(error);
            toast.error("Error updating card dates");
        }
    }

    const formContent = (
        <CalendarForm initialStartDate={card.startDate} initialDueDate={card.dueDate} onSubmit={onSubmit} />
    );

    if (isMobileView) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className='p-4 sm:max-w-[57vw] w-[85vw]'>
                    <DialogTitle className='text-center text-sm font-semibold text-muted-foreground'>Dates</DialogTitle>
                    <DialogClose className='absolute right-2 top-2 p-2'>
                        <X className='h-4 w-4' />
                    </DialogClose>
                    {formContent}
                </DialogContent>
                <div onClick={() => setIsOpen(true)}>{children}</div>
            </Dialog>
        );
    }

    return (
        <Popover>
            <PopoverTrigger className='w-full'>
                {children}
            </PopoverTrigger>

            <PopoverContent
                side='left'
                align='center'
                className='min-w-[325px] poppins-regular'
                {...props}
            >
                <div className='w-full p-1 flex items-center mb-3 relative'>
                    <span className='w-full text-sm text-center font-semibold text-foreground'>Dates</span>
                    <PopoverClose asChild>
                        <button ref={closeButton} className='absolute top-1 right-1 p-1'>
                            <X className='w-4 h-4' />
                        </button>
                    </PopoverClose>
                </div>
                {formContent}
            </PopoverContent>
        </Popover>
    )
}

export default CardDatesPopover
