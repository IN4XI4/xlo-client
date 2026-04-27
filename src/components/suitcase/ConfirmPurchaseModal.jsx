import React from 'react';

export function ConfirmPurchaseModal({ pkg, isLoading, onConfirm, onCancel, error }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl p-6 w-80 flex flex-col gap-4 shadow-lg">
        <div className="text-lg font-semibold text-gray-800">Confirm purchase</div>
        <div className="text-sm text-gray-600">
          You are about to buy{' '}
          <span className="font-semibold text-gray-800">{pkg.coins.toLocaleString()} coins</span>{' '}
          for a value of{' '}
          <span className="font-semibold text-gray-800">
            {pkg.price_display}
          </span>
          . Are you sure you want to proceed?
        </div>
        {error && <div className="text-sm text-red-500">{error}</div>}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm text-gray-600 border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className="px-4 py-2 rounded-xl text-sm text-white bg-[#FF822C] hover:bg-orange-500 disabled:opacity-50 transition-colors flex items-center gap-2">
            {isLoading && (
              <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
            )}
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}
