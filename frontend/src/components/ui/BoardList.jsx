import { User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import BoardFormPopover from '../form/create-board-form-popover'
import useBoardStore from '@/src/stores/useBoardStore'
import { getBoards } from '@/src/lib/api/board'
import { Link, useParams } from 'react-router-dom'
import useAuthStore from '@/src/stores/useAuthStore'
import BoardListSkeleton from '../skeletons/BoardListSkeleton'

const BoardList = () => {
  const { boards, setBoards } = useBoardStore();
  const { token } = useAuthStore();
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      const { success, boards } = await getBoards();
      if (success) {
        setBoards(boards);
      }
      setLoading(false);
    };

    fetchBoards();
  }, [token]);

  if (loading) {
    return <BoardListSkeleton />
  }


  return (
    <div className='space-y-4'>
      <div className='flex items-center font-semibold text-lg'>
        <User2 className='h-6 w-6 mr-2' />
        Your Boards
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
        {boards.map((board) => (
          <Link
            to={`/board/${board._id}`}
            key={board._id}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}  
            className='group relative aspect-video bg-no-repeat bg-center bg-cover bg-accent/50 rounded-sm h-full w-full p-2 overflow-hidden'
          >
            <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition' />
            <p className='relative font-semibold text-white'>
              {board.title}
            </p>
          </Link>
        ))}

        <BoardFormPopover side='right' sideOffset={10}>
          <div
            role='button'
            className='aspect-video relative h-full w-full bg-accent/50 rounded-sm flex flex-col gap-y-1 items-center justify-center transition group'
          >
            <p className='poppins-regular text-sm opacity-75 group-hover:opacity-100'>Create new board</p>
          </div>
        </BoardFormPopover>
      </div>
    </div>
  )
}

export default BoardList
