import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import FormInput from '@/src/components/form/form-input';
import FormSubmit from '@/src/components/form/form-submit';
import useChecklistAPI from '@/src/hooks/api/useChecklistAPI';
import { checklistSchema } from '@/src/lib/form-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { X } from 'lucide-react';
import React, { useRef } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';

const CardChecklistPopover = ({ children, card }) => {
    const { boardId } = useParams();

    const { createChecklist } = useChecklistAPI();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(checklistSchema.pick({ title: true })) ,
        defaultValues: {
            title: ''
        }
    });

    const closeRef = useRef(null);

    const onSubmit = async (data) => {
        try {
            const { success, newChecklist } = await createChecklist(card._id, card.list_id, boardId, data.title);

            if (success) {
                card.checklists.push(newChecklist);
                // Local update and modal update handled by socket listener
                toast.success('Checklist created successfully', { duration: 1000 });
                closeRef.current.click();
            }
        } catch (error) {
            console.error("Error creating checklist", error);
            toast.error('Failed to create checklist');
        }
    }

    return (
        <Popover>
            <PopoverTrigger className='w-full'>
                {children}
            </PopoverTrigger>

            <PopoverContent
                side='bottom'
                align='start'
                className='min-w-[325px] poppins-regular'
            >
                <div className='w-full p-1 flex items-center mb-3 relative'>
                    <span className='w-full text-sm text-center font-semibold text-foreground'>Add Checklist</span>

                    <PopoverClose className='absolute top-1 right-1' ref={closeRef}>
                        <X className='w-4 h-4' />
                    </PopoverClose>
                </div>

                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className='space-y-3'
                >
                    <FormInput
                        id='title'
                        type='text'
                        {...register('title')}
                        name='title'
                        className='w-full'
                        placeholder='Enter title...'
                        autoFocus
                        isSubmitting={isSubmitting}
                        errors={errors.title}
                    />

                    <FormSubmit
                        isSubmitting={isSubmitting}
                    >
                        Add
                    </FormSubmit>
                </form>
            </PopoverContent>
        </Popover>
    )
}

export default CardChecklistPopover;
