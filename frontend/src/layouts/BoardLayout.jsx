import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom';
import { getBoard } from '../lib/api/board';
import useAuthStore from '../stores/useAuthStore';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import BoardNavbar from '../components/ui/BoardNavbar';
import CardModalProvider from '../components/cards/card-modal/CardModalProvider';
import { QueryProvider } from '../lib/query-provider';

const BoardLayout = ({ children }) => {
    const { boardId } = useParams();
    const { token } = useAuthStore();
    const [board, setBoard] = useState(null);

    useEffect(() => {
        const fetchBoard = async () => {
            const { success, board } = await getBoard(boardId, token);
            if (success) {
                setBoard(board);
            }
        };

        fetchBoard();
    }, [boardId, token]);

    if (!board) {
        return null;
    }

    return (
        <>
            <QueryProvider>
                <DashboardNavbar className='' />
                <BoardNavbar board={board} setBoard={setBoard} />
                <CardModalProvider />
                <div className='absolute inset-0 bg-black/10' />
                <div
                    className='min-h-screen bg-no-repeat bg-cover bg-center -z-10'
                    style={{ backgroundImage: `url(${board?.imageFullUrl})` }}
                >
                    <main className='pt-28 relative h-full'>
                        {children}
                    </main>
                </div>
            </QueryProvider>
        </>
    )
}

export default BoardLayout
