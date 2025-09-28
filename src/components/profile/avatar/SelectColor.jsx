import React from 'react'

const NO_COLOR_SECTIONS = new Set(['FACE', 'ACCESSORY', 'SHOP'])

export function SelectColor({ section, skinColors = [], itemColors = [], selectedHex, onPick }) {
  if (NO_COLOR_SECTIONS.has(section)) return null
  
  const useSkin = section === 'GENDER'
  
  const palette = useSkin
    ? skinColors.map(({ main_color, second_color, code, id }) => ({
      key: code || main_color,
      bg: main_color,
      isSelected: selectedHex && selectedHex === main_color,
      payload: { main_color, second_color, id },
    }))
    : itemColors.map(({ hex, code, id }) => ({
      key: code || hex,
      bg: hex,
      isSelected: selectedHex && selectedHex === hex,
      payload: { hex: hex, id: id },
    }))

  if (!palette.length) return null

  const sel = selectedHex ?? null

  return (
    <div className="px-3 py-3 bg-gray-50 rounded-lg">
      <div className="grid grid-cols-6 md:grid-cols-10 gap-3">
        {palette.map(({ key, bg, isSelected, payload }) => {
          return (
            <div
              key={key}
              onClick={() => onPick?.(payload)}
              className={`h-8 w-8 rounded-full cursor-pointer  ${isSelected ? 'border-4 border-[#3DB1FF]' : ''}`}
              style={{ backgroundColor: bg }}
            />
          )
        })}
      </div>
    </div>
  )
}
