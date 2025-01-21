import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useMobileSidebar } from '@/src/hooks/useMobileSidebar'
import { Menu } from 'lucide-react';
import React, { useEffect } from 'react'
import { useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';

const MobileSidebar = () => {
    const location = useLocation();
    const { isOpen, onOpen, onClose } = useMobileSidebar();

    // automatically close the sidebar when the location changes
    useEffect(() => {
        onClose();
    }, [location]);

    return (
        <>
            <Button
                onClick={onOpen}
                className='block md:hidden'
                variant='ghost'
                size='sm'
            >
                <Menu className='h-4 w-4' />
            </Button>

            <Sheet open={isOpen} onOpenChange={onClose}>
                <SheetContent
                    side='left'
                    className='p-2 pt-10 top-0 shadown-lg bg-background transition-transform'    
                >
                    <Sidebar
                        storageKey='mobile-sidebar-state'
                    />
                </SheetContent>
            </Sheet>
        </>
    )
}

export default MobileSidebar
