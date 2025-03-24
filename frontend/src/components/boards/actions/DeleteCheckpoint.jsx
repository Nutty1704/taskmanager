import useBoardAPI from '@/src/hooks/api/useBoardAPI'
import React from 'react'
import toast from 'react-hot-toast';

const DeleteCheckpoint = ({ id, className = '', children }) => {
    const { deleteCheckpoint } = useBoardAPI();

    const onDelete = async () => {
        try {
            const { success } = await deleteCheckpoint(id);

            if (success) {
                // Local removal handled by socket listener
                toast.success('Checkpoint deleted successfully');
            }
        } catch (error) {
            toast.error('Failed to delete checkpoint');
        }
    }

  return (
    <div className={className} onClick={onDelete}>
      { children }
    </div>
  )
}

export default DeleteCheckpoint
