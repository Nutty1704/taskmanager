import React from 'react'
import ListForm from './ListForm'
import useListStore from '@/src/stores/useListStore'
import ListItem from './ListItem';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { updateListPositions } from '@/src/lib/api/list';
import { moveCard, extractMoveData } from '@/src/lib/api/card';
import toast from 'react-hot-toast';

const ListContainer = ({
    boardId,
}) => {
    const { lists, setLists } = useListStore();

    const reorder = (list, startIndex, endIndex) => {
        const result = Array.from(list);
        const [removed] = result.splice(startIndex, 1);
        result.splice(endIndex, 0, removed);

        return result;
    }


    const onDragEnd = async (result) => {
        const { destination, source, type } = result;

        if (!destination) return;

        // Dropped in the same position
        if (destination.droppableId === source.droppableId && destination.index === source.index) return;

        const prevState = [...lists];

        // Reorder lists
        if (type === 'list') {
            const items = reorder(lists, source.index, destination.index)
                            .map((item, index) => ({
                                ...item,
                                position: index
                            }));
            
            setLists(items);
            // TODO: update the position of the lists in the backend
            const { success } = await updateListPositions(boardId, items);
            if (!success) {
                toast.error('Failed to update list positions');
                setLists(prevState);
            }
            return;
        }


        // Move card within the same list
        if (type === 'card') {
            const sourceList = lists.find(list => list._id === source.droppableId);
            const destinationList = lists.find(list => list._id === destination.droppableId);

            if (!sourceList || !destinationList) return;

            if (source.droppableId === destination.droppableId) {
                const movedCard = sourceList.cards[source.index];
                const reorderedCards = reorder(sourceList.cards, source.index, destination.index);

                reorderedCards.forEach((card, index) => {card.position = index});
                sourceList.cards = reorderedCards;  

                // TODO: server action
                const srcList = extractMoveData(sourceList);

                const { success } = await moveCard(boardId, movedCard._id, { srcList });
                if (!success) {
                    toast.error('Failed to update card positions');
                    setLists(prevState);
                }

            } else { // Move card to a different list
                const [movedCard] = sourceList.cards.splice(source.index, 1);

                // Move the card
                movedCard.list_id = destination.droppableId;

                destinationList.cards.splice(destination.index, 0, movedCard);

                sourceList.cards.forEach((card, index) => {card.position = index});
                destinationList.cards.forEach((card, index) => {card.position = index});

                // TODO: server action
                const srcList = extractMoveData(sourceList);
                const destList = extractMoveData(destinationList);

                const { success } = await moveCard(boardId, movedCard._id, { srcList, destList });
                if (!success) {
                    toast.error('Failed to move card');
                    setLists(prevState);
                }
            }
        }
    }

    return (
        <DragDropContext
            onDragEnd={onDragEnd}
        >
            <Droppable droppableId='lists' type='list' direction='horizontal'>
                {(provided) => (
                    <ol 
                        {...provided.droppableProps}
                        ref={provided.innerRef}
                        className='poppins-regular flex gap-x-3 h-full'
                    >
                        {lists.map((list, index) => (
                            <ListItem
                                key={list._id}
                                index={index}
                                data={list}
                            />
                        ))}

                        {provided.placeholder}
                        <ListForm />
                        {/* Create padding at the horizontal edges */}
                        <div className='flex-shrink-0 w-1' />
                    </ol>
                )}
            </Droppable>
        </DragDropContext>
    )
}

export default ListContainer
