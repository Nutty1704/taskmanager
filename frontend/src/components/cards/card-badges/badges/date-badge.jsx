import React from 'react'
import { format } from 'date-fns'
import CardBadge from '../CardBadge';
import { Clock } from 'lucide-react';


function getBadgeDetails({ start, due,
    isCompleted, daysRemaining,
    startsInFuture }) {
    let badgeText = ''; // Tooltip text
    let badgeClass = 'text-muted-foreground';
    let displayText = ''; // Text inside badge

    if (start && due) {
        // Both start and due date exist
        badgeText =
            daysRemaining < 0
                ? 'This card is past due.'
                : daysRemaining === 0
                    ? 'This card is due today.'
                    : `This card is due in ${daysRemaining} day(s).`;

        badgeClass =
            daysRemaining < 0
                ? 'text-destructive'
                : daysRemaining < 2
                    ? 'text-amber-400'
                    : 'text-muted-foreground';

        displayText = `${format(start, 'MMM d')} - ${format(due, 'MMM d')}`;
    } else if (start) {
        // Only start date exists
        badgeText = startsInFuture
            ? `This card starts on ${format(start, 'MMM d')}.`
            : `This card started on ${format(start, 'MMM d')}.`;

        displayText = startsInFuture
            ? `Starts ${format(start, 'MMM d')}`
            : `Started ${format(start, 'MMM d')}`;
    } else if (due) {
        // Only due date exists
        badgeText =
            daysRemaining < 0
                ? 'This card is past due.'
                : daysRemaining === 0
                    ? 'This card is due today.'
                    : `This card is due in ${daysRemaining} day(s).`;

        badgeClass =
            daysRemaining < 0
                ? 'text-destructive'
                : daysRemaining < 2
                    ? 'text-amber-400'
                    : 'text-muted-foreground';

        displayText = format(due, 'MMM d');
    }

    if (isCompleted) {
        badgeText = 'This card is completed.';
        badgeClass = 'text-green-500';
    }

    return { badgeText, badgeClass, displayText };
}

const DateBadge = ({ isCompleted, startDate, dueDate, badgeSize }) => {
    if (!startDate && !dueDate) return null; // No dates, no badge

    const start = startDate ? new Date(startDate) : null;
    const due = dueDate ? new Date(dueDate) : null;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize for date comparisons

    const daysRemaining = due ? Math.ceil((due - Date.now()) / 86400000) : null;
    const startsInFuture = start && start > today;

    const { 
        badgeText, 
        badgeClass, 
        displayText 
    } = getBadgeDetails({ 
        start, 
        due, 
        isCompleted, 
        daysRemaining, 
        startsInFuture 
    });
    

    return (
        <CardBadge text={badgeText}>
            <div className={`flex items-center justify-start gap-1 rounded-sm px-1 ${badgeClass}`}>
                <Clock size={badgeSize} />
                <span className="text-xs poppins-light">{displayText}</span>
            </div>
        </CardBadge>
    );
};

export default DateBadge
