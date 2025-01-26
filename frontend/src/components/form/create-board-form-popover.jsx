import React, { useEffect, useState } from 'react'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

import FormInput from './form-input'
import FormSubmit from './form-submit'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardSchema } from '@/src/lib/form-validators'
import toast from 'react-hot-toast'
import FormPicker from './form-picker'

import { createBoard } from '@/src/lib/api/board'
import useBoardStore from '@/src/stores/useBoardStore'

const BoardFormPopover = ({
    children,
    side = 'bottom',
    align = 'center',
    sideOffset = 0,
}) => {
    const { register, reset, setValue, handleSubmit, formState: { errors, isSubmitting } } = useForm({
        resolver: zodResolver(boardSchema),
        defaultValues: {
            title: '',
            image: '',
        }
    });

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const { addBoard } = useBoardStore();

    const onSubmit = async (data) => {
        const title = data.title.trim();
        const { success, newBoard } =await createBoard({ title, image: data.image });

        if (!success) {
            return toast.error('Failed to create board', { duration: 1500 });
        }

        addBoard(newBoard);
        setIsPopoverOpen(false);
        handlePopoverClose();
        toast.success(`Board "${title}" created successfully!`, { duration: 1500 });
    }

    const handlePopoverClose = () => {
        reset();
    }

    return (
        <Popover
            open={isPopoverOpen}
            onOpenChange={(open) => {
                setIsPopoverOpen(open);
                if (!open) {
                    handlePopoverClose();
                }
            }}
            className='shadow-md'
        >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                align={align}
                className='w-80 pt-3'
                sideOffset={sideOffset}
                side={side}
            >
                <div className='w-full h-full bg-popover'>
                    <div className='text-sm poppins-medium text-center text-muted-foreground pb-4'>
                        Create Board
                    </div>
                    <PopoverClose asChild>
                        <Button className='h-auto w-auto p-2 absolute top-1 right-1 text-foreground' variant='ghost'>
                            <X className='h-4 w-4' />
                        </Button>
                    </PopoverClose>
                    <form className='space-y-4' onSubmit={handleSubmit(onSubmit)}>
                        <div className='space-y-4'>
                            <FormPicker
                                id={'image'}
                                errors={errors.image}
                                isSubmitting={isSubmitting}
                                setValue={setValue}
                            />
                            <FormInput
                                id={'title'}
                                label='Board Title'
                                required={true}
                                type='text'
                                errors={errors.title}
                                isSubmitting={isSubmitting}
                                {...register('title')}
                            />
                            <FormSubmit
                                isSubmitting={isSubmitting}
                                className='w-full poppins-medium bg-logo-gradient hover:brightness-95 transition-all duration-200'
                            >
                                Create
                            </FormSubmit>
                        </div>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    )
}

export default BoardFormPopover
