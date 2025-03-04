import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormInput from './form-input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getConfirmationSchema } from '@/src/lib/form-validators'
import FormSubmit from './form-submit'
import useBoardAPI from '@/src/hooks/api/useBoardAPI'


const DeleteBoardConfirmationModal = ({
    children,
    title,
    id
}) => {
    const navigate = useNavigate();
    const { deleteBoard } = useBoardAPI();
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(getConfirmationSchema(title)),
        defaultValues: {
            confirmation: '',
        }
    });

    const onOpenChange = (open) => {
        if (!open) {
            reset();
        }
    }

    const onDelete = async (data) => {
        try {
            const { success } = await deleteBoard(id);

            if (!success) {
                toast.error('Error deleting board');
                return;
            }

            navigate('/');
            toast.success('Board deleted successfully');
        } catch (error) {
            console.error('Error deleting board: ', error.response?.data || error.message);
            toast.error('Error deleting board');
        }
    };

  return (
    <Dialog
      onOpenChange={open => onOpenChange(open)}
    >
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogTitle>Are you sure?</DialogTitle>
        <form onSubmit={handleSubmit(onDelete)}>
            <FormInput
                id='confirmation'
                name='confirmation'
                placeholder={`Type "${title}" to confirm`}
                errors={errors.confirmation}
                isSubmitting={isSubmitting}
                {...register('confirmation')}
            />
            <div className='flex justify-end mt-3'>
                <FormSubmit
                    isSubmitting={isSubmitting}
                    variant='destructive'
                >
                    Delete
                </FormSubmit>
            </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default DeleteBoardConfirmationModal
