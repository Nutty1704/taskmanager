import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import React from 'react'
import FormErrors from './form-errors'

const FormTextArea = React.forwardRef(({
    id,
    label = '',
    placeholder = '',
    required = false,
    disabled = false,
    errors = null,
    isSubmitting = false,
    className = '',
    onBlur = () => {},
    onClick = () => {},
    onKeyDown = (e) => {},
    defaultValue = '',
    ...registerProps
}, ref) => {
  return (
    <div className='space-y-2 w-full'>
      <div className='space-y-1 w-full'>
        {label && (
            <Label htmlFor={id} className="text-xs font-semibold text-muted-foreground">
                {label}
            </Label>
        )}
        
        <Textarea
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onClick={onClick}
            ref={ref}
            required={required}
            placeholder={placeholder}
            name={id}
            id={id}
            disabled={isSubmitting || disabled}
            className={`resize-none focus-visible:ring-0 focus-visible:ring-offset-0 ring-0 focus:ring-0 outline-none shadow-sm ${className}`}
            aria-describedby={`${id}-error`}
            defaultValue={defaultValue}
            {...registerProps}
        />
      </div>

      <FormErrors
        id={id}
        errors={errors}
      />
    </div>
  )
})

export default FormTextArea
