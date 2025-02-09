import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'

const CardBadge = ({ children, text}) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger>
                {children}
            </TooltipTrigger>
            
            <TooltipContent side='bottom' className='poppins-regular'>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default CardBadge
