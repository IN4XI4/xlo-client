import React, { useState } from 'react'
import { FaRegCircleXmark } from 'react-icons/fa6'
import { buyColor, buySkinColor } from '../../../api/avatar.api'


function BuyColorModal({ bg, item, isSkin, coinBalance, onClose, onSuccess }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handlePurchase = async () => {
    setLoading(true)
    setError(null)
    try {
      if (isSkin) {
        await buySkinColor(item.id)
      } else {
        await buyColor(item.id)
      }
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
            Purchase new color
          </span>
          <div
            onClick={onClose}
            className="ml-auto flex items-center justify-center text-gray-400
            hover:text-gray-600 flex-shrink-0 cursor-pointer">
            <FaRegCircleXmark className='text-2xl' />
          </div>
        </div>

        {/* Color preview */}
        <div className="flex justify-center items-center my-6">
          <div
            className="w-32 h-32 rounded-full shadow-md"
            style={{ backgroundColor: bg }}
          />
        </div>

        {/* Item info */}
        <div className="text-sm mb-4 py-3 border-t-2 border-b-2">
          {item.code && (
            <div className="font-semibold">
              Color code: <span className="text-[#3DB1FF]">#{item.code}</span>
            </div>
          )}
          {!isSkin && item.hex && (
            <div className="font-semibold">
              Hex: <span className="text-[#3DB1FF]">{item.hex}</span>
            </div>
          )}
          {item.price != null && (
            <div className="font-semibold">
              Color price: <span className="text-[#3DB1FF]">{item.price} $MC</span>
            </div>
          )}
        </div>

        <div className='text-gray-500 text-sm pb-3'>
          {coinBalance != null && (
            <div className="font-semibold flex justify-between">
              <div>Your balance:</div>
              <div className="text-[#3DB1FF]">{coinBalance} $MC</div>
            </div>
          )}
          {coinBalance != null && item.price != null && (
            <div className="font-semibold flex justify-between">
              <div>Balance after purchase:</div>
              <div className="text-gray-500">{coinBalance - item.price} $MC</div>
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

export default BuyColorModal
