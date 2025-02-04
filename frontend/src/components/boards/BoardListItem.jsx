import { updateBoard } from '@/src/lib/api/board'
import useBoardStore from '@/src/stores/useBoardStore'
import { Star } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const BoardListItem = ({ board }) => {

    const { updateBoard: updateBoardLocal } = useBoardStore();

    const toggleStar = async (e) => {
        try {
            e.preventDefault();

            const prevState = board.isStarred;
            board.isStarred = !prevState;
            updateBoardLocal(board);
            const { success } = await updateBoard({ id: board._id, isStarred: board.isStarred });

            if (!success) {
                board.isStarred = prevState;
                toast.error('Failed to star board');
                updateBoardLocal(board);
            }
        } catch (error) {
            console.error('Error updating board: ', error.response?.data || error.message);
        }
    }

    return (
        <Link
            to={`/board/${board._id}`}
            style={{ backgroundImage: `url(${board.imageThumbUrl})` }}
            className='group relative aspect-video bg-no-repeat bg-center bg-cover bg-accent/50 rounded-sm h-full w-full p-2 overflow-hidden'
        >
            <div className='absolute inset-0 bg-black/30 group-hover:bg-black/40 transition' />
            <p className='relative font-semibold text-white'>
                {board.title}
            </p>

            <div className="absolute top-3 right-3 overflow-hidden">
                <div className="hidden group-hover:block animate-from-right">
                    <Star
                        onClick={toggleStar}
                        fill={board.isStarred ? '#FFD700' : 'none'}
                        strokeWidth="0.15rem"
                        className={`h-4 w-4 hover:text-[#FFD700] hover:scale-110 transition ${board.isStarred ? 'text-[#FFD700]' : 'text-white/50'}`}
                    />
                </div>
            </div>

        </Link>
    )
}

export default BoardListItem
