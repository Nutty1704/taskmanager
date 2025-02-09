import React from 'react'
import { UHHeader } from '../CardUnderHeader'
import { Button } from '@/components/ui/button'
import CardDatesPopover from '@/src/components/cards/card-modal/actions/dates/CardDatesPopover'
import { format } from 'date-fns'
import { ChevronDown } from 'lucide-react'


const getTitle = (hasStartDate, hasDueDate) => {
    if (hasStartDate && hasDueDate) return 'Dates'
    if (hasStartDate) return 'Start Date'
    return 'Due Date'
}

const formatDate = (date, currentYear) => {
    if (!date) return null;

    const d = new Date(date);
    return d.getFullYear() === currentYear
            ? format(d, 'MMM d')
            : format(d, 'MMM d, yyyy');
};

const CardUHDates = ({ card, ...props }) => {
    const { startDate, dueDate } = card;
    const title = getTitle(!!startDate, !!dueDate);
    const currentYear = new Date().getFullYear();
    const startStr = formatDate(startDate, currentYear);
    const dueStr = formatDate(dueDate, currentYear);

    const getDateStr = () => {
        if (startStr && dueStr) return `${startStr} - ${dueStr}`
        if (startStr) return startStr
        return dueStr
    }

    return (
        <>
            <UHHeader text={title} />

            <CardDatesPopover
                card={card}
                side='bottom'
                align='start'
                collisionPadding={200}
                {...props}
            >
                <Button variant='secondary' size='inline' className='w-full text-xs px-2 justify-between'>
                    {getDateStr()}
                    <ChevronDown className='w-3 h-3' />
                </Button>
            </CardDatesPopover>
        </>
    )
}

export default CardUHDates
