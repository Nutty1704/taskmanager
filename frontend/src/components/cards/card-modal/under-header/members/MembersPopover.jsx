import { Button } from '@/components/ui/button'
import { Popover, PopoverTrigger, PopoverContent, PopoverClose } from '@/components/ui/popover-dialog'
import ToolTip from '@/src/components/ui/ToolTip'
import { useOrganization } from '@clerk/clerk-react'
import { Check, ChevronLeft, ChevronRight, X } from 'lucide-react'
import React, { useState } from 'react'

const MembersPopover = ({ children, defaultActiveMembers = [], onSave }) => {
    const { memberships } = useOrganization({
        memberships: {
            keepPreviousData: true, // Persist the cached data until the new data has been fetched
        },
    });

    const [open, setOpen] = useState(false);
    const [activeMembers, setActiveMembers] = useState(defaultActiveMembers); // list of user ids


    const addMember = (id) => {
        setActiveMembers([...activeMembers, id]);
    }

    const removeMember = (id) => {
        setActiveMembers(activeMembers.filter((mId) => mId !== id));
    }

    const isActive = (id) => {
        return activeMembers.some((mId) => mId === id);
    }

    const toggleMember = (id) => {
        if (isActive(id)) removeMember(id);
        else addMember(id);
    }

    const executeSave = async () => {
        try {
            await onSave(activeMembers);
            setOpen(false);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <Popover
            open={open}
            onOpenChange={setOpen}
        >

            <PopoverTrigger>
                {children}
            </PopoverTrigger>

            <PopoverContent
                side="bottom"
                align="start"
            >
                <div className='w-full p-1 flex items-center mb-3 relative'>
                    <span className='w-full text-sm text-center font-semibold text-muted-foreground'>Manage Members</span>
                    <PopoverClose className='absolute top-1 right-1'>
                        <X className='w-4 h-4' />
                    </PopoverClose>
                </div>

                <div>
                    <div className="grid grid-cols-5 gap-2">
                        {memberships.data.map((member) => (
                            <ToolTip
                                text={member.publicUserData.firstName + ' ' + member.publicUserData.lastName}
                                key={member.publicUserData.userId}
                            >
                                <div className='relative flex justify-center' onClick={() => toggleMember(member.publicUserData.userId)}>
                                    <img
                                        src={member.publicUserData.imageUrl}
                                        alt={member.publicUserData.firstName + ' ' + member.publicUserData.lastName}
                                        className="w-9 h-9 rounded-full"
                                    />
                                    {isActive(member.publicUserData.userId) && (
                                        <div className='absolute bottom-0 right-0 bg-success rounded-full'>
                                            <Check className='w-3.5 h-3.5 text-white' strokeWidth={3} />
                                        </div>
                                    )}
                                </div>
                            </ToolTip>
                        ))}
                    </div>

                    <div className='flex items-center justify-between mt-4'>
                        <Button
                            size='sm'
                            onClick={executeSave}
                        >
                            Save
                        </Button>

                        <div className='grid grid-cols-2 gap-1 w-[30%]'>
                            <Button
                                disabled={!memberships.hasPreviousPage}
                                onClick={memberships.fetchPrevious}
                                variant='ghost'
                                size='sm'
                            >
                                {memberships.hasPreviousPage && <ChevronLeft className='mx-1 w-4 h-4' />}
                            </Button>

                            <Button
                                disabled={!memberships.hasNextPage}
                                onClick={memberships.fetchNext}
                                variant='ghost'
                                size='sm'
                            >
                                {memberships.hasNextPage && <ChevronRight className='mx-1 w-4 h-4' />}
                            </Button>
                        </div>
                    </div>
                </div>
            </PopoverContent>

        </Popover>
    )
}

export default MembersPopover
