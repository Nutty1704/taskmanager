import React from 'react'
import ListForm from './ListForm'
import useListStore from '@/src/stores/useListStore'
import ListItem from './ListItem';

const ListContainer = ({
    boardId,
}) => {
    const { lists } = useListStore();

  return (
    <ol className='poppins-regular flex gap-x-3 h-full'>
        {lists.map((list, index) => (
            <ListItem
                key={list._id}
                index={index}
                data={list}
            />
        ))}

        <ListForm />
        {/* Create padding at the horizontal edges */}
        <div className='flex-shrink-0 w-1' />
    </ol>
  )
}

export default ListContainer
