import React from 'react'
import { Draggable } from '@hello-pangea/dnd'
import { useCardModal } from '@/src/hooks/useCardModal'
import CardBadges from './card-badges/CardBadges';
import CardUHLabelListItem from './card-modal/under-header/labels/CardUHLabelItem';

const CardItem = ({ data, index }) => {
    const cardModal = useCardModal();

    return (
        <Draggable draggableId={data._id} index={index}>
            {(provided) => (
                    <div
                        ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}
                        role='button'
                        onClick={() => cardModal.onOpen(data._id, data.list_id)}
                        className='truncate border-2 border-transparent hover:border-foreground py-2 px-3 text-sm bg-background rounded-md shadow-sm flex flex-col gap-2'
                    >
                        {data.labels?.length > 0 && (
                            <div
                                className='flex flex-wrap gap-1'
                                onClick={(e) => {e.preventDefault(); e.stopPropagation();}}
                            >
                                {data.labels.map((label) => (
                                    <CardUHLabelListItem
                                        key={label._id}
                                        label={label}
                                        small={true}
                                    />
                                ))}
                            </div>
                        )}
                        <span className='poppins-medium'>{data.title}</span>
                        <CardBadges data={data} />
                    </div>
            )}
        </Draggable>
    )
}

export default CardItem
