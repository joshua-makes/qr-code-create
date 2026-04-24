import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

type ContainerProps = HTMLAttributes<HTMLDivElement>;

const Container = forwardRef<HTMLDivElement, ContainerProps>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      className={cn('mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8', className)}
      {...props}
    />
  );
});

Container.displayName = 'Container';

export { Container };
