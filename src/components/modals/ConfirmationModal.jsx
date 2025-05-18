import React from 'react'

export function ConfirmationModal({ onConfirm, onCancel, message, buttonColor }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4">
      <div className="bg-white p-6 rounded-lg shadow-lg text-center">
        <p className="mb-4 text-gray-500">{message}</p>
        <div className="flex justify-center">
          <button className={`bg-[${buttonColor}] text-white px-4 py-2 rounded-xl mr-2`} onClick={onConfirm}>
            Accept
          </button>
          <button className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl" onClick={onCancel}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  )
}
