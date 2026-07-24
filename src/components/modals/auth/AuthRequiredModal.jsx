import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { ModalLogin } from './ModalLogin';
import { ModalRegister } from './ModalRegister';

export function AuthRequiredModal({ onClose, onSuccess }) {
  const [view, setView] = useState('login');

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="relative w-full max-w-md my-8" onClick={handleModalClick}>
        <button
          type="button"
          className="absolute -top-3 -right-3 bg-white rounded-full p-1 shadow-md text-gray-500 hover:text-gray-700"
          onClick={onClose}
        >
          <IoClose className="text-xl" />
        </button>
        {view === 'login'
          ? <ModalLogin onSuccess={onSuccess} onSwitchToRegister={() => setView('register')} />
          : <ModalRegister onSuccess={onSuccess} onSwitchToLogin={() => setView('login')} />}
      </div>
    </div>
  );
}
