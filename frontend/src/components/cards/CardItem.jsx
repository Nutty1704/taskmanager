import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useCardModal } from '@/src/hooks/useCardModal'
import CardBadges from './CardBadges';

const CardItem = ({ data, index }) => {
    const cardModal = useCardModal();

    return (
        <Draggable draggableId={data._id} index={index}>
            {(provided) => (
                    <div
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        role='button'
                        onClick={() => cardModal.onOpen(data._id, data.list_id)}
                        className='truncate border-2 border-transparent hover:border-foreground py-2 px-3 text-sm bg-white rounded-md shadow-sm flex flex-col gap-2'
                    >
                        {data.title}
                        <CardBadges data={data} />
                    </div>
            )}
        </Draggable>
    )
}

export default CardItem
