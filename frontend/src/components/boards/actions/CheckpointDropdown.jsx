import React from 'react'
import { format } from 'date-fns';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from '@/components/ui/button';
import { ChevronDown, MapPinCheckInside, Trash, Triangle } from 'lucide-react';
import DeleteCheckpoint from './DeleteCheckpoint';


const formatDate = (date) => {
    return format(new Date(date), "dd MMM yyyy");
}

const CheckpointDropdown = ({ board }) => {
    if (!board.checkpoints || board.checkpoints.length === 0) {
        return null;
    }

    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Button variant='transparent' size='sm'>
                    Checkpoints
                    <ChevronDown />
                </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent align='end'>
                {board.checkpoints.map(checkpoint => (
                    <DropdownMenuItem key={checkpoint.checkpointId} className='bg-background text-foregrond focus:bg-background focus:text-foreground p-0'>

                        <a href={`/checkpoint/${checkpoint.checkpointId}`} target="_blank" rel="noopener noreferrer" className='flex items-center gap-3 hover:bg-secondary px-2 py-1'>
                            <MapPinCheckInside className='h-3 w-3' />
                            {formatDate(checkpoint.createdAt)}
                        </a>

                        <DeleteCheckpoint id={checkpoint.checkpointId} className='ml-auto flex items-center justify-center hover:bg-secondary px-1 py-0.5 rounded-md'>
                            <Trash className='h-4 w-4 text-destructive' />
                        </DeleteCheckpoint>

                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default CheckpointDropdown
