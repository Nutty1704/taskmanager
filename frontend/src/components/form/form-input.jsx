import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import React from 'react'
import FormErrors from './form-errors';



const FormInput = React.forwardRef(({
        id,
    label = '',
    type = 'text',
    placeholder = '',
    required = false,
    disabled = false,
    errors = null,
    className = '',
    defaultValue = '',
    onBlur = () => { },
    isSubmitting = false,
    ...registerProps
}, ref) => {
    return (
        <div className='space-y-2'>
            <div className='space-y-1'>
                {label !== '' && (
                    <Label
                        htmlFor={id}
                        className="text-xs font-semibold text-muted-foreground"
                    >
                        {label}
                    </Label>
                )}
                <Input
                    ref={ref}
                    onBlur={onBlur}
                    defaultValue={defaultValue}
                    required={required}
                    name={id}
                    id={id}
                    placeholder={placeholder}
                    type={type}
                    disabled={isSubmitting || disabled}
                    className={'text-sm px-2 py-1 h-7 ' + className}
                    aria-describedby={`${id}-error`}
                    {...registerProps}
                />
            </div>
            <FormErrors
                id={id}
                errors={errors}
            />
        </div>
    )
});

export default FormInput;
