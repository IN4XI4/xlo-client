import React, { useState } from 'react'


export function ComingSoonModal({ title, context, onClose }) {
  const [isOpen, setIsOpen] = useState(true);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="relative top-20 mx-auto p-5 border w-80 md:w-96 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div className="">
          <h3 className="text-lg leading-6 font-bold text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              {context}
            </p>
          </div>
          <div className="mt-4">
            <button
              type="button"
              className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-[#3DB1FF] text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:text-sm"
              onClick={onClose}
            >
              Ok
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
