import React, { useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useEventListener } from 'usehooks-ts';
import FormInput from '../form/form-input';
import { zodResolver } from '@hookform/resolvers/zod';
import { listSchema } from '@/src/lib/form-validators';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import ListOptions from './ListOptions';
import { Button } from '@/components/ui/button';
import { Minimize2, Maximize2 } from 'lucide-react';
import useListAPI from '@/src/hooks/api/useListAPI';

const ListHeader = ({ data, onAddCard, isCollapsed, toggleCollapse }) => {
    const [isEditing, setIsEditing] = useState(false);
    const formRef = useRef(null);

    const { updateList } = useListAPI();
    const { register, handleSubmit, reset, setFocus, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(listSchema),
        defaultValues: {
            title: data.title,
        }
    });

    const { boardId } = useParams();

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

    const onSubmit = async (formData) => {
        if (formData.title === data.title) {
            disableEditing();
            return;
        }

        const { success, updatedList } = await updateList(boardId, formData.id, formData.title);

        if (success) {
            toast.success(`Renamed list "${data.title}" to "${updatedList.title}"`);
            data.title = updatedList.title;
            disableEditing();
        } else {
            toast.error('Failed to rename list');
            reset();
        }
    }

    const onBlur = () => {
        formRef.current?.requestSubmit();
    }

    const onKeyDown = (e) => {
        if (e.key === 'Escape') {
            formRef.current?.requestSubmit();
        }
    }

    useEventListener('keydown', onKeyDown);

    const getElement = (isEditing) => {
        if (isEditing) {
            return (
                <form
                    ref={formRef}
                    className='flex-1 px-[2px]'
                    onBlur={onBlur}
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <input
                        hidden id="id" name="id"
                        value={data._id}
                        {...register('id')}
                    />
                    <input
                        hidden id="boardId" name="boardId"
                        value={data.board_id}
                        {...register('boardId')}
                    />
                    <FormInput
                        id="title"
                        placeholder="Enter list title..."
                        isSubmitting={isSubmitting}
                        errors={errors.title}
                        className='text-sm px-[7px] py-1 h-7 font-medium border-transparent hover:border-input focus:border-input transition truncate bg-transparent focus:bg-secondary'
                        {...register('title')}
                    />
                    <button type="submit" hidden />
                </form>
            )
        }
        return (
            <div
                onClick={enableEditing}
                className="w-full text-sm px-2.5 py-1 h-7 poppins-medium border-transparent"
            >
                {data.title}
            </div>
        )
    }

    if (isCollapsed) {
        return (
            <div
                className='pt-2 py-2 text-sm font-semibold flex flex-col gap-y-5 items-center justify-center'
                onClick={toggleCollapse}
            >
                <Maximize2 size={16} />
                <span className='text-md rotate-90 origin-center whitespace-nowrap'>
                    {data.title}
                </span>
            </div>
        )
    }

    return (
        <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
            {getElement(isEditing)}

            <Button onClick={toggleCollapse} variant='ghost' size='sm'>
                <Minimize2 size={16} />
            </Button>

            <ListOptions
                data={data}
                onAddCard={onAddCard}
            />
        </div>
    )
}


ListHeader.Static = ({ data, isCollapsed, toggleCollapse }) => {
    if (isCollapsed) {
        return (
            <div
                className='pt-2 py-2 text-sm font-semibold flex flex-col gap-y-5 items-center justify-center'
                onClick={toggleCollapse}
            >
                <Maximize2 size={16} />
                <span className='text-md rotate-90 origin-center whitespace-nowrap'>
                    {data.title}
                </span>
            </div>
        )
    }

    return (
        <div className='pt-2 px-2 text-sm font-semibold flex justify-between items-start gap-x-2'>
            <div
                className="w-full text-sm px-2.5 py-1 h-7 poppins-medium border-transparent"
            >
                {data.title}
            </div>

            <Button onClick={toggleCollapse} variant='ghost' size='sm'>
                <Minimize2 size={16} />
            </Button>
        </div>
    )
}

export default ListHeader
