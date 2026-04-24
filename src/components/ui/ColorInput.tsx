'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

type ColorInputProps = InputHTMLAttributes<HTMLInputElement>;

const ColorInput = forwardRef<HTMLInputElement, ColorInputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="color"
      className={cn(
        'h-10 w-16 cursor-pointer rounded-md border border-gray-300 bg-white p-1 dark:border-gray-600 dark:bg-gray-800',
        className,
      )}
      {...props}
    />
  );
});

ColorInput.displayName = 'ColorInput';

export { ColorInput };
