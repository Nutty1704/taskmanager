import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import React  from 'react'
import { useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import FormInput from '../form/form-input'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { getConfirmationSchema } from '@/src/lib/form-validators'
import FormSubmit from '../form/form-submit'
import useListAPI from '@/src/hooks/api/useListAPI'


const ListDeleteForm = ({
    children,
    title,
    id,
    ...props
}) => {
    const { boardId } = useParams();

    const { deleteList } = useListAPI();
    const { register, reset, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(getConfirmationSchema(title)),
        defaultValues: {
            confirmation: '',
        }
    });

    const onDelete = async (data) => {
        try {
            const { success } = await deleteList(boardId, id);

            if (!success) {
                toast.error('Error deleting List');
                return;
            }

            // Local removal handled by socket listener
            toast.success(`List "${title}" deleted`);

            if (props.onSuccess) {
                props.onSuccess();
            }

        } catch (error) {
            console.error('Error deleting list: ', error.response?.data || error.message);
            toast.error('Error deleting list');
        }
    };

  return (
    <Dialog>
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

export default ListDeleteForm;