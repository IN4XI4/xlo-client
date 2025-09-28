import React, { useEffect, useState } from 'react'

const modules = import.meta.glob(
  '../../illustrations/items/**/*.{jsx,js}',
  { eager: false }
)

const getComponent = async (path) => {

  const matchedKey = Object.keys(modules).find(key =>
    key.endsWith(`/items/${path}`)
  )

  if (!matchedKey) {
    console.warn(`❌ No se encontró el componente para: ${path}`)
    return null
  }
  const module = await modules[matchedKey]()
  return module.default || Object.values(module)[0]
}

export function AvatarRenderer({ avatar, size = "h-auto" }) {
  const [components, setComponents] = useState({})

  useEffect(() => {
    const loadComponents = async () => {
      const parts = {
        face_item: `face/${avatar.face_item.svg}`,
        hair_item: `hair/${avatar.hair_item.svg}`,
        shirt_item: `shirt/${avatar.shirt_item.svg}`,
        pants_item: `pants/${avatar.pants_item.svg}`,
        shoes_item: `shoes/${avatar.shoes_item.svg}`,
        accessory_item: avatar.accessory_item ? `accessory/${avatar.accessory_item.svg}` : null,
        body: `${avatar.avatar_type.toLowerCase()}_body.jsx`
      }

      const loaded = {}
      for (const [key, path] of Object.entries(parts)) {
        if (path) {
          try {
            const component = await getComponent(path)
            if (component) {
              loaded[key] = component
            } else {
              console.warn(`🧩 Missing component for ${key}: ${path}`)
            }
          } catch (err) {
            console.error(`Error loading ${key} from ${path}:`, err)
          }
        }
      }

      setComponents(loaded)
    }

    if (avatar) {
      loadComponents()
    }
  }, [avatar])

  if (!avatar || Object.keys(components).length === 0) return null

  const {
    body: Body,
    face_item: Face,
    hair_item: Hair,
    shirt_item: Shirt,
    pants_item: Pants,
    shoes_item: Shoes,
    accessory_item: Accessory
  } = components

  return (
    <div className={`w-full max-w-[200px] md:max-w-[300px] aspect-[575/890] ${size}`}>
      <svg viewBox="0 0 575 890" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <g id="Avatar-Root">
          {Body && (
            <Body
              main_color={avatar.skin_color?.main_color}
              second_color={avatar.skin_color?.second_color}
            />
          )}
          {Pants && <Pants color={avatar.pants_color?.hex} />}
          {Shirt && <Shirt color={avatar.shirt_color?.hex} />}
          {Face && <Face color={avatar.skin_color?.main_color.hex} />}
          {Hair && <Hair color={avatar.hair_color.hex} />}
          {Shoes && <Shoes color={avatar.shoes_color?.hex} />}
          {Accessory && <Accessory color={avatar.accessory_color?.hex} />}
        </g>
      </svg>
    </div >
  )
}
