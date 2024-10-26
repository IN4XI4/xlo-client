import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { FaRegCircle, FaDotCircle } from 'react-icons/fa';
import { TextInput } from 'flowbite-react';

import { getSpaceBySlug, updateSpace } from '../api/spaces.api';
import { CurrentSpaceBox } from '../components/spaces/CurrentSpaceBox';
import { CurrentSpaceBoxOwner } from '../components/spaces/CurrentSpaceBoxOwner';
import { SpaceMembersBox } from '../components/spaces/SpaceMembersBox';
import { SpaceInfoBox } from '../components/spaces/SpaceInfoBox';
import { SpacesManagerBox } from '../components/spaces/SpacesManagerBox';


export function SpacesPage() {
  const { slug } = useParams();
  const [spaceInfo, setSpaceInfo] = useState({});
  const [selectedSpaceColor, setSelectedSpaceColor] = useState(null);
  const [isOwner, setIsOwner] = useState(false);
  const [spaceColors, setSpaceColors] = useState([]);
  const [isSpaceLoaded, setIsSpaceLoaded] = useState(true);

  const currentSpaceColor = spaceColors.find(color => color.id === selectedSpaceColor)?.color || '#3DB1FF';

  useEffect(() => {
    loadSpace();
  }, [slug]);

  async function loadSpace() {
    if (slug) {
      try {
        setIsSpaceLoaded(false);
        const response = await getSpaceBySlug(slug);
        console.log("response space", response.data);
        setIsSpaceLoaded(true);
        setSpaceInfo(response.data);
        setSelectedSpaceColor(response.data.color);
        setIsOwner(response.data.is_owner);
      } catch (error) {
        console.error("Error fetching space by slug:", error);
      }
    } else {
      setSpaceInfo({});
      setSelectedSpaceColor(null);
      setIsOwner(false);
      setSpaceColors([]);
      setIsSpaceLoaded(true);
    }
  }

  const handleSpaceColorChange = async (colorId) => {
    if (colorId === selectedSpaceColor) {
      return;
    }
    setSelectedSpaceColor(colorId);
    if (!spaceInfo || !spaceInfo.id) {
      console.error("User ID is missing");
      return;
    }
    const spaceId = spaceInfo.id;
    const updatedInfo = { color: colorId };
    try {
      await updateSpace(spaceId, updatedInfo);
    } catch (error) {
      console.error("Error al actualizar el color de perfil:", error);
      setSelectedSpaceColor(spaceInfo.color);
    }
  };

  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-gray-900 font-bold text-2xl md:text-4xl pt-2 pb-6'>
        {spaceInfo.id ? `Welcome to ${spaceInfo.name} Space` : "Welcome to Mixelo Spaces"}
      </div>
      {isSpaceLoaded ? (
        <div>
          {isOwner ? (
            <div className='grid grid-cols-1 md:grid-cols-3'>
              <div className='md:pe-2'>
                <div>
                  <CurrentSpaceBoxOwner currentSpaceColor={currentSpaceColor} spaceInfo={spaceInfo} />
                  <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
                    <div className='font-bold pb-2 text-xl'>Select your space color</div>
                    <div className='flex justify-between'>
                      {spaceColors && spaceColors.map((color, index) => {
                        const isCurrentColor = color.id === selectedSpaceColor;
                        const Icon = isCurrentColor ? FaDotCircle : FaRegCircle;
                        return (
                          <Icon
                            key={index}
                            className='cursor-pointer'
                            style={{ color: color.color }}
                            onClick={() => handleSpaceColorChange(color.id)} />
                        );
                      })}
                    </div>
                  </div>
                  <div className='bg-white rounded px-3 py-4 border border-gray-100 mb-3'>
                    <div className='font-bold pb-2 text-xl'>Space ID</div>
                    <div className='flex space-x-2 items-center justify-between'>
                      <TextInput
                        id="space_id"
                        type="text"
                        value={spaceInfo.slug}
                        disabled
                      />
                      <button className='bg-[#3DB1FF] px-3 py-2 rounded-lg text-white'>
                        Invite People
                      </button>
                    </div>
                  </div>
                  <SpaceMembersBox spaceInfo={spaceInfo} />
                </div>
              </div>
              <div className='col-span-2 bg-white rounded border border-gray-100 mb-3 p-3'>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-1 md:grid-cols-2'>
              <div className='md:pe-2'>
                <CurrentSpaceBox currentSpaceColor={currentSpaceColor} spaceInfo={spaceInfo} />
              </div>
              <div>
                <SpaceMembersBox spaceInfo={spaceInfo} />
              </div>
            </div>
          )}
          <div className=''>
            <SpaceInfoBox spaceInfo={spaceInfo} />
          </div>
          <div className=''>
            <SpacesManagerBox />
          </div>
        </div>
      ) : (
        <div className='text-center text-gray-500 py-10'>
          No space found with the given identification.
        </div>
      )}

    </div>
  )
}
