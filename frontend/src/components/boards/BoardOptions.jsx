import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover'
import { MoreHorizontal, X } from 'lucide-react'
import React from 'react'
import BoardActions from './BoardActions'

const BoardOptions = ({ id, title }) => {

    return (
        <Popover>

            <PopoverTrigger asChild>
                <Button className='h-auto w-auto p-2' variant='transparent'>
                    <MoreHorizontal size={16} />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className='px-0 pt-3 pb-3'
                side='bottom'
                align='start'
            >
                <div className='text-sm poppins-medium text-center text-muted-foreground pb-4'>
                    Board Actions
                </div>

                <PopoverClose asChild>
                    <Button
                        className='h-auto w-auto p-2 absolute top-2 right-2 text-muted-foreground'
                        variant='ghost'
                    >
                        <X size={16} />
                    </Button>
                </PopoverClose>

                <BoardActions id={id} title={title} />

            </PopoverContent>
        </Popover>
    )
}

export default BoardOptions
