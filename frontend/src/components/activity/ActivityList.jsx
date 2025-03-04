import { useAuth } from '@clerk/clerk-react';
import { useInfiniteQuery } from '@tanstack/react-query';
import React, { useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Skeleton } from '@/components/ui/skeleton';
import ActivityItem from './AcitivityItem';
import useOrgAPI from '@/src/hooks/api/useOrgAPI';

const ActivityList = () => {
    const { orgId } = useParams();
    const auth = useAuth();
    const navigate = useNavigate();
    const { getAuditLogs } = useOrgAPI();
    const observerRef = useRef(null);

    const {
        data,
        isLoading,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
    } = useInfiniteQuery({
        queryKey: ['audit-logs', orgId],
        queryFn: ({ pageParam = 1 }) => getAuditLogs({ page: pageParam, limit: 10 }),
        enabled: !!orgId,
        getNextPageParam: (lastPage, allPages) => {
            if (!lastPage?.success || !lastPage?.data?.length) return undefined;
            return lastPage.nextPage || undefined;
        },
        select: (data) => ({
            pages: data.pages,
            pageParams: data.pageParams,
            flatData: data.pages.flatMap((page) => (page.success ? page.data : []))
        }),
        staleTime: 0,
    });
    
    const flatData = data?.flatData || [];

    useEffect(() => {
        if (!orgId && !auth.orgId) {
            navigate('/select-org');
        }
    }, [orgId, auth.orgId, navigate]);

    // Intersection Observer to trigger fetchNextPage
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
                    fetchNextPage();
                }
            },
            { threshold: 0.1, rootMargin: "100px" }
        );
        
        const currentObserver = observerRef.current;
        if (currentObserver) {
            observer.observe(currentObserver);
        }

        return () => {
            if (currentObserver) {
                observer.unobserve(currentObserver);
            }
        };
    }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

    return (
        <ol className="space-y-4 mt-4 mb-4 overflow-auto max-h-[70vh] custom-scrollbar">
            {isLoading ? (
                <ActivityList.Skeleton />
            ) : (
                <>
                    {flatData.length === 0 && (
                        <p className="text-xs text-center text-muted-foreground">
                            No activity found inside this organization.
                        </p>
                    )}

                    {flatData.map((log) => (
                        <ActivityItem key={log._id} data={log} />
                    ))}

                    {isFetchingNextPage && <ActivityList.Skeleton />}

                    <div ref={observerRef} className="h-2 mt-2" />
                </>
            )}
        </ol>
    );
};

ActivityList.Skeleton = () => (
    <div className="space-y-4">
        <Skeleton className="w-[80%] h-14" />
        <Skeleton className="w-[50%] h-14" />
        <Skeleton className="w-[70%] h-14" />
    </div>
);

export default ActivityList;