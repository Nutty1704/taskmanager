import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import CalendarForm from '@/src/components/form/calendar-form'
import { updateCard } from '@/src/lib/api/card'
import useCardStore from '@/src/stores/useCardStore'
import { useQueryClient } from '@tanstack/react-query'
import { X } from 'lucide-react'
import React, { useRef } from 'react'
import toast from 'react-hot-toast'

const CardDatesPopover = ({ children, card, boardId, ...props }) => {
    const closeButton = useRef(null);
    const queryClient = useQueryClient();
    const { updateCard: updateCardLocal } = useCardStore();

    const onSubmit = async (startDate, dueDate) => {
        try {
            const data = {
                startDate, dueDate,
                cardId: card._id,
                listId: card.list_id,
                boardId
            };

            console.log(data);

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

                    <PopoverClose className='absolute top-1 right-1' ref={closeButton}>
                        <X className='w-4 h-4' />
                    </PopoverClose>
                </div>

                <CalendarForm
                    initialStartDate={card.startDate}
                    initialDueDate={card.dueDate}
                    onSubmit={onSubmit}
                />

            </PopoverContent>
        </Popover>
    )
}

export default CardDatesPopover
