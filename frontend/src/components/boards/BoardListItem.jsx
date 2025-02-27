import { starBoard, unstarBoard } from '@/src/lib/api/user'
import useBoardStore from '@/src/stores/useBoardStore'
import { Star } from 'lucide-react'
import React from 'react'
import toast from 'react-hot-toast'
import { Link } from 'react-router-dom'

const BoardListItem = ({ board }) => {

    const { updateBoard } = useBoardStore();

    const toggleStar = async (e) => {
        try {
            e.preventDefault();

            if (!board.isStarred) {
                const { success } = await starBoard(board._id);

                if (success) {
                    updateBoard(board._id, { isStarred: true });
                    board.isStarred = true;
                }
            } else {
                const { success } = await unstarBoard(board._id);

                if (success) {
                    updateBoard(board._id, { isStarred: false });
                    board.isStarred = false;
                }
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
