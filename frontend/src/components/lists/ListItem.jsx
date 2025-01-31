import React, { useRef, useState } from 'react'
import ListHeader from './ListHeader'
import CardForm from '../cards/CardForm';
import CardItem from '../cards/CardItem';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const ListItem = ({ data, index }) => {
  const textAreaRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  }

  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps} ref={provided.innerRef}
          className='shrink-0 h-full w-[272px] select-none'
        >
          <div
            {...provided.dragHandleProps}
            className='w-full bg-secondary rounded-md shadow-md pb-2'
          >
            <ListHeader onAddCard={enableEditing} data={data} />
            <Droppable droppableId={data._id} type='card'>
              {(provided) => (
                <ol
                  ref={provided.innerRef} {...provided.droppableProps}
                  className={`mx-1 px-1 py-0.5 flex flex-col gap-y-2 ${data.cards.length > 0 && "mt-2"}`}
                >
                  {data.cards.map((card, index) => (
                    <CardItem
                      key={card._id}
                      index={index}
                      data={card}
                    />
                  ))}
                  {provided.placeholder}
                </ol>
              )}
            </Droppable>
            <CardForm
              listId={data._id}
              ref={textAreaRef}
              isEditing={isEditing}
              enableEditing={enableEditing}
              disableEditing={disableEditing}
            />
          </div>
        </li>
      )}
    </Draggable>
  )
}

export default ListItem
