import React, { useState } from 'react'
import BuyIconSvg from "../../../assets/BuyIcon.svg"
import BuyColorModal from './BuyColorModal'

const NO_COLOR_SECTIONS = new Set(['FACE', 'ACCESSORY', 'SHOP'])

export function SelectColor({ section, skinColors = [], itemColors = [], selectedHex, onPick, coinBalance, onBuySuccess }) {
  const [buyModalData, setBuyModalData] = useState(null)

  if (NO_COLOR_SECTIONS.has(section)) return null

  const useSkin = section === 'GENDER'

  const palette = useSkin
    ? skinColors.map(({ main_color, second_color, code, id, owned, price, unlocked_item_id }) => ({
      key: code || main_color,
      bg: main_color,
      isSelected: selectedHex && selectedHex === main_color,
      owned: owned !== false,
      payload: { main_color, second_color, id, unlocked_item_id },
      item: { id, code, price, main_color, second_color },
    }))
    : itemColors.map(({ hex, code, id, owned, price, unlocked_item_id }) => ({
      key: code || hex,
      bg: hex,
      isSelected: selectedHex && selectedHex === hex,
      owned: owned !== false,
      payload: { hex, id, unlocked_item_id },
      item: { id, code, price, hex },
    }))

  if (!palette.length) return null

  return (
    <div className="px-3 py-3 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-6 md:grid-cols-10 gap-3">
        {palette.map(({ key, bg, isSelected, owned, payload, item }) => {
          const handleClick = () => {
            if (owned) {
              onPick?.(payload)
            } else {
              setBuyModalData({ bg, item })
            }
          }

          return (
            <div key={key} className="relative w-8 h-8">
              {!owned && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center">
                    <img src={BuyIconSvg} alt="Buy" className="w-3 h-3" />
                  </div>
                </div>
              )}
              <div
                onClick={handleClick}
                className={`h-8 w-8 rounded-full cursor-pointer
                  ${owned ? '' : 'opacity-50'}
                  ${isSelected ? 'border-4 border-[#3DB1FF]' : ''}`}
                style={{ backgroundColor: bg }}
              />
            </div>
          )
        })}
      </div>
      {buyModalData && (
        <BuyColorModal
          bg={buyModalData.bg}
          item={buyModalData.item}
          isSkin={useSkin}
          coinBalance={coinBalance}
          onClose={() => setBuyModalData(null)}
          onSuccess={() => { setBuyModalData(null); onBuySuccess?.() }}
        />
      )}
    </div>
  )
}
