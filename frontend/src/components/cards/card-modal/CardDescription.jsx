import { Skeleton } from '@/components/ui/skeleton'
import { cardSchema } from '@/src/lib/form-validators';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlignLeft } from 'lucide-react'
import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import FormTextArea from '../../form/form-text-area';
import FormSubmit from '../../form/form-submit';
import { Button } from '@/components/ui/button';
import { useQueryClient } from '@tanstack/react-query';
import useCardAPI from '@/src/hooks/api/useCardAPI';

const CardDescription = ({ data }) => {
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);
    const { boardId } = useParams();
    const queryClient = useQueryClient();
    const { updateCard } = useCardAPI();
    const { register, reset, setFocus, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(cardSchema.pick({ description: true })),
        defaultValues: {
            description: data.description || ''
        }
    });

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            setFocus('description');
        });
    }

    const disableEditing = () => {
        setIsEditing(false);
        reset();
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            disableEditing();
            return;
        }

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }


    useEventListener('keydown', onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = async (formData) => {
        try {
            if (data.description === formData.description) {
                disableEditing();
                return;
            }

            formData.boardId = boardId;
            formData.listId = data.list_id;
            formData.cardId = data._id;

            const { success } = await updateCard(formData);

            if (!success) {
                toast.error('Failed to update card description');
                return;
            }

            data.description = formData.description;
            queryClient.invalidateQueries(['card']);
            disableEditing();
            toast.success('Card description updated');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className='flex items-start gap-x-3 w-full'>
            <AlignLeft size={17} className='mt-0.5 text-foreground' />
            <div className="w-full">
                <p className='poppins-semibold text-foreground mb-2'>
                    Description
                </p>

                {isEditing
                    ? (
                        <form ref={formRef} onSubmit={handleSubmit(onSubmit)}>
                            <FormTextArea
                                id={'description'}
                                className='w-full mt-2'
                                placeholder='Add a more detailed description...'
                                errors={errors.description}
                                defaultValue={data.description || undefined}
                                {...register('description')}
                                isSubmitting={isSubmitting}
                            />
                            <div className='flex items-center gap-x-2 mt-2'>
                                <FormSubmit isSubmitting={isSubmitting}>
                                    Save
                                </FormSubmit>
                                <Button
                                    type='button'
                                    onClick={disableEditing}
                                    disabled={isSubmitting}
                                    size='sm'
                                    variant='ghost'
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    )
                    : (
                        <div
                            onClick={enableEditing}
                            role='button'
                            className='poppins-medium min-h-[78px] text-foreground/80 bg-secondary text-sm py-3 px-3.5 rounded-md'
                        >
                            {data.description || 'Add a more detailed description...'}
                        </div>)
                }
            </div>
        </div >
    )
}

CardDescription.Skeleton = () => {
    return (
        <div className="flex items-start gap-x-3 w-full">
            <Skeleton className='h-6 w-6 bg-muted-foreground' />
            <div className="w-full">
                <Skeleton className='bg-muted-foreground w-24 h-6 mb-2' />
                <Skeleton className='bg-muted-foreground w-full h-[78px]' />
            </div>
        </div>
    )
}

export default CardDescription
