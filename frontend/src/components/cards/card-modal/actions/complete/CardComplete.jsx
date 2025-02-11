import { Checkbox } from '@/components/ui/checkbox'
import { updateCard } from '@/src/lib/api/card';
import useCardStore from '@/src/stores/useCardStore';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import ToolTip from '@/src/components/ui/ToolTip';

const CardComplete = ({ data, boardId }) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const queryClient = useQueryClient();
    const { updateCard: updateCardLocal } = useCardStore();
    const [ tooltipText, setTooltipText ] = useState('');

    useEffect(() => {
        if (data.isComplete) setTooltipText('Mark Incomplete');
        else setTooltipText('Mark Complete');
    }, [ data.isComplete ]);

    const onCheckedChange = async (checked) => {
        try {
            setIsSubmitting(true);
            const reqData = {
                boardId,
                cardId: data._id,
                listId: data.list_id,
                isComplete: checked,
            }
            const { success } = await updateCard(reqData);

            if (success) {
                queryClient.invalidateQueries(['card', data._id]);
                updateCardLocal(data._id, data.list_id, { isComplete: checked })
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsSubmitting(false);
        }
    }

  return (
    <ToolTip text={tooltipText}>
        <Checkbox
            checked={data.isComplete}
            onCheckedChange={onCheckedChange}
            className='w-4 h-4 rounded-full border-success data-[state=checked]:bg-success disabled:cursor-pointer'
            checkClass='text-background h-3 w-3'
            strokeWidth={3}
            disabled={isSubmitting}
        />
    </ToolTip>
  )
}
export default CardComplete
