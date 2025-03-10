import React, { useState, useEffect } from 'react'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Dialog, DialogContent, DialogTitle, DialogClose } from '@/components/ui/dialog'

import FormInput from './form-input'
import FormSubmit from './form-submit'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { boardSchema } from '@/src/lib/form-validators'
import toast from 'react-hot-toast'
import FormPicker from './form-picker'
import useBoardAPI from '@/src/hooks/api/useBoardAPI'
import useIsMobileView from '@/src/hooks/useIsMobileView'

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

    const [isOpen, setIsOpen] = useState(false);
    const isMobileView = useIsMobileView();

    const { createBoard } = useBoardAPI();

    const onSubmit = async (data) => {
        const title = data.title.trim();
        const { success, newBoard } = await createBoard({ title, image: data.image });

        if (!success) {
            return toast.error('Failed to create board', { duration: 1500 });
        }

        setIsOpen(false);
        handleClose();
        toast.success(`Board "${title}" created successfully!`, { duration: 1500 });
    }

    const handleClose = () => {
        reset();
    }

    const formContent = (
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
    );

    // Use Dialog for mobile, Popover for larger screens
    if (isMobileView) {
        return (
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="sm:max-w-md p-4">
                    <DialogTitle className="text-center text-sm poppins-medium text-muted-foreground">
                        Create Board
                    </DialogTitle>
                    <DialogClose className="absolute right-2 top-2 p-2">
                        <X className="h-4 w-4" />
                    </DialogClose>
                    {formContent}
                </DialogContent>
                
                <div onClick={() => setIsOpen(true)}>
                    {children}
                </div>
            </Dialog>
        );
    }

    // Standard popover for larger screens
    return (
        <Popover
            open={isOpen}
            onOpenChange={(open) => {
                setIsOpen(open);
                if (!open) {
                    handleClose();
                }
            }}
            className='shadow-md'
        >
            <PopoverTrigger asChild>
                {children}
            </PopoverTrigger>

            <PopoverContent
                align={align}
                className='w-80 max-w-[85vw] pt-3 overflow-auto'
                sideOffset={sideOffset}
                side={side}
                avoidCollisions={true}
                collisionPadding={16}
            >
                <div className='w-full bg-popover'>
                    <div className='text-sm poppins-medium text-center text-muted-foreground pb-4'>
                        Create Board
                    </div>
                    <PopoverClose asChild>
                        <Button className='h-auto w-auto p-2 absolute top-1 right-1 text-foreground' variant='ghost'>
                            <X className='h-4 w-4' />
                        </Button>
                    </PopoverClose>
                    {formContent}
                </div>
            </PopoverContent>
        </Popover>
    );
}

export default BoardFormPopover