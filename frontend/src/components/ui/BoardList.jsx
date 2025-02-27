import { StarIcon, User2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import useBoardStore from '@/src/stores/useBoardStore'
import { getBoards } from '@/src/lib/api/board'
import { getStarredBoards } from '@/src/lib/api/user'
import BoardListSkeleton from '../skeletons/BoardListSkeleton'
import useAuthStore from '@/src/stores/useAuthStore'
import BoardListGrid from '../boards/BoardListGrid'
import useUserStore from '@/src/stores/useUserStore'

const BoardList = () => {
  const { boards, setBoards } = useBoardStore();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { starredBoards, setStarredBoards } = useUserStore();

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

  useEffect(() => {
    const fetchStarredBoards = async () => {
      const { success, data } = await getStarredBoards();

      if (success) {
        setStarredBoards(data);
      }
    }

    fetchStarredBoards();
  }, [boards]);

  useEffect(() => {
    boards.forEach(board => {
      if (starredBoards.includes(board._id)) {
        board.isStarred = true;
      } else {
        board.isStarred = false;
      }
    });
  }, [starredBoards]);

  if (loading) {
    return <BoardListSkeleton />
  }


  return (
    <div className='space-y-4'>

      {/* Starred boards */}
      {starredBoards.length > 0 &&
        <>
          <div className='flex items-center font-semibold text-lg'>
            <StarIcon className='h-6 w-6 mr-2' />
            Starred Boards
          </div>

          <BoardListGrid
            boards={boards.filter(board => starredBoards.includes(board._id))}
            showCreateBoardForm={false}
          />
        </>
      }

      {/* All boards */}
      <div className='flex items-center font-semibold text-lg'>
        <User2 className='h-6 w-6 mr-2' />
        Your Boards
      </div>

      <BoardListGrid boards={boards} />
    </div>
  )
}

export default BoardList
