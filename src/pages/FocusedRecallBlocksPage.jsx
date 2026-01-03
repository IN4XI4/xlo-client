import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import { FaBookmark, FaRegTimesCircle } from 'react-icons/fa';
import { HiOutlineArrowLeftCircle, HiOutlineArrowRightCircle } from 'react-icons/hi2';

import { MonsterBlock } from '../components/blocks/MonsterBlock';
import { MentorBlock } from '../components/blocks/MentorBlock';
import { StandardBlock } from '../components/blocks/StandardBlock';
import { HighlightBlock } from '../components/blocks/HighlightBlock';
import { TestimonialBlock } from '../components/blocks/TestimonialBlock';
import { HeroBlock } from '../components/blocks/HeroBlock';
import { QuoteBlock } from '../components/blocks/QuoteBlock';
import { deleteLike, deleteRecallBlock, getBlock, getMyRecallBlocksFocused, likeSomething } from '../api/blog.api';
import { WonderBlock } from '../components/blocks/WonderBlock';
import { FactBlock } from '../components/blocks/FactBlock';
import { FlashcardBlock } from '../components/blocks/FlashcardBlock';
import { ReflectionBlock } from '../components/blocks/ReflectionBlock';
import { QuestionBlock } from '../components/blocks/QuestionBlock';
import { IllustrationBlock } from '../components/blocks/IllustrationBlock';
import { MultiChoiceQuestionBlock } from '../components/blocks/MultiChoiceQuestionBlock';


export function FocusedRecallBlocksPage() {
  const [recallBlocks, setRecallBlocks] = useState([]);
  const [currentBlock, setCurrentBlock] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [blockContentTypeId, setBlockContentTypeId] = useState(null);
  const [showActionIcons, setShowActionIcons] = useState(false);
  const [error, setError] = useState(null);
  const [isBlockLoaded, setIsBlockLoaded] = useState(false);
  const [isBlocksLoaded, setIsBlocksLoaded] = useState(false);
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
    <div className='pb-20 pt-24 md:pt-28 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32'>
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
            {currentBlock.block_type_name === "MONSTER" ? (
              <MonsterBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                monster_image={currentBlock.soft_skill_monster_picture}
                monster_name={currentBlock.soft_skill_monster_name}
                monster_profile={currentBlock.soft_skill_monster_profile}
                soft_skill_name={currentBlock.soft_skill_name}
                soft_skill_description={currentBlock.soft_skill_description}
                soft_skill_logo={currentBlock.soft_skill_logo}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "MENTOR" ? (
              <MentorBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                mentor_image={currentBlock.mentor_picture}
                mentor_name={currentBlock.mentor_name}
                mentor_job={currentBlock.mentor_job}
                mentor_profile={currentBlock.mentor_profile}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "HERO" ? (
              <HeroBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                ownerAvatar={currentBlock.owner_picture}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "HIGHLIGHT" ? (
              <HighlightBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "QUOTE" ? (
              <QuoteBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                authorName={currentBlock.quoted_by}
                authorPicture={currentBlock.image_2}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "TESTIMONIAL" ? (
              <TestimonialBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                blockColor={currentBlock.block_color_string}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "WONDER" ? (
              <WonderBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                title={currentBlock.title}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "FACT" ? (
              <FactBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.mentor_color}
                contentClass={currentBlock.content_class}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "FLASHCARD" ? (
              <FlashcardBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                content2={currentBlock.content_2}
                image2={currentBlock.image_2}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "REFLECTION" ? (
              <ReflectionBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                content2={currentBlock.content_2}
                image2={currentBlock.image_2}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "QUESTION" ? (
              <QuestionBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                user_has_liked={currentBlock.user_has_liked}
                blockOptions={currentBlock.options}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "MULTICHOICE" ? (
              <MultiChoiceQuestionBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                user_has_liked={currentBlock.user_has_liked}
                blockOptions={currentBlock.options}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : currentBlock.block_type_name === "ILLUSTRATION" ? (
              <IllustrationBlock
                content={currentBlock.content}
                image={currentBlock.image}
                color={currentBlock.soft_skill_color}
                user_has_liked={currentBlock.user_has_liked}
                user_has_recalled={currentBlock.user_has_recalled}
                onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
                isRecall={true}
              />
            ) : (<StandardBlock
              content={currentBlock.content}
              image={currentBlock.image}
              color={currentBlock.soft_skill_color}
              user_has_liked={currentBlock.user_has_liked}
              user_has_recalled={currentBlock.user_has_recalled}
              onLikeClick={() => handleLikeClick(currentBlock.id, currentBlock.user_has_liked)}
              isRecall={true}
            />)}
          </div>
        </div>
      )}
      <div className="fixed inset-x-0 bottom-0 text-white text-center z-40">
        <div className='bg-[#0098FF] text-end px-4 text-sm'>
          You are in “Recall” mode
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
    </div>

  )
}
