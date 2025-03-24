import { Button } from '@/components/ui/button';
import React from 'react'
import useBoardAPI from '@/src/hooks/api/useBoardAPI';
import toast from 'react-hot-toast';

const CreateCheckpoint = ({ boardId, variant = "ghost", size = "xs", className, ...props }) => {
  const { createCheckpoint } = useBoardAPI();

    const onClick = async () => {
      try {
        const { success } = await createCheckpoint(boardId);

        if (success) {
          // Local addition handled by socket listener
          toast.success('Checkpoint created successfully');
        }

      } catch (error) {
        console.error(error);
        toast.error('Failed to create checkpoint');
      }
    }

  return (
    <Button
        variant={variant}
        size={size}
        className={className}
        {...props}
        onClick={onClick}
    >
        Create Checkpoint
    </Button>
  )
}

export default CreateCheckpoint
