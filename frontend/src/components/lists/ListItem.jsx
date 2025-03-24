import React, { useRef, useState, useEffect } from 'react'
import ListHeader from './ListHeader'
import CardForm from '../cards/CardForm';
import CardItem from '../cards/CardItem';
import { Draggable, Droppable } from '@hello-pangea/dnd';

const ListItem = ({ data, index }) => {
  const textAreaRef = useRef(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const disableEditing = () => {
    setIsEditing(false);
  }

  const enableEditing = () => {
    setIsEditing(true);
    setTimeout(() => {
      textAreaRef.current?.focus();
    });
  }

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  }

  // Keep track of previous cards count to detect drops
  const previousCardsLength = useRef(data.cards.length);
  useEffect(() => {
    if (data.cards.length > previousCardsLength.current) {
      // A card was added, unset collapse
      setIsCollapsed(false);
    }
    previousCardsLength.current = data.cards.length;
  }, [data.cards.length]);

  return (
    <Draggable draggableId={data._id} index={index}>
      {(provided) => (
        <li
          {...provided.draggableProps}
          ref={provided.innerRef}
          className={`shrink-0 h-full select-none transition-all duration-300 ${!isCollapsed
            ? 'w-[272px]'
            : isDraggingOver
              ? 'w-[272px]'
              : 'w-8 hover:w-12 hover:brightness-125'
            }`}
        >
          <div
            {...provided.dragHandleProps}
            className='w-full bg-secondary rounded-md shadow-md pb-2'
          >
            <ListHeader
              onAddCard={enableEditing}
              data={data}
              isCollapsed={isCollapsed && !isDraggingOver}
              toggleCollapse={toggleCollapse}
            />
            <Droppable droppableId={data._id} type='card'>
              {(provided, snapshot) => {
                // Update dragging state
                if (snapshot.isDraggingOver !== isDraggingOver) {
                  setIsDraggingOver(snapshot.isDraggingOver);
                }

                return (
                  <>
                    <ol
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`mx-1 px-1 py-0.5 flex flex-col gap-y-2 transition-all duration-300 ${data.cards.length > 0 ? "mt-2" : ""
                        } ${isCollapsed && !isDraggingOver
                          ? "h-0 overflow-hidden"
                          : data.cards.length > 0 ? "min-h-[2rem]" : ""
                        }`}
                    >
                      {data.cards.map((card, index) => (
                        <CardItem
                          key={card._id}
                          index={index}
                          data={card}
                          className={`transition-opacity duration-300 ${(isCollapsed && !isDraggingOver) ? "opacity-0" : "opacity-100"
                            }`}
                        />
                      ))}
                      {provided.placeholder}
                    </ol>

                    <div className={`flex justify-center transition-all duration-300 ${isCollapsed && !isDraggingOver
                      ? "opacity-100 mt-2"
                      : "opacity-0 hidden"
                      }`}>
                      <span className="text-sm font-medium text-muted-foreground">
                        {data.cards.length}
                      </span>
                    </div>
                  </>
                );
              }}
            </Droppable>
            {(!isCollapsed || isDraggingOver) && (
              <CardForm
                listId={data._id}
                ref={textAreaRef}
                isEditing={isEditing}
                enableEditing={enableEditing}
                disableEditing={disableEditing}
              />
            )}
          </div>
        </li>
      )}
    </Draggable>
  );
}

ListItem.Static = ({ data }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleCollapse = () => {
    setIsCollapsed(prev => !prev);
  };

  return (
    <li
      className={`shrink-0 h-full select-none transition-all duration-300 ${!isCollapsed
        ? 'w-[272px]'
        : 'w-8 hover:w-12 hover:brightness-125'
        }`}
    >
      <div
        className='w-full bg-secondary rounded-md shadow-md pb-2'
      >
        <ListHeader.Static
          data={data}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <ol
          className={`mx-1 px-1 py-0.5 flex flex-col gap-y-2 transition-all duration-300 cursor-pointer ${data.cards.length > 0 && "mt-2"} 
            ${isCollapsed
              ? "h-0 overflow-hidden"
              : data.cards.length > 0 && "min-h-[2rem]"
            }`}
        >
          {data.cards.map((card, index) => (
              <CardItem.Static
                key={card._id}
                index={index}
                data={card}
                className={`transition-opacity duration-300 ${(isCollapsed) ? "opacity-0" : "opacity-100"}`}
              />
          ))}
        </ol>

        <div className={`flex justify-center transition-all duration-300 ${isCollapsed
          ? "opacity-100 mt-2"
          : "opacity-0 hidden"
          }`}>
          <span className="text-sm font-medium text-muted-foreground">
            {data.cards.length}
          </span>
        </div>
      </div>
    </li>
  )

  return (
    <li className={`shrink-0 h-full select-none transition-all duration-300 ${!isCollapsed ? 'w-[272px]' : 'w-8 hover:w-12 hover:brightness-125'
      }`}>
      <div className="w-full bg-secondary rounded-md shadow-md pb-2">
        <ListHeader.Static
          data={data}
          isCollapsed={isCollapsed}
          toggleCollapse={toggleCollapse}
        />
        <div className={`flex flex-col gap-y-2 transition-all duration-300 ${isCollapsed ? 'h-0 overflow-hidden' : 'min-h-[2rem]'
          }`}>
          {data.cards.map((card, index) => (
            <CardItem.Static
              key={card._id}
              index={index}
              data={card}
              className="opacity-100"
            />
          ))}
        </div>
        <div className={`flex justify-center transition-all duration-300 ${isCollapsed ? 'opacity-100 mt-2' : 'opacity-0 hidden'
          }`}>
          <span className="text-sm font-medium text-muted-foreground">
            {data.cards.length}
          </span>
        </div>
      </div>
    </li>
  );
};

export default ListItem