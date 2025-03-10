import React, { useRef } from 'react'
import {
    Popover,
    PopoverTrigger,
    PopoverContent,
    PopoverClose
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { MoreHorizontal, X } from 'lucide-react'
import ListDeleteForm from './ListDeleteForm'
import { Separator } from '@/components/ui/separator'
import toast from 'react-hot-toast'
import { useParams } from 'react-router-dom'
import useListStore from '@/src/stores/useListStore'
import useListAPI from '@/src/hooks/api/useListAPI'

const ListOptions = ({
    data,
    onAddCard
}) => {
    const closeRef = useRef(null);
    const { boardId } = useParams();

    const { copyList } = useListAPI();
    const { addList } = useListStore();

    const onCopy = async () => {
        try {
            const { success, newList } = await copyList(boardId, data._id);

            if (success) {
                // Local addition handled by socket listener
                toast.success(`Copied list ${data.title}`);
                onSuccess();
            } else {
                toast.error('Failed to copy list');
            }
        } catch (error) {
            console.error('Error copying list: ', error.response?.data || error.message);
            toast.error('Internal server error');
        }
    }

    const onAddClick = () => {
        onAddCard();
        onSuccess();
    }

    const onSuccess = () => {
        closeRef.current?.click();
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button
                    className="h-auto w-auto p-2"
                    variant="ghost"
                >
                    <MoreHorizontal size={16} />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                className='px-0 py-3'
                size='bottom'
                align='start'
            >
                <div
                    className='text-sm font-medium text-center text-muted-foreground pb-4'
                >
                    List Actions
                </div>

                <PopoverClose asChild ref={closeRef}>
                    <Button className='h-auto w-auto p-2 absolute top-2 right-2 text-muted-foreground' variant='ghost'>
                        <X size={16} />
                    </Button>
                </PopoverClose>

                <Button
                    onClick={onAddClick}
                    className='rounded-none w-full h-auto p-2 px-5 justify-start text-sm'
                    variant='ghost'
                >
                    Add Card
                </Button>

                {/* Copy a list */}
                <Button
                    className='rounded-none w-full h-auto p-2 px-5 justify-start text-sm'
                    variant='ghost'
                    onClick={onCopy}
                >
                    Duplicate List
                </Button>

                <Separator className='w-5/6 mx-auto' />

                <ListDeleteForm
                    id={data._id}
                    title={data.title}
                    onSuccess={onSuccess}
                >
                    <Button
                        className='rounded-none w-full h-auto p-2 px-5 justify-start text-sm text-destructive hover:text-destructive'
                        variant='ghost'
                    >
                        Delete List
                    </Button>
                </ListDeleteForm>
            </PopoverContent>
        </Popover>
    )
}

export default ListOptions
