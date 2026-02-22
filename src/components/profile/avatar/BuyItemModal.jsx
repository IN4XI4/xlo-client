import React, { useState } from 'react'
import { FaRegCircleXmark } from 'react-icons/fa6'

import { buyItem } from '../../../api/avatar.api'
import { ItemThumb } from './SelectItem'


function BuyItemModal({ item, Comp, coinBalance, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)
    try {
      await buyItem(item.id)
      onSuccess?.()
      onClose()
    } catch (err) {
      const data = err?.response?.data
      const msg = data?.detail || data?.error || data?.message
        || (typeof data === 'string' ? data : null)
        || 'Purchase failed. Please try again.'
      setError(msg)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50"
      onClick={onClose}>
      <div
        className="bg-white rounded-3xl p-6 w-80 lg:w-72 relative shadow-xl"
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center gap-2 mb-4">
          <span className="text-[#3DB1FF] font-semibold text-sm leading-tight">
            Purchase new color item
          </span>
          <div
            onClick={onClose}
            className="ml-auto border-gray-300 flex items-center justify-center text-gray-400
            hover:text-gray-600 flex-shrink-0 cursor-pointer">
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>

        {/* Item preview */}
        <div className="w-full aspect-[575/890] h-40 my-6">
          <svg viewBox="0 0 575 890" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <g id="Item-Thumb">
              {Comp ? (
                <ItemThumb Comp={Comp} />
              ) : (
                <div className="w-full h-24 flex items-center justify-center text-gray-400">
                  No preview
                </div>
              )}
            </g>
          </svg>
        </div>

        {/* Item info */}
        <div className="text-sm mb-4 py-3 border-t-2 border-b-2">
          {item.code && (
            <div className="font-semibold">
              Color-item number: <span className="text-[#3DB1FF]">#{item.code}</span>
            </div>
          )}
          {item.price != null && (
            <div className="font-semibold">
              Color-item price: <span className="text-[#3DB1FF]">{item.price} $MC</span>
            </div>
          )}
        </div>
        <div className='text-gray-500 text-sm pb-3'>
          {coinBalance != null && (
            <div className="font-semibold flex justify-between">
              <div>Your balance: </div>
              <div className="text-[#3DB1FF]">{coinBalance} $MC</div>
            </div>
          )}
          {coinBalance != null && item.price != null && (
            <div className="font-semibold flex justify-between">
              Balance after purchase: <span className="text-gray-500">{coinBalance - item.price} $MC</span>
            </div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-full bg-[#F87171] text-white text-sm tracking-wide hover:bg-red-500 transition-colors">
            DENY
          </button>
          <button
            onClick={handlePurchase}
            disabled={loading}
            className="flex-1 py-2 rounded-full bg-[#3DB1FF] text-white text-sm tracking-wide hover:bg-blue-500 transition-colors disabled:opacity-60">
            {loading ? '...' : 'ACQUIRE'}
          </button>
        </div>

        {error && (
          <p className="text-red-500 text-xs text-center mt-3">{error}</p>
        )}
      </div>
    </div>
  )
}

export default BuyItemModal
