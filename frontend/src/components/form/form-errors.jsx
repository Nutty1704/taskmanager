import React from 'react'
import { XCircle } from 'lucide-react'

const FormErrors = ({ id, errors }) => {    
    if (!errors) return null;

    return (
        <div
          id={`${id}-error`}
          aria-live="polite"
          className="mt-2 text-xs poppins-thin text-destructive"
        >
          {errors.message && ( // Show the error message if it exists
            <div className="flex items-center font-medium p-1 border border-destructive bg-destructive/10 rounded-md">
              <XCircle className="h-4 w-4 mr-2" />
              {errors.message}
            </div>
          )}
        </div>
      );
}

export default FormErrors
