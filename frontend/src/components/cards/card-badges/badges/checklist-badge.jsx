import React from 'react'
import CardBadge from '../CardBadge';
import { CircleCheckBig } from 'lucide-react';

const getChecklistStatus = (checklists) => {
    const status = checklists.reduce((acc, checklist) => {
        checklist.items.forEach(item => {
            if (item.isCompleted) acc.completedCount += 1;
            acc.totalCount += 1;
        });
        return acc;
    }, { completedCount: 0, totalCount: 0 });

    return status;
}

const ChecklistBadge = ({ checklists, badgeSize }) => {
    if (!checklists) return null;

    const { completedCount, totalCount } = getChecklistStatus(checklists);
    return (
        <CardBadge text={`${completedCount}/${totalCount} tasks completed`}>
            <div
                className={`flex items-center justify-center gap-x-1 text-xs ${completedCount === totalCount ? 'text-success' : 'text-muted-foreground'}`}
            >
                <CircleCheckBig size={badgeSize} />
                <span>{completedCount}/{totalCount}</span>
            </div>
        </CardBadge>
    )
}

export default ChecklistBadge
