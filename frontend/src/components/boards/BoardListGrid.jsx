import React from 'react'
import BoardListItem from './BoardListItem'
import BoardFormPopover from '../form/create-board-form-popover'

const BoardListGrid = ({ boards, showCreateBoardForm = true }) => {
    if (!boards || (boards.length === 0 && !showCreateBoardForm)) {
        return (
            <div className='text-xs text-muted-foreground poppins-light pl-4'>
                No boards to display
            </div>
        )
    }

    return (
        <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
            {boards.map((board) => (
                <BoardListItem board={board} key={board._id} />
            ))}

            {showCreateBoardForm && <BoardFormPopover side='right' sideOffset={10}>
                <div
                    role='button'
                    className='aspect-video relative h-full w-full bg-accent/50 rounded-sm flex flex-col gap-y-1 items-center justify-center transition group'
                >
                    <p className='poppins-regular text-sm opacity-75 group-hover:opacity-100'>Create new board</p>
                </div>
            </BoardFormPopover>}
        </div>
    )
}

export default BoardListGrid
