import React from 'react'
import { IoClose } from 'react-icons/io5';

export function InfoModal({ title, context, onClose }) {
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" onClick={onClose}>
      <div className="relative top-40 mx-auto p-5 border w-5/6 md:w-1/3 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <IoClose className="text-xl" />
        </button>
        <div className="">
          <h3 className="text-lg font-bold text-gray-900 pr-6">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 whitespace-pre-line font-normal">
              {context}
            </p>
          </div>
        </div>
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            className="bg-[#3DB1FF] text-white px-4 py-2 rounded-xl"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
