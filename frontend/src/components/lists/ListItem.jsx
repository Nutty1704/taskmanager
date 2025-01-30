import React from 'react'
import ListHeader from './ListHeader'

const ListItem = ({ data, index }) => {
  return (
    <li
      className='shrink-0 h-full w-[272px] select-none'
    >
      <div
        className='w-full bg-secondary rounded-md shadow-md pb-2'
      >
        <ListHeader data={data} />
      </div>
    </li>
  )
}

export default ListItem
