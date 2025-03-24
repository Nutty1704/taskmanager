import React from 'react'
import BoardTitleForm from '../form/board-title-form'
import BoardOptions from './BoardOptions'
import CheckpointDropdown from './actions/CheckpointDropdown'

const BoardNavbar = ({ board, setBoard }) => {
  return (
    <div className='w-full poppins-regular h-14 z-[40] bg-black/50 fixed top-12 flex items-center px-6 gap-x-4 text-white'>
      <BoardTitleForm board={board} setBoard={setBoard} />
      <div className="ml-auto flex items-center gap-4">

        <CheckpointDropdown board={board} />

        <BoardOptions
          id={board._id}
          title={board.title}
        />
      </div>
    </div>
  )
}

BoardNavbar.Static = ({ title }) => {
  return (
    <div className='w-full poppins-regular h-14 z-[40] bg-black/50 fixed top-12 flex items-center px-6 gap-x-4 text-white'>
      <p className='text-lg'>{title}</p>
      <div className='ml-auto flex items-center text-warning text-base'>
        Checkpoints are view only
      </div>
    </div>
  )
}

export default BoardNavbar
