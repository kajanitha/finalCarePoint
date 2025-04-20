import React from 'react';

export const Separator: React.FC<React.HTMLAttributes<HTMLHRElement>> = ({ className = '', ...props }) => {
  return <hr className={`border-gray-200 ${className}`} {...props} />;
};
