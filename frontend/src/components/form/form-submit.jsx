import { Button } from '@/components/ui/button';
import React from 'react'

const FormSubmit = ({
  children,
  disabled = false,
  className = '',
  variant = 'default',
  isSubmitting = false,
}) => {
  return (
    <Button
      disabled={isSubmitting || disabled}
      type='submit'
      variant={variant}
      size='sm'
      className={className}
    >
      {children}
    </Button>
  )
}

export default FormSubmit
