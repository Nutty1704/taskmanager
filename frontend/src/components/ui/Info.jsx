import { useOrganization } from '@clerk/clerk-react'
import React from 'react'
import InfoSkeleton from '../skeletons/InfoSkeleton';

const Info = () => {
    const { organization, isLoaded } = useOrganization();

    if (!isLoaded) {
        return (
            <InfoSkeleton />
        )
    }

  return (
    <div className='flex items-center gap-x-4'>
        <div className='w-[60px] h-[60px] relative'>
            <img
                src={organization?.imageUrl}
                alt={organization?.name}
                className='rounded-md object-cover'
            />
        </div>

        <div>
            <p className='poppins-semibold text-xl'>{organization?.name}</p>
        </div>
    </div>
  )
}

export default Info
