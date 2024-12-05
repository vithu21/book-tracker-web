import React, { forwardRef } from 'react';
import { FieldError } from 'react-hook-form';

interface InputFieldProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
  label: string;
  error?: FieldError;
  textarea?: boolean;
}

export const InputField = forwardRef<HTMLInputElement | HTMLTextAreaElement, InputFieldProps>(
  ({ label, error, textarea, ...props }, ref) => {
    const inputClassName = "mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500";
    
    return (
      <div>
        <label className="block text-sm font-medium text-gray-700">
          {label}
        </label>
        {textarea ? (
          <textarea
            {...props}
            ref={ref as React.ForwardedRef<HTMLTextAreaElement>}
            className={`${inputClassName} h-32`}
          />
        ) : (
          <input
            {...props}
            ref={ref as React.ForwardedRef<HTMLInputElement>}
            className={inputClassName}
          />
        )}
        {error && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>
    );
  }
);

InputField.displayName = 'InputField';