import React, { useEffect, useMemo, useState } from 'react'
import { FaCircleInfo } from "react-icons/fa6";
import { getMyAvatar, getMyColors, getMyItems, updateAvatar } from '../../../api/avatar.api';
import { AvatarRenderer } from './AvatarRenderer';
import { AvatarSections } from './AvatarSections';
import { SelectItem } from './SelectItem';
import { SelectColor } from './SelectColor';


const EMPTY_ITEMS_BY_TYPE = {
  FACE: [],
  HAIR: [],
  SHIRT: [],
  PANTS: [],
  SHOES: [],
  ACCESSORY: []
};

const FIELD_BY_TYPE = {
  FACE: 'face_item',
  HAIR: 'hair_item',
  SHIRT: 'shirt_item',
  PANTS: 'pants_item',
  SHOES: 'shoes_item',
  ACCESSORY: 'accessory_item',
}

const COLOR_FIELD_BY_SECTION = {
  HAIR: 'hair_color',
  SHIRT: 'shirt_color',
  PANTS: 'pants_color',
  SHOES: 'shoes_color',
};

const SELECTED_COLOR_BY_SECTION = {
  GENDER: (a) => a?.skin_color?.main_color ?? null,
  HAIR: (a) => a?.hair_color.hex ?? null,
  SHIRT: (a) => a?.shirt_color.hex ?? null,
  PANTS: (a) => a?.pants_color.hex ?? null,
  SHOES: (a) => a?.shoes_color.hex ?? null,
};

const pickFirstByGender = (arr = [], gender) =>
  (arr || []).find(it => it.gender === gender) || (arr || [])[0] || null;

export function Details() {
  const [avatar, setAvatar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [itemsByType, setItemsByType] = useState(EMPTY_ITEMS_BY_TYPE)
  const [skinColors, setSkinColors] = useState([])
  const [itemColors, setItemColors] = useState([])
  const [itemsLoading, setItemsLoading] = useState(true)
  const [updateStatus, setUpdateStatus] = useState(null);

  const [activeSection, setActiveSection] = useState('GENDER')
  const [activeAvatarType, setActiveAvatarType] = useState('BOY')

  const renderAvatar = useMemo(() => avatar, [avatar]);
  const selectedSvgByType = useMemo(() => {
    if (!renderAvatar) return {}
    const out = {}
    for (const [TYPE, field] of Object.entries(FIELD_BY_TYPE)) {
      out[TYPE] = renderAvatar[field] ?? null
    }
    return out
  }, [renderAvatar])


  const handleSelectItem = (type, itemSvg) => {
    const field = FIELD_BY_TYPE[type];
    if (!field) return;
    setAvatar(prev => prev ? ({ ...prev, [field]: itemSvg }) : prev);
  };

  const buildDefaultsFromItems = (gender, itemsByType) => ({
    FACE: pickFirstByGender(itemsByType.FACE, gender),
    HAIR: pickFirstByGender(itemsByType.HAIR, gender),
    SHIRT: pickFirstByGender(itemsByType.SHIRT, gender),
    PANTS: pickFirstByGender(itemsByType.PANTS, gender),
    SHOES: pickFirstByGender(itemsByType.SHOES, gender),
    ACCESSORY: null,
  });

  const handleChangeGender = (newGender) => {
    if (!avatar || newGender === avatar.avatar_type) return;
    const defaults = buildDefaultsFromItems(newGender, itemsByType);
    setAvatar(prev => ({
      ...prev,
      avatar_type: newGender,
      [FIELD_BY_TYPE.FACE]: defaults.FACE,
      [FIELD_BY_TYPE.HAIR]: defaults.HAIR,
      [FIELD_BY_TYPE.SHIRT]: defaults.SHIRT,
      [FIELD_BY_TYPE.PANTS]: defaults.PANTS,
      [FIELD_BY_TYPE.SHOES]: defaults.SHOES,
      [FIELD_BY_TYPE.ACCESSORY]: null,
    }));

    setActiveAvatarType(newGender);
  };

  const selectedColorHex = useMemo(() => {
    const picker = SELECTED_COLOR_BY_SECTION[activeSection];
    
    return picker && avatar ? picker(avatar) : null;
  }, [activeSection, avatar]);

  const handlePickColor = (payload) => {
    if (!avatar) return;

    if (activeSection === 'GENDER') {
      setAvatar(prev => ({
        ...prev,
        skin_color: {
          main_color: payload.main_color,
          second_color: payload.second_color,
          id: payload.id
        },
      }));
      return;
    }

    const field = COLOR_FIELD_BY_SECTION[activeSection];
    
    if (field && payload) {
      setAvatar(prev => ({ ...prev, [field]: payload }));
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      try {
        const [avatarRes, itemsRes, colorsRes] = await Promise.all([
          getMyAvatar(),
          getMyItems(),
          getMyColors(),
        ])

        setAvatar(avatarRes.data)
        setActiveAvatarType(avatarRes.data.avatar_type)
        setItemsByType(itemsRes.data)
        setSkinColors(colorsRes.data.skin_colors)
        setItemColors(colorsRes.data.item_colors)
      } catch (error) {
        console.error('Error fetching avatar/items:', error)
      } finally {
        setLoading(false)
        setItemsLoading(false)
      }
    }
    fetchAll()
  }, [])

  const handleUpdateAvatar = async () => {
    if (!avatar) return;
    const payload = {
      avatar_type: avatar.avatar_type,
      skin_color: avatar.skin_color?.id,
      face_item: avatar.face_item?.id,
      hair_item: avatar.hair_item?.id,
      hair_color: avatar.hair_color?.id,
      shirt_item: avatar.shirt_item?.id,
      shirt_color: avatar.shirt_color?.id,
      pants_item: avatar.pants_item?.id,
      pants_color: avatar.pants_color?.id,
      shoes_item: avatar.shoes_item?.id,
      shoes_color: avatar.shoes_color?.id,
      accessory_item: avatar.accessory_item?.id ?? null,
      accessory_color: avatar.accessory_color?.id ?? null,
      eyes_color: avatar.eyes_color?.id,
    };

    try {
      await updateAvatar(avatar.id, payload);
      setUpdateStatus("success");
    } catch (error) {
      console.error("❌ Error actualizando avatar:", error);
      setUpdateStatus("error");
    }
  };

  useEffect(() => {
    if (updateStatus) {
      const timer = setTimeout(() => {
        setUpdateStatus(null);
      }, 7000);

      return () => clearTimeout(timer);
    }
  }, [updateStatus]);

  return (
    <div className='bg-white rounded border p-3 shadow'>
      <div className='font-semibold text-lg pb-3 md:pb-4 flex items-center'>
        My avatar
        <span className='ps-2'><FaCircleInfo className='text-sm text-gray-300' /></span>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3'>
        <div className='md:col-span-1 bg-gray-50 rounded-lg md:me-4'>
          <div className='py-3 md:py-6 px-2 flex justify-center'>
            {loading ? (
              <span className="text-gray-400">Loading avatar...</span>
            ) : renderAvatar ? (
              <AvatarRenderer avatar={renderAvatar} />
            ) : (
              <span className="text-gray-400">No avatar found.</span>
            )}
          </div>
        </div>
        <div className='md:col-span-2 flex flex-col'>
          <div className='mb-3 md:mb-4 flex-grow bg-gray-50 rounded-lg mt-3 md:mt-0'>
            <SelectItem
              itemsByType={itemsByType}
              itemsLoading={itemsLoading}
              activeSection={activeSection}
              activeAvatarType={activeAvatarType}
              setActiveAvatarType={handleChangeGender}
              selectedSvgByType={selectedSvgByType}
              onSelectItem={handleSelectItem}
            />
          </div>
          <SelectColor
            section={activeSection}
            skinColors={skinColors}
            itemColors={itemColors}
            selectedHex={selectedColorHex}
            onPick={handlePickColor} />
        </div>
      </div>
      <div className='py-1 border-b '>
        <AvatarSections activeSection={activeSection} onChange={setActiveSection} />
      </div>
      <div className='flex flex-col md:flex-row md:justify-between px-3 md:px-6 md:items-center my-3'>
        <div className='text-gray-500 pb-3 md:pb-0'>
          <div className='text-lg'>
            You're an: <span className='font-semibold text-[#3DB1FF]'>Apprentice Hero</span>
          </div>
          <div className='text-gray-500 text-sm'>
            You have collected: <span className='font-semibold text-[#3DB1FF]'>0 $MC</span> [Mixelo Coins]
          </div>
        </div>
        <div className='flex flex-col items-end'>
          <div
            className='rounded-full px-6 py-2 bg-[#3DB1FF] text-white cursor-pointer'
            onClick={handleUpdateAvatar}>
            UPDATE YOUR AVATAR
          </div>
          {updateStatus === "success" && (
            <div className="text-green-600 font-medium text-center">
              Avatar updated successfully
            </div>
          )}
          {updateStatus === "error" && (
            <div className="text-red-600 font-medium text-center">
              Update failed
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
