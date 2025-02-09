import React, { useEffect, useState } from 'react'
import { Calendar } from '@/components/ui/calendar'
import { Checkbox } from '@/components/ui/checkbox'
import FormInput from '@/src/components/form/form-input'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'


const CalendarForm = ({ card }) => {
    const [dueDate, setDueDate] = useState(new Date());
    const [startDate, setStartDate] = useState(dueDate - 86400000);
    const [hasStartDate, setHasStartDate] = useState(!!card.startDate);
    const [hasDueDate, setHasDueDate] = useState(true);
    const [selected, setSelected] = useState({
        from: startDate,
        to: dueDate
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (hasStartDate && hasDueDate) setSelected({ from: startDate, to: dueDate });
        else if (hasStartDate) setSelected(startDate);
        else if (!hasStartDate) setSelected(dueDate);
        else setSelected(null);
    }, [hasStartDate, hasDueDate, startDate, dueDate]);

    useEffect(() => {
        if (hasStartDate) return;
        setStartDate(dueDate - 86400000);
    }, [dueDate]);

    useEffect(() => {
        if (hasDueDate) return;
        setDueDate(startDate + 86400000);
    }, [startDate]);

    const onSelect = (value) => {
        if (hasStartDate && hasDueDate) {
            setStartDate(value.from);
            setDueDate(value.to);
            return;
        };
        if (hasStartDate) setStartDate(new Date(value));
        else if (hasDueDate) setDueDate(new Date(value));
    }

    const onSubmit = (e) => {
        e.preventDefault();
        console.log(selected);
    }

    return (
        <form onSubmit={onSubmit} className='w-full flex flex-col items-center gap-2 px-2'>

            <Calendar
                mode={(hasStartDate && hasDueDate) ? "range" : "single"}
                selected={selected}
                onSelect={onSelect}
                className="h-full w-full flex"
                classNames={{
                    months:
                        "flex w-full flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0 flex-1",
                    month: "space-y-4 w-full flex flex-col",
                    table: "w-full h-full border-collapse space-y-1",
                    head_row: "",
                    row: "w-full mt-2",
                }}
            />

            <div className='w-full flex flex-col items-start gap-1.5'>
                <span className='text-xs text-muted-foreground font-medium'>Start Date</span>

                <div className='w-[85%] flex gap-2 justify-start items-center'>
                    <Checkbox
                        checked={hasStartDate}
                        onCheckedChange={(value) => setHasStartDate(value)}
                    />
                    <FormInput
                        id='startDate'
                        type='text'
                        name='startDate'
                        value={hasStartDate ? format(startDate, "MM/dd/yyyy") : 'M/D/YYYY'}
                        className='w-[53%]'
                        disabled={!hasStartDate}
                        isSubmitting={isSubmitting}
                    />
                </div>

                <div className='w-[85%] flex gap-2 justify-start items-center'>
                    <Checkbox
                        checked={hasDueDate}
                        onCheckedChange={(value) => setHasDueDate(value)}
                    />
                    <FormInput
                        id='dueDate'
                        type='text'
                        name='dueDate'
                        value={hasDueDate ? format(dueDate, "MM/dd/yyyy") : 'M/D/YYYY'}
                        disabled={!hasDueDate}
                        isSubmitting={isSubmitting}
                    />
                    <FormInput
                        id='dueTime'
                        type='text'
                        name='dueTime'
                        disabled={!hasDueDate}
                        value={hasDueDate ? format(dueDate, "hh:mm a") : 'HH:MM A'}
                    />
                </div>
            </div>

            <div className="w-full flex flex-col mt-3 gap-2">
                <Button disabled={isSubmitting} type='submit' className='w-full' variant='default'>
                    Save
                </Button>
                <Button className='w-full' variant='secondary'>
                    Remove
                </Button>
            </div>
        </form>
    )
}

export default CalendarForm
