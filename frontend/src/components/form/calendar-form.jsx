import { Calendar } from '@/components/ui/calendar';
import React, { useEffect, useState } from 'react';
import { format, parse, isValid } from 'date-fns';
import FormInput from './form-input';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';

const getInitialDate = (date, fallback) => {
    if (!date) return fallback;

    return new Date(date);
}

const CalendarForm = ({ initialStartDate, initialDueDate, onSubmit = async (startDate, dueDate) => {} }) => {
    const today = new Date();

    const [hasStartDate, setHasStartDate] = useState(!!initialStartDate);
    const [hasDueDate, setHasDueDate] = useState(!hasStartDate ? true : !!initialDueDate);

    const [startDateInput, setStartDateInput] = useState(
        format(getInitialDate(initialStartDate, today), "MM/dd/yyyy")
    );
    const [dueDateInput, setDueDateInput] = useState(
        format(getInitialDate(initialDueDate, today), "MM/dd/yyyy")
    );

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selected, setSelected] = useState({
        from: getInitialDate(initialStartDate, today),
        to: getInitialDate(initialDueDate, today),
    });

    const [calendarState, setCalendarState] = useState(today);

    useEffect(() => {
        if (hasStartDate) setStartDateInput(format(selected.from, "MM/dd/yyyy"));
        if (hasDueDate) setDueDateInput(format(selected.to, "MM/dd/yyyy"));
    }, [selected]);

    useEffect(() => {
        if (hasStartDate) {
            setSelected((prev) => {
                if (!hasDueDate && prev.from < prev.to) return prev;

                if (hasDueDate) {
                    return {
                        ...prev,
                        from: new Date(prev.to.getFullYear(), prev.to.getMonth(), prev.to.getDate() - 1)
                    }
                } else {
                    return {
                        ...prev,
                        from: today
                    }
                }
            });
        } else {
            if (hasDueDate) setCalendarState(selected.to);
            else setCalendarState(today);
        }
    }, [hasStartDate]);

    useEffect(() => {
        if (hasDueDate) {
            setSelected((prev) => {
                if (prev.from < prev.to) return prev;

                if (hasStartDate) {
                    return {
                        ...prev,
                        to: new Date(prev.from.getFullYear(), prev.from.getMonth(), prev.from.getDate() + 1)
                    }
                } else {
                    return {
                        ...prev,
                        to: today
                    }
                }
            })
        } else {
            if (hasStartDate) setCalendarState(selected.from);
            else setCalendarState(today);
        }
    }, [hasDueDate]);

    useEffect(() => {
        setCalendarState(hasDueDate ? selected.to : selected.from);
    }, [])

    // Handle input change manually
    const handleInputChange = (e, isDueDate = false) => {
        const value = e.target.value;
        if (!isDueDate) setStartDateInput(value);
        else setDueDateInput(value);

        if (value.length !== 10) return;

        // Try to parse the input value
        const parsedDate = parse(value, "MM/dd/yyyy", new Date());

        if (isValid(parsedDate)) {
            if (!isDueDate) setSelected({ ...selected, from: parsedDate });
            else setSelected({ ...selected, to: parsedDate });
            setCalendarState(parsedDate);
        }
    };

    const onSelect = (value) => {
        if (hasStartDate && hasDueDate) {
            setSelected(value);
            return;
        };
        if (hasStartDate) setSelected({ ...selected, from: value });
        else if (hasDueDate) setSelected({ ...selected, to: value });
    }

    const handleMonthChange = (e, changeBy = 0) => {
        e.preventDefault();
        setCalendarState((prev) => (
            new Date(prev.getFullYear(), prev.getMonth() + changeBy, 1)
        ));
    }

    const getSelected = () => {
        if (hasStartDate && hasDueDate) return selected;

        if (hasStartDate) return selected.from;
        if (hasDueDate) return selected.to;

        return null;
    }

    const handleSumbit = async (e) => {
        setIsSubmitting(true);
        e.preventDefault();
        const startDate = hasStartDate ? selected.from : null;
        const dueDate = hasDueDate ? selected.to : null;
        await onSubmit(startDate, dueDate);
        setIsSubmitting(false);
    }

    return (
        <form
            onSubmit={handleSumbit}
            className="w-full flex flex-col items-center gap-2 px-2"
        >
            <div className='relative'>
                <Calendar
                    mode={hasStartDate && hasDueDate ? "range" : "single"}
                    selected={getSelected()}
                    onSelect={onSelect}
                    month={calendarState}
                    year={calendarState}
                />

                <Button
                    className='absolute top-2 left-2 bg-transparent hover:bg-transparent'
                    size='icon'
                    onClick={(e) => handleMonthChange(e, -1)}
                ></Button>
                <Button
                    className='absolute top-2 right-2 bg-transparent hover:bg-transparent'
                    size='icon'
                    onClick={(e) => handleMonthChange(e, 1)}
                ></Button>

            </div>

            <div className="w-full flex flex-col items-start gap-1.5">
                <span className="text-xs text-muted-foreground font-medium">Start Date</span>
                <div className="w-[85%] flex gap-2 justify-start items-center">
                    <Checkbox
                        checked={hasStartDate}
                        onCheckedChange={(value) => setHasStartDate(value)}
                    />

                    <FormInput
                        id="startDate"
                        type="text"
                        name="startDate"
                        value={hasStartDate ? startDateInput : 'M/D/YYYY'}
                        className="w-[53%]"
                        disabled={!hasStartDate}
                        isSubmitting={isSubmitting}
                        onChange={(e) => handleInputChange(e, false)}
                    />
                </div>


                <span className="text-xs text-muted-foreground font-medium">Due Date</span>
                <div className='w-[85%] flex gap-2 justify-start items-center'>
                    <Checkbox
                        checked={hasDueDate}
                        onCheckedChange={(value) => setHasDueDate(value)}
                    />

                    <FormInput
                        id='dueDate'
                        type='text'
                        name='dueDate'
                        value={hasDueDate ? dueDateInput : 'M/D/YYYY'}
                        disabled={!hasDueDate}
                        isSubmitting={isSubmitting}
                        onChange={(e) => handleInputChange(e, true)}
                    />
                    {/* <FormInput
                        id='dueTime'
                        type='text'
                        name='dueTime'
                        disabled={!hasDueDate}
                        value={hasDueDate ? format(dueDate, "hh:mm a") : 'HH:MM A'}
                    /> */}
                </div>

                <div className="w-full flex flex-col mt-3 gap-2">
                    <Button disabled={isSubmitting} type='submit' className='w-full' variant='default'>
                        Save
                    </Button>
                    <Button onClick={() => onSubmit(null, null)} className='w-full' variant='secondary'>
                        Remove
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default CalendarForm;
