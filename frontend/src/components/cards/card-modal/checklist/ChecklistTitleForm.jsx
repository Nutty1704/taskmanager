import { Button } from '@/components/ui/button';
import FormInput from '@/src/components/form/form-input';
import { checklistSchema } from '@/src/lib/form-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

const ChecklistTitleForm = ({ title, onUpdate }) => {
    const [ showForm, setShowForm ] = useState(false);
    const { register, reset, handleSubmit, formState: { errors, isSubmitting }} = useForm({
        resolver: zodResolver(checklistSchema.pick({ title: true })),
        defaultValues: {
            title: title
        }
    });

    const onSubmit = async (data) => {
        try {
            if (data.title === title) {
                setShowForm(false);
            }

            const success = await onUpdate(data.title);

            if (success) {
                setShowForm(false);
            } else {
                toast.error('Failed to update title');
            }
        } catch (error) {
            console.error("Error in onSubmit", error);
            toast.error('Failed to update title');
        }
    }

    if (!showForm) {
        return (
            <div
                className='text-left py-1 px-2 hover:cursor-text font-semibold'
                onClick={() => setShowForm(true)}
            >
                <span className='text-md'>{ title }</span>
            </div>
        )
    }

  return (
    <form
        className='w-full'
        onSubmit={handleSubmit(onSubmit)}
        onBlur={handleSubmit(onSubmit)}
    >
      <FormInput
        id="title"
        {...register('title')}
        errors={errors.title}
        isSubmitting={isSubmitting}
        placeholder='Enter a title for this checklist...'
        autoFocus
      />
    </form>
  )
}

export default ChecklistTitleForm
