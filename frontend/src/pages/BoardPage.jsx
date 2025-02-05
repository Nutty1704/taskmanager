import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import useAuthStore from '../stores/useAuthStore';
import { fetchLists } from '../lib/api/list';
import ListContainer from '../components/lists/ListContainer';
import useListStore from '../stores/useListStore';
import { getBoardLabels } from '../lib/api/board';
import useLabelStore from '../stores/useLabelStore';

const BoardPage = () => {
        const { token } = useAuthStore();
        const { boardId } = useParams();
        const { setLists } = useListStore();
        const { setLabels } = useLabelStore();

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
