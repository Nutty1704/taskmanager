import React, { useEffect, useRef, useState } from 'react'
import colors from '@/src/config/labelColors.json'
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Pen } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import { modifyCardLabels } from '@/src/lib/api/card';
import { useParams } from 'react-router-dom';
import useCardStore from '@/src/stores/useCardStore';

const CardLabelItem = ({ label, defaultChecked, card, onShowForm }) => {
    const checkboxRef = useRef(null);
    const [ isChecked, setIsChecked ] = useState(defaultChecked);
    const { boardId } = useParams();
    const queryClient = useQueryClient();
    const { updateCard } = useCardStore();

    const onCheckedChange = async (checked) => {
        try {
            const { success } = await modifyCardLabels(boardId, card._id, card.list_id, label._id, checked);

            if (success) {
                await queryClient.invalidateQueries(['card', boardId, card.list_id, card._id]);
                updateCard(card._id, card.list_id, {
                    labels: checked ? [...card.labels, label]
                            : card.labels.filter(l => l._id !== label._id)
                        });
            }
        } catch (error) {
            console.error('Error updating card label', error);
        }
    }

    return (
        <div className='flex items-center gap-2'>
            <Checkbox
                ref={checkboxRef}
                checked={isChecked}
                onCheckedChange={onCheckedChange}
                onClick={() => setIsChecked(!isChecked)}
                className='w-5 h-5'
            />

            <div
                onClick={() => checkboxRef.current.click()}
                className='flex-1 h-7 rounded-md cursor-pointer group relative'
                style={{ backgroundColor: colors[label.color].hex }}
            >
                <div className='bg-black/25 rounded-md w-full hidden group-hover:block absolute top-0 left-0 h-full z-0' />
                <span className='text-xs pl-2 poppins-medium text-primary-foreground w-full overflow-hidden z-10 relative'>{label.title}</span>
            </div>

            <Button
                variant='ghost'
                className='px-1 py-0'
                onClick={() => onShowForm(label, true)}
            >
                <Pen className='w-4 h-4' />
            </Button>
        </div>
    )
}

export default CardLabelItem
