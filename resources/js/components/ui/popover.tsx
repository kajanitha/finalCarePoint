import React, { useState, createContext, useContext } from 'react';

interface PopoverContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const PopoverContext = createContext<PopoverContextProps | undefined>(undefined);

export const Popover: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <PopoverContext.Provider value={{ open, setOpen }}>
      <div className="relative inline-block">{children}</div>
    </PopoverContext.Provider>
  );
};

export const PopoverTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild = false,
  children,
}) => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('PopoverTrigger must be used within a Popover');
  }
  const { setOpen } = context;

  const child = React.Children.only(children);
  const props = {
    onClick: () => setOpen(true),
  };

  if (asChild && React.isValidElement(child)) {
    return React.cloneElement(child, props);
  }

  return <button {...props}>{children}</button>;
};

export const PopoverContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(PopoverContext);
  if (!context) {
    throw new Error('PopoverContent must be used within a Popover');
  }
  const { open, setOpen } = context;

  if (!open) return null;

  return (
    <div
      className={`absolute z-50 bg-white border border-gray-300 rounded shadow-lg ${className}`}
      {...props}
      onClick={() => setOpen(false)}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
};
