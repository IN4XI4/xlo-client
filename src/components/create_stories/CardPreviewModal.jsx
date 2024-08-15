import React, { useEffect, useState } from 'react'
import MarkdownRenderer from '../MardownRenderer';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";


export function CardPreviewModal({ onClose, card }) {
  const [isOpen, setIsOpen] = useState(true);
  const [blocks, setBlocks] = useState(null);
  const [activeActionIconsIndex, setActiveActionIconsIndex] = useState(null);
  console.log("card", card);

  useEffect(() => {
    if (card.blocks && card.blocks.length > 0) {
      setBlocks(card.blocks);
      console.log("blocks", card.blocks);

    }
  }, [card.blocks]);

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleToggleActionIcons = (index) => {
    setActiveActionIconsIndex(activeActionIconsIndex === index ? null : index);
  };

  const getImageUrl = (imageFileList) => {
    if (imageFileList && imageFileList.length > 0) {
      return URL.createObjectURL(imageFileList[0]);
    }
    return null;
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={onClose}>
      <div className="mt-24 mx-auto border w-5/6 shadow-lg rounded-md bg-white p-3" onClick={handleModalClick}>
        <div>
          <div className='text-2xl text-gray-500'>{card.cardTitle}</div>
          <div className='bg-white rounded-md border py-4 px-2 my-4'>
            {blocks && card.blocks && card.blocks.length > 0 && blocks.map((block, index) => (
              <div key={index} className='py-4'>
                {block.blockType === "ATTACK" ? (
                  <div className='pb-1 flex justify-end items-center'>
                    <div className='text-end text-sm md:text-base'>
                      <div className='font-bold'>{block.soft_skill_monster_name}</div>
                      <div className='text-gray-500'>{block.soft_skill_name}</div>
                    </div>
                    <div className=''>
                      {block.soft_skill_monster_picture ? (
                        <img src={block.soft_skill_monster_picture} alt="Monster"
                          className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
                          style={{ borderColor: block.soft_skill_color }}
                          onClick={() => openModal(
                            {
                              image: block.soft_skill_monster_picture,
                              name: block.soft_skill_monster_name,
                              profile: block.soft_skill_monster_profile,
                              color: block.soft_skill_color,
                              soft_skill_name: block.soft_skill_name,
                              soft_skill_description: block.soft_skill_description,
                              soft_skill_logo: block.soft_skill_logo,
                              isMonster: true
                            }
                          )} />
                      ) : (<div></div>)}
                    </div>
                  </div>
                ) : block.block_type_name === "DEFENSE" ? (
                  <div className='pb-1 flex items-center'>
                    <div className=''>
                      {block.mentor_picture ? (
                        <img src={block.mentor_picture} alt="Mentor"
                          className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
                          onClick={() => openModal(
                            {
                              image: block.mentor_picture,
                              name: block.mentor_name,
                              job: block.mentor_job,
                              profile: block.mentor_profile,
                              color: block.mentor_color,
                              isMonster: false
                            }
                          )}
                          style={{ borderColor: block.mentor_color }} />
                      ) : <></>}
                    </div>
                    <div className='text-sm md:text-base'>
                      <div className='font-bold'>{block.mentor_name}</div>
                      <div className='text-gray-500'>{block.mentor_job}</div>
                    </div>
                  </div>
                ) : (<></>)}
                <div className={`flex items-center ${block.block_type_name === "DEFENSE" ? "ps-10" : ""}`}>
                  <div className='flex-grow bg-gray-50 rounded-2xl border-[4px] px-4 py-6'
                    style={{
                      borderColor:
                        block.block_type_name === "DEFENSE"
                          ? (block.mentor_color || "#3DB1FF")
                          : (block.soft_skill_color || "#3DB1FF")
                    }}>
                    <div className=''> <MarkdownRenderer content={block.content} /></div>
                    {block.image ?
                      <div className="my-4 pt-4 flex justify-center border-t-2">
                        <div><img className='rounded-lg md:max-h-[500px]' src={getImageUrl(block.image)}  alt="" /></div>
                      </div>
                      : <div></div>}

                  </div>
                  <div>
                    <div className='flex items-center'>
                      {activeActionIconsIndex === index ?
                        <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={() => handleToggleActionIcons(index)} /> :
                        <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500 px-0" onClick={() => handleToggleActionIcons(index)} />}
                    </div>
                  </div>
                </div>
                {activeActionIconsIndex === index &&
                  <div>
                    Action icons
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}