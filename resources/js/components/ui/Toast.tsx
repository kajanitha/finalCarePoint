import React, { useEffect } from 'react';

interface ToastProps {
  message: string;
  type?: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type = 'success', onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000); // auto close after 4 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === 'success' ? 'bg-green-100' : 'bg-red-100';
  const borderColor = type === 'success' ? 'border-green-400' : 'border-red-400';
  const textColor = type === 'success' ? 'text-green-700' : 'text-red-700';
  const icon = type === 'success' ? (
    <svg
      className="h-6 w-6 text-green-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  ) : (
    <svg
      className="h-6 w-6 text-red-500"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
    <div
      className={`fixed top-5 right-5 z-50 flex items-center space-x-4 rounded border px-4 py-3 shadow-lg ${bgColor} ${borderColor}`}
      role="alert"
    >
      <div>{icon}</div>
      <div className={`flex flex-col text-sm font-medium ${textColor}`}>
        <span>Appointment</span>
        <span>{message}</span>
      </div>
      <button
        onClick={onClose}
        className={`ml-4 rounded bg-transparent p-1 text-xl font-bold leading-none ${textColor} hover:opacity-75`}
        aria-label="Close"
      >
        &times;
      </button>
    </div>
  );
};

export default Toast;
