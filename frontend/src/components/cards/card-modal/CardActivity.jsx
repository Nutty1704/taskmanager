import { Skeleton } from '@/components/ui/skeleton'
import { ActivityIcon } from 'lucide-react'
import React from 'react'
import AcitivityItem from '@/src/components/activity/AcitivityItem'

const CardActivity = ({ items }) => {
  return (
    <div className='flex items-start gap-x-3 w-full text-foreground'>
        <ActivityIcon className='h-5 w-5 mt-0.5' />
        <div className="w-full">
            <p className="poppins-semibold mb-2">
                Activity
            </p>

            <ol className='mt-2 space-y-4 w-full'>
                {items.map((item) => (
                    <AcitivityItem key={item._id} data={item} />
                ))}
            </ol>
        </div>
    </div>
  )
}


CardActivity.Skeleton = () => {
    return (
        <div className='flex items-start gap-x-3 w-full'>
            <Skeleton className='bg-secondary h-6 w-6' />
            <div className="w-full">
                <Skeleton className='w-24 h-6 mb-2 bg-secondary' />
                <Skeleton className='w-full h-10 bg-secondary'/>
            </div>
        </div>
    )
}

export default CardActivity
