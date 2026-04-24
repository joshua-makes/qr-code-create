'use client';

import { cn } from '@/lib/utils';
import { LabelHTMLAttributes, forwardRef } from 'react';

type LabelProps = LabelHTMLAttributes<HTMLLabelElement>;

const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return (
    <label
      ref={ref}
      className={cn('text-sm font-medium text-gray-700 dark:text-gray-300', className)}
      {...props}
    />
  );
});

Label.displayName = 'Label';

export { Label };
