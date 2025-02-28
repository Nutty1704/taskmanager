import { User2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useBoardStore from '@/src/stores/useBoardStore';
import { getBoards } from '@/src/lib/api/board';
import { getRecentBoards, getStarredBoards } from '@/src/lib/api/user';
import BoardListSkeleton from '../skeletons/BoardListSkeleton';
import useAuthStore from '@/src/stores/useAuthStore';
import BoardListGrid from '../boards/BoardListGrid';
import useUserStore from '@/src/stores/useUserStore';
import StarredBoards from '../boards/StarredBoards';
import RecentBoards from '../boards/RecentBoards';

const BoardList = () => {
  const { boards, setBoards } = useBoardStore();
  const { token } = useAuthStore();
  const [loading, setLoading] = useState(true);
  const { starredBoards, setStarredBoards } = useUserStore();
  const [recentBoards, setRecentBoards] = useState([]);

  useEffect(() => {
    const fetchBoards = async () => {
      setLoading(true);
      const { success, boards } = await getBoards();
      if (success) setBoards(boards);
      setLoading(false);
    };

    fetchBoards();
  }, [token]);

  useEffect(() => {
    const fetchStarredBoards = async () => {
      const { success, data } = await getStarredBoards();
      if (success) setStarredBoards(data);
    };

    const fetchRecentBoards = async () => {
      const { success, data } = await getRecentBoards();
      if (success) setRecentBoards(data);
    };

    fetchStarredBoards();
    fetchRecentBoards();
  }, [boards]);

  useEffect(() => {
    boards.forEach(board => {
      board.isStarred = starredBoards.includes(board._id);
    });
  }, [starredBoards]);

  if (loading) return <BoardListSkeleton />;

  return (
    <div className='space-y-4'>
      <StarredBoards boards={boards} starredBoards={starredBoards} />
      <RecentBoards boards={boards} recentBoards={recentBoards} />

      {/* All Boards */}
      <div className='space-y-4'>
        <div className='flex items-center font-semibold text-lg'>
          <User2 className='h-6 w-6 mr-2' />
          Your Boards
        </div>
        <BoardListGrid boards={boards} />
      </div>
    </div>
  );
};

export default BoardList;
