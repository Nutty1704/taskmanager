import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore';
import { fetchLists } from '../lib/api/list';
import ListContainer from '../components/lists/ListContainer';
import useListStore from '../stores/useListStore';

const BoardPage = () => {
        const { token } = useAuthStore();
        const { boardId } = useParams();
        const { setLists } = useListStore();

        useEffect(() => {
            const fetchAllLists = async () => {
                const { success, lists } = await fetchLists(boardId);
                if (success) {
                    setLists(lists);
                }
            }

            fetchAllLists();
        }, [token, boardId]);

    return (
        <div className='h-full overflow-x-auto p-4'>
            <ListContainer
                boardId={boardId}
            />
        </div>
    )
}

export default BoardPage
