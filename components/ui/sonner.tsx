'use client';

import { Toaster as Sonner } from 'sonner';

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast !border-dark-600 !bg-dark-100 !text-white shadow-lg',
          title: '!text-white',
          description: '!text-light-300',
          actionButton: '!bg-primary !text-dark-100',
          cancelButton: '!bg-dark-300 !text-white',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
