import React, { useRef, useState } from 'react'
import ListWrapper from './ListWrapper'
import { Plus, X } from 'lucide-react'
import { useEventListener, useOnClickOutside } from 'usehooks-ts';
import FormInput from '../form/form-input';
import { useParams } from 'react-router-dom';
import FormSubmit from '../form/form-submit';
import { Button } from '@/components/ui/button';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { listSchema } from '@/src/lib/form-validators';
import useListStore from '@/src/stores/useListStore';
import { createList } from '@/src/lib/api/list';
import toast from 'react-hot-toast';

const ListForm = () => {
    const [isEditing, setIsEditing] = useState(false);

    const formRef = useRef(null);
    const { boardId } = useParams();

    const { addList } = useListStore();

    const { register, reset, handleSubmit, setFocus,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(listSchema.pick({ title: true, boardId: true })),
        defaultValues: {
            title: '',
            boardId: boardId
        }
    });

    const enableEditing = () => {
        setIsEditing(true);
        setTimeout(() => {
            setFocus('title');
        });
    }

    const disableEditing = () => {
        reset();
        setIsEditing(false);
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            disableEditing();
        }
    };

    useEventListener('keydown', onKeyDown);
    useOnClickOutside(formRef, disableEditing);

    const onSubmit = async (data) => {
        const { success, newList } = await createList(data);
        if (success) {
            addList(newList);
            disableEditing();
            toast.success(`List ${newList.title} created successfully`);
        } else {
            toast.error('Failed to create list');
        }
    }

    if (isEditing) {
        return (
            <ListWrapper>
                <form
                    ref={formRef}
                    onSubmit={handleSubmit(onSubmit)}
                    className='w-full p-3 rounded-md space-y-4 bg-background shadow-md'
                >
                    <FormInput
                        name='title'
                        id='title'
                        className='text-sm px-2 py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition'
                        placeholder='Enter list title...'
                        errors={errors.title}
                        isSubmitting={isSubmitting}
                        {...register('title')}
                    />

                    <input
                        hidden
                        value={boardId}
                        name="boardId"
                        {...register('boardId')}
                    />

                    <div
                        className="flex items-center gap-x-1"
                    >
                        <FormSubmit
                            isSubmitting={isSubmitting}
                        >
                            Add List
                        </FormSubmit>
                        <Button
                            onClick={disableEditing}
                            size='sm'
                            variant='ghost'
                        >
                            <X size={16} />
                        </Button>
                    </div>

                </form>
            </ListWrapper>
        )
    }


    return (
        <ListWrapper>
            <button
                onClick={enableEditing}
                className='w-full rounded-md bg-background/80 hover:bg-background/50 transition p-3 flex items-center font-medium text-sm cursor-pointer'
            >
                <Plus size={16} className='mr-2' />
                Add a list
            </button>
        </ListWrapper>
    )
}

export default ListForm
