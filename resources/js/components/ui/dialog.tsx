import React, { useState, createContext, useContext } from 'react';

interface DialogContextProps {
  open: boolean;
  setOpen: (open: boolean) => void;
}

const DialogContext = createContext<DialogContextProps | undefined>(undefined);

export const Dialog: React.FC<{ open?: boolean; onOpenChange?: (open: boolean) => void; children: React.ReactNode }> = ({
  open: controlledOpen,
  onOpenChange,
  children,
}) => {
  const [open, setOpen] = useState(false);
  const isControlled = controlledOpen !== undefined;
  const actualOpen = isControlled ? controlledOpen : open;

  const setActualOpen = (value: boolean) => {
    if (!isControlled) {
      setOpen(value);
    }
    if (onOpenChange) {
      onOpenChange(value);
    }
  };

  return (
    <DialogContext.Provider value={{ open: actualOpen, setOpen: setActualOpen }}>
      {children}
    </DialogContext.Provider>
  );
};

export const DialogTrigger: React.FC<{ asChild?: boolean; children: React.ReactNode }> = ({ asChild = false, children }) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('DialogTrigger must be used within a Dialog');
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

export const DialogContent: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('DialogContent must be used within a Dialog');
  }
  const { open, setOpen } = context;

  if (!open) return null;

  return (
    <div
      className={`fixed inset-0 bg-blue bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50 ${className}`}
      {...props}
      onClick={() => setOpen(false)}
      
    >
      <div className="bg-white rounded p-6" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
};

export const DialogHeader: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`mb-4 ${className}`} {...props}>
    {children}
  </div>
);

export const DialogTitle: React.FC<React.HTMLAttributes<HTMLHeadingElement>> = ({ children, className = '', ...props }) => (
  <h2 className={`text-xl font-semibold ${className}`} {...props}>
    {children}
  </h2>
);

export const DialogDescription: React.FC<React.HTMLAttributes<HTMLParagraphElement>> = ({ children, className = '', ...props }) => (
  <p className={`text-sm text-gray-600 ${className}`} {...props}>
    {children}
  </p>
);

export const DialogFooter: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({ children, className = '', ...props }) => (
  <div className={`mt-4 flex justify-end gap-2 ${className}`} {...props}>
    {children}
  </div>
);
