import React, { useEffect, useState } from 'react'
import { deleteLike, deleteRecallBlock, getBlock, getMyRecallBlocksFocused, likeSomething } from '../api/blog.api';
import { FaBookmark, FaRegTimesCircle } from 'react-icons/fa';
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from 'react-icons/hi2';
import { useLocation, useNavigate } from 'react-router-dom';
import { ActionIcons } from '../components/topics/ActionIcons';
import { BsDot, BsThreeDotsVertical } from "react-icons/bs";
import { MonsterMentorProfileModal } from '../components/topics/MonsterMentorProfileModal';
import MarkdownRenderer from '../components/MardownRenderer';


export function FocusedRecallBlocksPage() {
  const [recallBlocks, setRecallBlocks] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blockContentTypeId, setBlockContentTypeId] = useState(null);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [error, setError] = useState(null);
  const [isBlockLoaded, setIsBlockLoaded] = useState(false);
  const [isBlocksLoaded, setIsBlocksLoaded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    loadRecallBlocks();
  }, []);


  useEffect(() => {
    if (recallBlocks.length > 0) {
      loadBlock(recallBlocks[currentIndex]);
    }
  }, [currentIndex, recallBlocks]);

  async function loadRecallBlocks() {
    try {
      const res = await getMyRecallBlocksFocused();
      setIsBlocksLoaded(true)
      setRecallBlocks(res.data.block_ids);
      setBlockContentTypeId(res.data.block_content_type)
    } catch (error) {
      setError(error);
    }
  }

  async function loadBlock(blockId) {
    try {
      const res = await getBlock(blockId);
      setCurrentBlock(res.data);
      setIsBlockLoaded(true);
    } catch (error) {
      setError(error);
    }
  }

  const goToPreviousBlock = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      window.scrollTo(0, 0);
      setShowActionIcons(false)
    }
  };

  const goToNextBlock = async () => {
    if (currentIndex < recallBlocks.length - 1) {
      setCurrentIndex(currentIndex + 1);
      window.scrollTo(0, 0);
      setShowActionIcons(false)
    }
  };

  const handleBackClick = () => {
    if (location.state?.fromNavigation) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  const handleBookmarkClick = async () => {
    const currentRecallIndex = recallBlocks[currentIndex]
    const currentRecallBlockId = currentBlock.user_has_recalled.recall_id
    try {
      const res_delete = await deleteRecallBlock(currentRecallBlockId)
      if (!res_delete && res_delete.status != 204) {
        console.error('Did not delete recall.');
      }
      else {
        const updatedRecallBlocks = recallBlocks.filter((id) => id !== currentRecallIndex);
        setRecallBlocks(updatedRecallBlocks);
        setShowActionIcons(false)
        if (currentIndex >= updatedRecallBlocks.length) {
          setCurrentIndex(updatedRecallBlocks.length - 1);
        }
      }
    } catch {
      setError(error);
    }
  }

  const openModal = (data) => {
    setModalData(data);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  // ACTION ICONS
  const handleToggleActionIcons = () => {
    setShowActionIcons(!showActionIcons);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(currentBlock.content)
      .then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 5000);
      })
      .catch((error) => {
        console.error('Error copying content to clipboard', error);
      });
  };

  const handleLikeClick = async (blockId, userHasLiked) => {
    try {
      if (typeof userHasLiked === 'number') {
        await deleteLike(userHasLiked);
        updateBlockLikeState(blockId, false);
      } else {
        const data = {
          liked: true,
          content_type: blockContentTypeId,
          object_id: blockId,
          is_active: true
        };
        const response = await likeSomething(data);
        updateBlockLikeState(blockId, response.data.id);
      }
    } catch (error) {
      console.error("Error processing like/unlike:", error);
    }
  };

  const updateBlockLikeState = (blockId, likeState) => {
    setCurrentBlock((prevBlock) => {
      if (prevBlock.id === blockId) {
        return { ...prevBlock, user_has_liked: likeState };
      }
      return prevBlock;
    });
  };

  return (
    <div className='pb-20 pt-24 md:pt-28 px-4 md:px-16 lg:px-32 xl:px-44'>
      {!isBlocksLoaded ? (
        <div>Loading...</div>) : recallBlocks.length === 0 ? (
          <div className='text-2xl text-gray-500'>You have no recall cards.</div>
        ) : !isBlockLoaded ? (
          <div>Loading block...</div>
        ) : (
        <div>
          <div className='font-semibold text-2xl'>{currentBlock.story_title}</div>
          <div className='text-2xl text-gray-500'>{currentBlock.card_title}</div>
          <div className='bg-white rounded-md border py-4 px-2 my-4'>
            {currentBlock.block_type_name === "ATTACK" ? (
              <div className='pb-1 flex justify-end items-center'>
                <div className='text-end text-sm md:text-base'>
                  <div className='font-bold'>{currentBlock.soft_skill_monster_name}</div>
                  <div className='text-gray-500'>{currentBlock.soft_skill_name}</div>
                </div>
                <div className=''>
                  {currentBlock.soft_skill_monster_picture ? (
                    <img src={currentBlock.soft_skill_monster_picture} alt="Monster"
                      className="h-10 w-10 md:h-14 md:w-14 rounded-full ms-2 border-[3px] cursor-pointer"
                      style={{ borderColor: currentBlock.soft_skill_color }}
                      onClick={() => openModal(
                        {
                          image: currentBlock.soft_skill_monster_picture,
                          name: currentBlock.soft_skill_monster_name,
                          profile: currentBlock.soft_skill_monster_profile,
                          color: currentBlock.soft_skill_color,
                          soft_skill_name: currentBlock.soft_skill_name,
                          soft_skill_description: currentBlock.soft_skill_description,
                          soft_skill_logo: currentBlock.soft_skill_logo,
                          isMonster: true
                        }
                      )} />
                  ) : (<div></div>)}
                </div>
              </div>
            ) : currentBlock.block_type_name === "DEFENSE" ? (
              <div className='pb-1 flex items-center'>
                <div className=''>
                  {currentBlock.mentor_picture ? (
                    <img src={currentBlock.mentor_picture} alt="Mentor"
                      className="h-10 w-10 md:h-14 md:w-14 rounded-full me-2 border-[3px] cursor-pointer"
                      onClick={() => openModal(
                        {
                          image: currentBlock.mentor_picture,
                          name: currentBlock.mentor_name,
                          job: currentBlock.mentor_job,
                          profile: currentBlock.mentor_profile,
                          color: currentBlock.mentor_color,
                          isMonster: false
                        }
                      )}
                      style={{ borderColor: currentBlock.mentor_color }} />
                  ) : <></>}
                </div>
                <div className='text-sm md:text-base'>
                  <div className='font-bold'>{currentBlock.mentor_name}</div>
                  <div className='text-gray-500'>{currentBlock.mentor_job}</div>
                </div>
              </div>
            ) : (<></>)}
            <div className={`flex items-center ${currentBlock.block_type_name === "DEFENSE" ? "ps-10" : ""}`}>
              <div className='flex-grow bg-gray-50 rounded-2xl border-[4px] px-4 py-6'
                style={{
                  borderColor:
                    currentBlock.block_type_name === "DEFENSE"
                      ? (currentBlock.mentor_color || "#3DB1FF")
                      : (currentBlock.soft_skill_color || "#3DB1FF")
                }}>
                <div className=''> <MarkdownRenderer content={currentBlock.content} /></div>
                {currentBlock.image ? 
                <div className="my-4 pt-4 flex justify-center border-t-2">
                  <div><img className='rounded-lg md:max-h-[500px]' src={currentBlock.image} alt="" /></div>
                </div> 
                : <div></div>}
                
              </div>
              <div>
                <div className='flex items-center'>
                  {showActionIcons ?
                    <BsDot className="text-2xl cursor-pointer text-gray-500" onClick={handleToggleActionIcons} /> :
                    <BsThreeDotsVertical className="text-2xl cursor-pointer text-gray-500 px-0" onClick={handleToggleActionIcons} />}
                </div>
              </div>
            </div>
            {showActionIcons &&
              <ActionIcons hasLiked={currentBlock.user_has_liked}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)} isCopied={isCopied}
                copyToClipboard={copyToClipboard} userHasRecalled={currentBlock.user_has_recalled} block_id={currentBlock.id}
                onRecallUpdate={() => { }} hideBookmarkAndReply={true} />
            }
          </div>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 text-white text-center z-40">
        <div className='bg-[#0098FF] text-end px-4 text-sm'>
          Vous êtes en mode “Rappel”
        </div>
        <div className='bg-[#3DB1FF] px-4 flex py-1'>
          <div className='flex-none flex items-center w-1/4'>
            <FaBookmark className='cursor-pointer' onClick={handleBookmarkClick} />
            <span className="ml-2 font-thin text-sm">{recallBlocks.length} {recallBlocks.length === 1 ? 'block' : 'blocks'}</span>
          </div>
          <div className='flex-grow items-center flex justify-center space-x-4 w-1/2'>
            <div>
              <HiOutlineArrowLeftCircle className='text-4xl cursor-pointer' onClick={goToPreviousBlock} />
            </div>
            <div>
              <HiOutlineArrowRightCircle className='text-4xl cursor-pointer' onClick={goToNextBlock} />
            </div>
          </div>
          <div className='flex-none  flex items-center w-1/4 justify-end'>
            <FaRegTimesCircle className='text-xl cursor-pointer' onClick={handleBackClick} />
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
      />}
    </div>

  )
}
