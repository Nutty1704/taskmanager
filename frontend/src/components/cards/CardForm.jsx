import { Button } from '@/components/ui/button'
import { Plus, X } from 'lucide-react'
import React, { useRef } from 'react'
import FormTextArea from '../form/form-text-area';
import FormSubmit from '../form/form-submit';
import { useForm } from 'react-hook-form';
import { useParams } from 'react-router-dom';
import { cardSchema } from '@/src/lib/form-validators';
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import useCardAPI from '@/src/hooks/api/useCardAPI';

const CardForm = React.forwardRef(({
    listId,
    enableEditing,
    disableEditing,
    isEditing,
}, ref) => {
    const { boardId } = useParams();
    const formRef = useRef(null);

    const { createCard } = useCardAPI();

    const { register, reset, setFocus, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(cardSchema.pick({ title: true, listId: true, boardId: true })),
        defaultValues: {
            title: '',
            listId: listId,
            boardId: boardId
        }
    });

    const onDisable = () => {
        disableEditing();
        reset();
    }

    const onEnable = () => {
        enableEditing();
        setTimeout(() => {
            setFocus('title');
        });
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            onDisable();
        }
    }

    
    useOnClickOutside(formRef, onDisable);
    useEventListener('keydown', onKeyDown);

    const onTextAreaKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            formRef.current?.requestSubmit();
        }
    }

    const onSubmit = async (data) => {
        try {
            const { success, newCard } = await createCard(data);
            if (success) {
                // Local card update is handled by socket
                toast.success(`Card ${newCard.title} created`);
                onDisable();
            }
        } catch (error) {
            console.error("Error submitting card form", error);
            toast.error("Failed to create card");
        }
    }

    if (isEditing) {
        return (
            <form
                ref={formRef}
                className='m-1 py-0.5 px-1 space-y-4'
                onSubmit={handleSubmit(onSubmit)}
            >
                <FormTextArea
                    id='title'
                    onKeyDown={onTextAreaKeyDown}
                    ref={ref}
                    placeholder='Enter a title for this card...'
                    errors={errors.title}
                    isSubmitting={isSubmitting}
                    {...register('title')}
                />

                <div className="flex items-center gap-x-1">
                    <FormSubmit isSubmitting={isSubmitting}>
                        Add card
                    </FormSubmit>
                    <Button onClick={onDisable} variant='ghost' size='sm'>
                        <X size={16} />
                    </Button>
                </div>
            </form>
        )
    }

  return (
    <div className='pt-2 px-2'>
      <Button
        onClick={onEnable}
        className='h-auto px-2 py-1.5 w-full justify-start text-muted-foreground text-sm'
        size='sm'
        variant='ghost'
      >
        <Plus size={16} className='mr-2' />
        Add a card
      </Button>
    </div>
  )
});

export default CardForm
