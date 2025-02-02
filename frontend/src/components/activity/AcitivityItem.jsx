import { format } from 'date-fns'
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { generateLogMessage } from '@/src/lib/util'
import React from 'react'

const AcitivityItem = ({data }) => {
  return (
    <li className='flex items-center gap-x-2'>
        <Avatar className='h-8 w-8'>
            <AvatarImage src={data.userImage} />
        </Avatar>
        <div className="flex flex-col space-y-0.5">
            <p className='text-sm text-muted-foreground'>
                <span className='poppins-semibold lowercase text-foreground'>
                    { data.userName }
                </span> {generateLogMessage(data)}
            </p>

            <p className='text-xs'>
                { format(new Date(data.createdAt), "MMM d, yyyy 'at' h:mm a'") }
            </p>
        </div>
    </li>
  )
}

export default AcitivityItem
