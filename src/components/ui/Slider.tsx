'use client';

import { cn } from '@/lib/utils';
import { InputHTMLAttributes, forwardRef } from 'react';

interface SliderProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

const Slider = forwardRef<HTMLInputElement, SliderProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      type="range"
      className={cn('w-full h-2 rounded-lg appearance-none cursor-pointer accent-blue-600', className)}
      {...props}
    />
  );
});

Slider.displayName = 'Slider';

export { Slider };
