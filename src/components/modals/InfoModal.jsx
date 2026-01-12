import React, { useState } from 'react'


export function InfoModal({ title, context, onClose }) {
  const handleModalClick = (event) => {
    event.stopPropagation();
  };
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" onClick={onClose}>
      <div className="relative top-40 mx-auto p-5 border w-5/6 md:w-1/3 shadow-lg rounded-md bg-white" onClick={handleModalClick}>
        <div className="">
          <h3 className="text-lg font-bold text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500 whitespace-pre-line font-normal">
              {context}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
