import { Checkbox } from '@/components/ui/checkbox'
import useCardStore from '@/src/stores/useCardStore';
import { useQueryClient } from '@tanstack/react-query';
import React, { useEffect, useState } from 'react'
import ToolTip from '@/src/components/ui/ToolTip';
import useCardAPI from '@/src/hooks/api/useCardAPI';

const CardComplete = ({ data, boardId }) => {
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ tooltipText, setTooltipText ] = useState('');
    
    const { updateCard } = useCardAPI();
    const queryClient = useQueryClient();
    const { updateCard: updateCardLocal } = useCardStore();

    useEffect(() => {
        if (data.isComplete) setTooltipText('Mark Incomplete');
        else setTooltipText('Mark Complete');
    }, [ data.isComplete ]);

    const onCheckedChange = async (checked) => {
        try {
            data.isComplete = checked;
            updateCardLocal(data._id, data.list_id, { isComplete: checked });

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
            } else {
                data.isComplete = !checked;
                updateCardLocal(data._id, data.list_id, { isComplete: !checked });
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
