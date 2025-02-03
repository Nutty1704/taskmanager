import { getAuditLogs } from '@/src/lib/api/org';
import { useAuth } from '@clerk/clerk-react'
import { useQuery } from '@tanstack/react-query';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import useAuthStore from '@/src/stores/useAuthStore';
import AcitivityItem from './AcitivityItem';

const ActivityList = () => {
    const { orgId } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const { token } = useAuthStore();
    const { data: auditLogs, isLoading } = useQuery({
        queryKey: ['audit-logs', orgId, token],
        queryFn: getAuditLogs,
        enabled: !!orgId && !!token,
        select: (data) => (data.success ? data.data : []),
        staleTime: 0,
    });

    if (!orgId && !auth.orgId) {
        navigate('/select-org');
    }

    if (isLoading) {
        return <ActivityList.Skeleton />;
    }

  return (
    <ol className='space-y-4 mt-4 mb-4 overflow-auto max-h-[70vh] custom-scrollbar'>
        <p className='hidden last:block text-xs text-center text-muted-foreground'>
            No activity found inside this organization.
        </p>

        {auditLogs && auditLogs.map(log => (
            <AcitivityItem key={log._id} data={log} />
        ))}
    </ol>
  )
}


ActivityList.Skeleton = () => (
    <ol className='space-y-4 mt-4'>
        <Skeleton className='w-[80%] h-14' />
        <Skeleton className='w-[50%] h-14' />
        <Skeleton className='w-[70%] h-14' />
        <Skeleton className='w-[80%] h-14' />
        <Skeleton className='w-[75%] h-14' />
    </ol>
);

export default ActivityList
