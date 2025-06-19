import React from 'react';
import { XMarkIcon } from '@heroicons/react/24/outline';

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl w-full max-w-md">
        <div className="flex justify-between items-center p-6 border-b border-gray-700">
          <h3 className="text-xl font-semibold text-gray-100">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-200"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;