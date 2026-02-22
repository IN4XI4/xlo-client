import React, { useEffect, useState, useLayoutEffect, useRef, useMemo } from 'react'

import AliceSvg from "../../../assets/items/Girl-Type-Alice.svg";
import AlexSvg from "../../../assets/items/Boy-Type-Alex.svg";
import BuyIconSvg from "../../../assets/BuyIcon.svg";
import BuyItemModal from './BuyItemModal';

const modules = import.meta.glob(
  '../../illustrations/items/**/*.{jsx,js}',
  { eager: false }
)

export function ItemThumb({ Comp }) {
  const svgRef = useRef(null)

  useLayoutEffect(() => {
    const svg = svgRef.current
    if (!svg) return
    const wrap = svg.querySelector('#__wrap')
    if (wrap && wrap.getBBox) {
      const { x, y, width, height } = wrap.getBBox()
      svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`)
      svg.removeAttribute('width')
      svg.removeAttribute('height')
    }
  }, [Comp])

  return (
    <svg ref={svgRef} className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
      <g id="__wrap">
        <Comp />
      </g>
    </svg>
  )
}

const getComponent = async (path) => {
  const matchedKey = Object.keys(modules).find(key =>
    key.endsWith(`/items/${path}`)
  )
  if (!matchedKey) return null
  const mod = await modules[matchedKey]()
  return mod.default || Object.values(mod)[0]
}

const TYPE_FOLDER = {
  FACE: 'face',
  HAIR: 'hair',
  SHIRT: 'shirt',
  PANTS: 'pants',
  SHOES: 'shoes',
  ACCESSORY: 'accessory',
}

export function SelectItem({ itemsByType, itemsLoading, activeSection, activeAvatarType, setActiveAvatarType,
  selectedSvgByType, onSelectItem, onBuySuccess, coinBalance }) {
  const [components, setComponents] = useState({})
  const [buyModalData, setBuyModalData] = useState(null)

  const type = ['FACE', 'HAIR', 'SHIRT', 'PANTS', 'SHOES', 'ACCESSORY'].includes(activeSection)
    ? activeSection
    : 'FACE'

  const folder = TYPE_FOLDER[type]
  const rawList = itemsByType?.[type] || []

  const list = useMemo(() => {
    if (!activeAvatarType) return []
    return rawList.filter(item => item.gender === activeAvatarType)
  }, [rawList, activeAvatarType])

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      const entries = await Promise.all(
        list.map(async (item) => {
          const path = `${folder}/${item.svg}`
          try {
            const Comp = await getComponent(path)
            return [item.code, Comp]
          } catch {
            return [item.code, null]
          }
        })
      )
      if (!cancelled) {
        const map = Object.fromEntries(entries)
        setComponents(map)
      }
    }
    setComponents({})
    if (list.length) load()
    return () => { cancelled = true }
  }, [folder, list])

  if (itemsLoading) {
    return <div className="p-3 text-gray-400">Loading items...</div>
  }
  if (!itemsByType) {
    return <div className="p-3 text-gray-400">No items found.</div>
  }

  if (activeSection === 'GENDER') {
    const genders = [
      { key: 'BOY', Icon: AlexSvg },
      { key: 'GIRL', Icon: AliceSvg },
    ]
    return (
      <div className="p-3">
        <div className="grid grid-cols-4 gap-4">
          {genders.map(({ key, Icon }) => {
            const active = activeAvatarType === key
            return (
              <div
                key={key}
                role="button"
                tabIndex={0}
                onClick={() => setActiveAvatarType?.(key)}
                onKeyDown={(e) => ((e.key === 'Enter' || e.key === ' ') && setActiveAvatarType?.(key))}
                className={`rounded-3xl p-3 flex items-center justify-center cursor-pointer bg-[#D8EFFF]
                  ${active ? 'ring-2 ring-blue-500 border-blue-500' : 'hover:shadow'}`}
              >
                <img src={Icon} alt="gender" className="w-18 h-32 md:h-40" />
              </div>
            )
          })}
        </div>
      </div>
    )
  }

  if (activeSection === 'SHOP') {
    return (
      <div className="p-3">
        <div className="text-gray-400">Coming soon!</div>
      </div>
    )
  }

  const currentSvg = selectedSvgByType?.[type] ?? null

  return (
    <div className="p-3">
      <div className="grid grid-cols-4 gap-4">
        {list.map(item => {
          const Comp = components[item.code]
          const isOwned = item.owned !== false // Por defecto true si no está definido
          const isSelected = currentSvg && item.svg === currentSvg.svg

          const handleClick = () => {
            if (isOwned) {
              onSelectItem?.(type, item)
            } else {
              setBuyModalData({ item, Comp })
            }
          }
          const handleKeyDown = (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              handleClick()
            }
          }

          return (
            <div key={item.code} className="relative">
              {!isOwned && (
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div className="w-10 h-10 rounded-full bg-[#3DB1FF] flex items-center justify-center">
                    <img src={BuyIconSvg} alt="Buy item" className="w-5 h-5" />
                  </div>
                </div>
              )}
              <div
                tabIndex={0}
                onClick={handleClick}
                onKeyDown={handleKeyDown}
                className={`rounded-3xl p-3 bg-[#D8EFFF] cursor-pointer
                  ${isOwned ? '' : 'opacity-30'}
                  ${isSelected ? 'ring-2 ring-[#3DB1FF] border-[#3DB1FF]' : 'hover:shadow'}`}
                aria-selected={isSelected}
                aria-disabled={!isOwned}>
                <div className="w-full aspect-[575/890] h-24 md:h-40">
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
              </div>
            </div>
          )
        })}
      </div>
      {list.length === 0 && (
        <div className="text-xs text-gray-400 mt-2">No items in {type}.</div>
      )}
      {buyModalData && (
        <BuyItemModal
          item={buyModalData.item}
          Comp={buyModalData.Comp}
          coinBalance={coinBalance}
          onClose={() => setBuyModalData(null)}
          onSuccess={() => { setBuyModalData(null); onBuySuccess?.() }}
        />
      )}
    </div>
  )
}
