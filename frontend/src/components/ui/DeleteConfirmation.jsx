import { Button } from '@/components/ui/button'
import { Popover, PopoverClose, PopoverContent, PopoverTrigger } from '@/components/ui/popover-dialog'
import React, { useRef } from 'react'

const DeleteConfirmation = ({ message, onConfirm, children }) => {
    const closeRef = useRef(null);

  return (
    <Popover>
        <PopoverTrigger asChild>
            { children }
        </PopoverTrigger>

        <PopoverContent
            side='top'
            align='end'
        >
            <div className='flex flex-col items-center gap-2'>
                <p className='text-xs text-popover-foreground'>{ message }</p>
                <div className="w-full flex items-center justify-start gap-3">
                    <Button
                        variant='destructive'
                        size='sm'
                        className='px-1 py-1'
                        onClick={() => onConfirm(closeRef)}
                    >Delete</Button>
                    <Button
                        variant='translucent'
                        size='sm'
                        className='px-1 py-1'
                        onClick={() => closeRef.current.click()}
                    >Cancel</Button>
                </div>
            </div>

            <PopoverClose className='hidden' ref={closeRef}>Close</PopoverClose>
            
        </PopoverContent>
      
    </Popover>
  )
}

export default DeleteConfirmation
