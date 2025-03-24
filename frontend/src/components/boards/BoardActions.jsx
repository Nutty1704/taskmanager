import React from 'react'
import DeleteBoardConfirmationModal from '../form/delete-board-confirmation-modal'
import { Button } from '@/components/ui/button'
import CreateCheckpoint from './actions/CreateCheckpoint'

const BoardActions = ({ id, title }) => {
  return (
    <>
      <CreateCheckpoint boardId={id} className='rounded-none w-full h-auto p-2 px-5 justify-start poppins-regular text-sm' />

      <DeleteBoardConfirmationModal id={id} title={title}>
        <Button
          variant='ghost'
          className='rounded-none w-full h-auto p-2 px-5 justify-start poppins-regular text-base text-destructive'
        >
          Delete this board
        </Button>
      </DeleteBoardConfirmationModal>
    </>
  )
}

export default BoardActions
