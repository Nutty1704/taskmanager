import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom';
import DashboardNavbar from '../components/ui/DashboardNavbar';
import BoardNavbar from '../components/ui/BoardNavbar';
import CardModalProvider from '../components/cards/card-modal/CardModalProvider';
import { QueryProvider } from '../lib/query-provider';
import useBoardAPI from '../hooks/api/useBoardAPI';
import useBoardStore from '../stores/useBoardStore';

const BoardLayout = ({ children }) => {
    const { boardId } = useParams();
    const { activeBoard: board, setActive } = useBoardStore();
    
    const { getBoard } = useBoardAPI();

    useEffect(() => {
        const fetchBoard = async () => {
            const { success, board } = await getBoard(boardId);
            if (success) {
                setActive(board);
            }
        };

        fetchBoard();
        return () => setActive(null);
    }, [boardId]);

    if (!board) {
        return null;
    }

    return (
        <>
            <QueryProvider>
                <DashboardNavbar className='' />
                <BoardNavbar board={board} setBoard={setActive} />
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
