import React from 'react'
import CardBadge from '../CardBadge';
import { User } from 'lucide-react';
import { useUser } from '@clerk/clerk-react';


const getText = (isAssigned, n) => {
    if (isAssigned) {
        return n == 1
            ? 'You are assigned to this card.'
            : `You and ${n - 1} other person are assigned to this card.`
    }
    return `${n} ${n ? 'person is' : 'people are'} assigned to this card.`
}

const MemberBadge = ({ data, badgeSize }) => {
    const { user } = useUser();
    const isAssigned = data.assignedTo.some((u) => u.id === user.id);

    return (
        <CardBadge
            text={getText(isAssigned, data.assignedTo.length)}
        >
            <div
                className={`flex items-center justify-center gap-x-1 text-xs ${isAssigned ? 'text-primary' : 'text-muted-foreground'}`}
            >
                <User size={badgeSize} />
                <span>{data.assignedTo.length}</span>
            </div>
        </CardBadge>
    )
}

export default MemberBadge
