import { Button } from '@/components/ui/button';
import FormInput from '@/src/components/form/form-input';
import FormSubmit from '@/src/components/form/form-submit';
import useChecklistAPI from '@/src/hooks/api/useChecklistAPI';
import { checklistItemSchema } from '@/src/lib/form-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const AddItemForm = ({ checklist, card }) => {
    const [ showForm, setShowForm ] = useState(false);
    const { addItem } = useChecklistAPI();
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(checklistItemSchema.pick({ text: true })),
        defaultValues: {
            text: ''
        }
    });
    const queryClient = useQueryClient();

    if (!showForm) {
        return (
            <Button
                variant='translucent'
                size='sm'
                className='px-1.5 py-1'
                onClick={() => setShowForm(true)}
            >
                Add an item
            </Button>
        )
    }

    const onSubmit = async (data) => {
        try {
            const { success } = await addItem(card._id, checklist._id, data.text);

            if (success) {
                queryClient.invalidateQueries(['card-checklists', card._id]);
                reset();
                setShowForm(false);
            } else {
                toast.error('Failed to add item');
            }
        } catch (error) {
            console.error("Error adding item", error);
            toast.error('Failed to add item');
        }
    }


  return (
    <form
        className='space-y-2 w-1/2'
        onSubmit={handleSubmit(onSubmit)}
    >
      <FormInput
        id='text'
        {...register('text')}
        placeholder='Enter a title for this item...'
        autoFocus
        errors={errors.text}
        isSubmitting={isSubmitting}
      />

      <div className='flex items-center justify-between'>
          <FormSubmit
            className='px-3 py-0.5'
            isSubmitting={isSubmitting}
          >
            Add
          </FormSubmit>

          <Button
            variant='translucent'
            size='sm'
            onClick={(e) => {e.preventDefault(); setShowForm(false)}}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
      </div>
    </form>
  )
}

export default AddItemForm
