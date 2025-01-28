import { Button } from '@/components/ui/button'
import React, { useRef, useState } from 'react'
import FormInput from './form-input';
import { updateBoard } from '@/src/lib/api/board';
import toast from 'react-hot-toast';

const BoardTitleForm = ({ board, setBoard }) => {
    const formRef = useRef(null);
    const inputRef = useRef(null);
    const [isEditing, setIsEditing] = useState(false);

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            inputRef.current?.focus();
            inputRef.current?.select();
        })
    }

    const disableEditing = () => {
        setIsEditing(false);
    }
    
    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    const onSubmit = async (e) => {
        e.preventDefault();

        const title = inputRef.current.value.trim();

        const { success, updatedBoard } = await updateBoard({ id: board._id, title });

        if (!success) {
            toast.error('Error updating board title');
            inputRef.current.value = board.title;
            return;
        }

        setBoard(updatedBoard);
        toast.success(`Board ${updatedBoard.title} updated successfully`);
        disableEditing();
    }

    if (isEditing) {
        return (
            <form
                ref={formRef}
                className='flex items-center gap-x-2'
                onBlur={onBlur} 
                onSubmit={onSubmit}>
                    <FormInput
                        ref={inputRef}
                        id='title'
                        defaultValue={board.title}
                        className='text-lg poppins-bold px-2 py-1 h-7 bg-transparent focus-visible:outline-none focus-visible:ring-transparent border-none'
                    />
            </form>
        )
    }

  return (
    <Button
        onClick={enableEditing}
        className='poppins-bold text-lg h-auto p-1 px-2'
        variant='transparent'
    >
      {board.title}
    </Button>
  )
}

export default BoardTitleForm
