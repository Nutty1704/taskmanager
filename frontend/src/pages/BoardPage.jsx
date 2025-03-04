import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import ListContainer from '../components/lists/ListContainer';
import useListStore from '../stores/useListStore';
import useLabelStore from '../stores/useLabelStore';
import { Helmet } from 'react-helmet';
import useBoardStore from '../stores/useBoardStore';
import useBoardAPI from '../hooks/api/useBoardAPI';
import useListAPI from '../hooks/api/useListAPI';
import useSocketListeners from '../hooks/useSocketListeners';

const BoardPage = () => {
    const { boardId } = useParams();

    const { fetchLists } = useListAPI();
    const { getBoardLabels } = useBoardAPI();
    const { setLists } = useListStore();
    const { setLabels } = useLabelStore();
    const { boards } = useBoardStore();
    const boardName = boards.find(board => board._id === boardId)?.title || 'Board';

    // Setup socket listeners
    useSocketListeners(boardId);

    useEffect(() => {
        const fetchAllLists = async () => {
            const { success, lists } = await fetchLists(boardId);
            if (success) {
                setLists(lists);
            }
        }

        const fetchAllLabels = async () => {
            const { success, labels } = await getBoardLabels(boardId);
            if (success) {
                setLabels(labels);
            }
        }

        fetchAllLabels();
        fetchAllLists();
    }, [boardId]);

    return (
        <>
            <Helmet>
                <title>{`${boardName} | Donezo`}</title>
            </Helmet>
            <div className='h-full overflow-x-auto p-4'>
                <ListContainer
                    boardId={boardId}
                />
            </div>
        </>
    )
}

export default BoardPage
