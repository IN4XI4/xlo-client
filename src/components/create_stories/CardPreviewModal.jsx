import React, { useEffect, useState } from 'react'
import MarkdownRenderer from '../MardownRenderer';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import { FaXmark } from "react-icons/fa6";
import { FaRegBookmark, FaRegCopy, FaRegHeart, FaReply } from 'react-icons/fa';
import { getMentor, getSoftSkill } from '../../api/base.api';
import { MonsterMentorProfileModal } from '../topics/MonsterMentorProfileModal';
import { BLOCK_TYPES } from '../../globals';


export function CardPreviewModal({ onClose, card }) {
  const [isOpen, setIsOpen] = useState(true);
  const [blocks, setBlocks] = useState(null);
  const [activeActionIconsIndex, setActiveActionIconsIndex] = useState(null);
  const [softSkill, setSoftSkill] = useState(null);
  const [mentor, setMentor] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});

  useEffect(() => {
    if (card.blocks && card.blocks.length > 0) {
      setBlocks(card.blocks);
    }

    const fetchData = async () => {
      try {

        if (card.selectedSoftSkill) {
          const softSkillResponse = await getSoftSkill(card.selectedSoftSkill);
          setSoftSkill(softSkillResponse.data);
        }

        if (card.selectedMentor) {
          const mentorResponse = await getMentor(card.selectedMentor);
          setMentor(mentorResponse.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [card]);


  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
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

  const getBlockTypeName = (blockTypeId) => {
    return BLOCK_TYPES[blockTypeId] || "STANDARD";
  };

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    event.stopPropagation();
    setIsModalOpen(false);
  };

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full" onClick={handleBackdropClick}>
      <div className="mt-24 mx-auto border w-11/12 md:w-5/6 shadow-lg rounded-md bg-white p-3" onClick={handleModalClick}>
        <div>
          <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onClose}>
            <FaXmark className='text-2xl' />
          </div>
          <div className='text-2xl text-gray-500'>{card.cardTitle}</div>
          <div className='bg-white rounded-md border py-4 px-2 my-4'>
            {blocks && card.blocks && card.blocks.length > 0 && softSkill && mentor && blocks.map((block, index) => (
              <div key={index} className='py-4'>
                {getBlockTypeName(block.blockType) === "MONSTER" ? (
                  <div className='pb-1 flex justify-end items-center'>
                    <div className='text-end text-sm md:text-base'>
                      <div className='font-bold'>{softSkill.monster_name}</div>
                      <div className='text-gray-500'>{softSkill.name}</div>
                    </div>
                    <div className='flex-none'>
                      {softSkill.monster_picture ? (
                        <img src={softSkill.monster_picture} alt="Monster"
                          className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
                          style={{ borderColor: softSkill.color }}
                          onClick={() => openModal(
                            {
                              image: softSkill.monster_picture,
                              name: softSkill.monster_name,
                              profile: softSkill.monster_profile,
                              color: softSkill.color,
                              soft_skill_name: softSkill.name,
                              soft_skill_description: softSkill.description,
                              soft_skill_logo: softSkill.logo,
                              isMonster: true
                            }
                          )} />
                      ) : (<div></div>)}
                    </div>
                  </div>
                ) : getBlockTypeName(block.blockType) === "MENTOR" ? (
                  <div className='pb-1 flex items-center'>
                    <div className=''>
                      {mentor.picture ? (
                        <img src={mentor.picture} alt="Mentor"
                          className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
                          onClick={() => openModal(
                            {
                              image: mentor.picture,
                              name: mentor.name,
                              job: mentor.job,
                              profile: mentor.profile,
                              color: mentor.color,
                              isMonster: false
                            }
                          )}
                          style={{ borderColor: mentor.color }} />
                      ) : <></>}
                    </div>
                    <div className='text-sm md:text-base'>
                      <div className='font-bold'>{mentor.name}</div>
                      <div className='text-gray-500'>{mentor.job}</div>
                    </div>
                  </div>

                ) : (<></>)}
                <div className={`flex items-center ${getBlockTypeName(block.blockType) === "MENTOR" ? "ps-10" : ""}
                ${getBlockTypeName(block.blockType) === "MONSTER" ? "pe-4 md:pe-10" : ""}`}>
                  <div className={`flex-grow bg-gray-50 rounded-2xl border-[4px] px-4 py-4
                  ${getBlockTypeName(block.blockType) === "MENTOR" ? "rounded-tl-none" : ""}
                  ${getBlockTypeName(block.blockType) === "MONSTER" ? "rounded-tr-none" : ""}`}
                    style={{
                      borderColor:
                        getBlockTypeName(block.blockType) === "MENTOR"
                          ? (mentor.color || "#3DB1FF")
                          : (softSkill.color || "#3DB1FF")
                    }}>
                    <div className=''> <MarkdownRenderer content={block.content} /></div>
                    {block.image && (typeof block.image === 'string' || block.image.length > 0) ?
                      <div className="my-4 pt-4 flex justify-center border-t-2">
                        <div>
                          <img className='rounded-lg md:max-h-[500px]'
                            src={typeof block.image === 'string' ? block.image : getImageUrl(block.image)} alt="" />
                        </div>
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
                  <div className={`${getBlockTypeName(block.blockType) === "MONSTER" ? "pe-4 md:pe-10" : ""}`}>
                    <div className='flex text-gray-500 space-x-1 py-1 text-lg justify-end pe-6'>
                      <FaRegCopy className='cursor-pointer' />
                      <FaRegBookmark className='cursor-pointer' />
                      <FaRegHeart className='cursor-pointer' />
                      <FaReply className='cursor-pointer' />
                    </div>
                  </div>
                }
              </div>
            ))}
          </div>
        </div>
      </div>
      {isModalOpen && <MonsterMentorProfileModal
        image={modalData.image}
        name={modalData.name}
        job={modalData.job}
        profile={modalData.profile}
        color={modalData.color}
        onClose={closeModal}
        soft_skill_name={modalData.soft_skill_name}
        soft_skill_description={modalData.soft_skill_description}
        soft_skill_logo={modalData.soft_skill_logo}
        isMonster={modalData.isMonster}
        isPreview={true}
      />}
    </div>
  )
}