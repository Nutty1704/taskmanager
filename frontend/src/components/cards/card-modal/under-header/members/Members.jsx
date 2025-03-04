import { Plus } from 'lucide-react'
import React from 'react'
import MembersPopover from './MembersPopover'
import { Button } from '@/components/ui/button'
import { useOrganization, useUser } from '@clerk/clerk-react'
import { useParams } from 'react-router-dom'
import ToolTip from '@/src/components/ui/ToolTip'
import { useQueryClient } from '@tanstack/react-query'
import useCardStore from '@/src/stores/useCardStore'
import useCardAPI from '@/src/hooks/api/useCardAPI'

const Members = ({ data }) => {
    const members = data.assignedTo;
    const { memberships } = useOrganization({
        memberships: {
            role: ['org:admin']
        }
    });

    const { updateAssignees } = useCardAPI();
    const { boardId } = useParams();
    const queryClient = useQueryClient();
    const { updateCard: updateCardLocal } = useCardStore();

    const { user } = useUser();
    const isAdmin = memberships.data.some((membership) => membership.publicUserData.userId === user.id);


    const onUpdate = async (assignees) => {
        try {
            const { success, updatedCard } = await updateAssignees(boardId, data.list_id, data._id, assignees);

            if (!success) {
                throw new Error("Failed to update assignees");
            }

            queryClient.invalidateQueries(['card', data._id]);
            updateCardLocal(data._id, data.list_id, updatedCard);
        } catch (error) {
            console.error("Error updating assignees", error);
        }
    }

    return (
        <div className='grid grid-cols-4 gap-2'>
            {/* map over members */}
            {members?.map((member) => (
                <ToolTip text={member.firstName + " " + member.lastName} key={member.id}>
                    <img
                        src={member.imageUrl}
                        className='w-7 h-7 rounded-full'
                    />
                </ToolTip>
            ))}

            {isAdmin && (
                <MembersPopover
                    defaultActiveMembers={members?.map((member) => member.id)} // TODO: refactor according to API response
                    onSave={onUpdate}
                >
                    <Button variant='transparent' size='sm' className='w-2 rounded-md'>
                        <Plus className='w-3 h-3' />
                    </Button>
                </MembersPopover>
            )}

        </div>
    )
}

export default Members
