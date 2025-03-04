import { User2 } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import useBoardStore from '@/src/stores/useBoardStore';
import BoardListSkeleton from '../skeletons/BoardListSkeleton';
import BoardListGrid from '../boards/BoardListGrid';
import useUserStore from '@/src/stores/useUserStore';
import StarredBoards from '../boards/StarredBoards';
import RecentBoards from '../boards/RecentBoards';
import useUserAPI from '@/src/hooks/api/useUserAPI';
import useBoardAPI from '@/src/hooks/api/useBoardAPI';
import { useAuth } from '@clerk/clerk-react';

const BoardList = () => {
  const { boards, setBoards } = useBoardStore();
  const [loading, setLoading] = useState(true);
  const { starredBoards, setStarredBoards } = useUserStore();
  const [recentBoards, setRecentBoards] = useState([]);

  const { isLoaded, isSignedIn, orgId } = useAuth();
  const { getBoards } = useBoardAPI();
  const { getStarredBoards, getRecentBoards } = useUserAPI();

  useEffect(() => {
    if (!isLoaded || !isSignedIn) return;

    const fetchBoards = async () => {
      setLoading(true);
      const { success, boards } = await getBoards();
      if (success) setBoards(boards);
      setLoading(false);
    };

    fetchBoards();
  }, [isLoaded, isSignedIn, orgId]);

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

  if (loading || !isLoaded || !isSignedIn) return <BoardListSkeleton />;

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
