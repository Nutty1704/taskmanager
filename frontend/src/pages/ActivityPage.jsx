import React from 'react'
import Info from '../components/ui/Info'
import { Separator } from '@/components/ui/separator'
import ActivityList from '@/src/components/activity/ActivityList'
import { QueryProvider } from '../lib/query-provider';

const ActivityPage = () => {
  return (
    <div className='w-full font-normal'>
      <QueryProvider>
        <Info />
        <Separator className='my-2' />
        <ActivityList />
      </QueryProvider>
    </div>
  )
}

export default ActivityPage
