import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import React from 'react'

const ToolTip = ({ children, text, className, ...props }) => {
  return (
    <TooltipProvider>
        <Tooltip>
            <TooltipTrigger className={className}>
                {children}
            </TooltipTrigger>
            
            <TooltipContent side='bottom' className='poppins-regular' {...props}>
                <p>{text}</p>
            </TooltipContent>
        </Tooltip>
    </TooltipProvider>
  )
}

export default ToolTip
