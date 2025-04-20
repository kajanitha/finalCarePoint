import React, { useState, createContext, useContext } from 'react';

interface SheetContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const SheetContext = createContext<SheetContextProps | undefined>(undefined);

export const Sheet: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [open, setOpen] = useState(false);

  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      <div>{children}</div>
    </SheetContext.Provider>
  );
};

export const SheetTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({
  asChild = false,
  children,
}) => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('SheetTrigger must be used within a Sheet');
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

export const SheetContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  children,
  className = '',
  ...props
}) => {
  const context = useContext(SheetContext);
  if (!context) {
    throw new Error('SheetContent must be used within a Sheet');
  }
  const { open, setOpen } = context;

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 ${className}`}
      {...props}
      onClick={() => setOpen(false)}
    >
      <div className="bg-white rounded p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const SheetHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const SheetTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h2 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const SheetDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);
