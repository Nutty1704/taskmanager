import React, { useEffect, useState } from 'react'
import DashboardNavbar from '../components/ui/DashboardNavbar'
import BoardNavbar from '../components/boards/BoardNavbar'
import useBoardAPI from '../hooks/api/useBoardAPI';
import { useParams } from 'react-router-dom';
import CardModalCheckpointProvider from '../components/cards/checkpoint/CardModalCheckpointProvider';

const CheckpointLayout = ({ children }) => {
    const { checkpointId } = useParams();
    const [data, setData] = useState(null);
    const { getCheckpoint } = useBoardAPI();

    const childrenWithProps = React.Children.map(children, (child) => {
        return React.isValidElement(child)
            ? React.cloneElement(child, { data })
            : child;
    });

    useEffect(() => {
        if (!checkpointId) return;

        const fetchCheckpoint = async () => {
            const { success, checkpoint } = await getCheckpoint(checkpointId);

            if (success) {
                setData(checkpoint);
            }
        }

        fetchCheckpoint();
    }, [checkpointId]);

    useEffect(() => {
        if (!data) return;

        console.log(data);
    }, [data]);

    return (
        <>
            <DashboardNavbar className='' />
            <BoardNavbar.Static title={data?.snapshot.title} />
            <CardModalCheckpointProvider />
            <div className='absolute inset-0 bg-black/10' />
            <div
                className='min-h-screen bg-no-repeat bg-cover bg-center -z-10'
                style={{ backgroundImage: `url(${data?.snapshot.imageFullUrl})` }}
            >
                <main className='pt-28 relative h-full'>
                    {childrenWithProps}
                </main>
            </div>
        </>
    )
}

export default CheckpointLayout
