import React from 'react'
import { Helmet } from 'react-helmet'
import ListContainer from '../components/lists/ListContainer'

const CheckpointPage = ({ data }) => {
    return (
        <>
            <Helmet>
                <title>{`Checkpoint | Donezo`}</title>
            </Helmet>
            <div className='h-full overflow-x-auto p-4'>
                <ListContainer.Static
                    lists={data?.snapshot.lists || []}
                />
            </div>
        </>
    )
}

export default CheckpointPage
