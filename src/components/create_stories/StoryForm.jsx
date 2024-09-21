import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { FileInput, Select, TextInput, ToggleSwitch, Tooltip } from 'flowbite-react';
import MDEditor from '@uiw/react-md-editor';
import { LuEye } from "react-icons/lu";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FaPlus } from 'react-icons/fa';
import { BsFileEarmarkPlusFill, BsFillFileEarmarkMinusFill } from "react-icons/bs";
import { IoDownload } from "react-icons/io5";
import { HiMiniTrash } from "react-icons/hi2";

import { ConfirmationModal } from '../ConfirmationModal';
import { CardPreviewModal } from './CardPreviewModal';
import { CardBlockNavigation } from './CardBlockNavigation';
import { getMentors, getSoftSkills } from '../../api/base.api';
import { deleteStory, getBlockTypes } from '../../api/blog.api';
import { CreateMentorModal } from './CreateMentorModal';
import { CREATOR_LEVEL_3 } from '../../globals';


export function StoryForm({ initialData, onSubmit, submitMessage, isSubmitError, userLevel, storyId = null }) {
  const navigate = useNavigate();
  const [softSkills, setSoftSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [blockTypes, setBlockTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [previewCard, setPreviewCard] = useState(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showCreateMentorModal, setShowCreateMentorModal] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const [showCreateMentorButton, setSshowCreateMentorButton] = useState(false);

  const { control, register, handleSubmit, formState: { errors }, getValues, setValue, trigger } = useForm({
    defaultValues: initialData || {
      title: '',
      subtitle: '',
      is_private: initialData?.is_private ?? false,
      free_access: initialData?.free_access ?? false,
      cards: [{
        id: null,
        cardTitle: '',
        selectedSoftSkill: '',
        selectedMentor: '',
        blocks: [{ id: null, content: '', blockType: '', image: null }]
      }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards"
  });

  const isPrivate = useWatch({
    control,
    name: 'is_private',
  });

  useEffect(() => {
    if (userLevel >= CREATOR_LEVEL_3) {
      setSshowCreateMentorButton(true)
    }
  }, [])

  useEffect(() => {
    loadSoftSkillsAndMentors();
  }, []);

  const loadSoftSkillsAndMentors = async (updateMentorsOnly = false) => {
    try {
      if (!updateMentorsOnly) {
        const softSkillsRes = await getSoftSkills();
        setSoftSkills(softSkillsRes.data.results);
      }
      const mentorsRes = await getMentors();
      setMentors(mentorsRes.data.results);
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const blockTypesRes = await getBlockTypes();
        setBlockTypes(blockTypesRes.data.results);

      } catch (error) {
        console.error("Error loading block types:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (initialData) {

      initialData.cards.forEach((card, cardIndex) => {
        card.blocks.forEach((block, blockIndex) => {
          if (block.image) {
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${cardIndex}.blocks.${blockIndex}.image`]: block.image
            }));
          }
        });
      });
    }
  }, [initialData, setValue]);

  function updateImagePreviewsForCards(imagePreviews, cardIndexToRemove) {
    const newImagePreviews = {};
    Object.keys(imagePreviews).forEach(key => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.image$/);
      if (match) {
        const [_, cardIndex, blockIndex] = match.map(Number);
        if (cardIndex > cardIndexToRemove) {
          const newKey = `cards.${cardIndex - 1}.blocks.${blockIndex}.image`;
          newImagePreviews[newKey] = imagePreviews[key];
        } else if (cardIndex < cardIndexToRemove) {
          newImagePreviews[key] = imagePreviews[key];
        }
      }
    });
    return newImagePreviews;
  }

  function updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndexToRemove) {
    const newImagePreviews = {};
    Object.keys(imagePreviews).forEach(key => {
      const match = key.match(/^cards\.(\d+)\.blocks\.(\d+)\.image$/);
      if (match) {
        const [_, matchedCardIndex, blockIndex] = match.map(Number);
        if (matchedCardIndex === cardIndex) {
          if (blockIndex > blockIndexToRemove) {
            const newKey = `cards.${cardIndex}.blocks.${blockIndex - 1}.image`;
            newImagePreviews[newKey] = imagePreviews[key];
          } else if (blockIndex < blockIndexToRemove) {
            newImagePreviews[key] = imagePreviews[key];
          }
        } else {
          newImagePreviews[key] = imagePreviews[key];
        }
      }
    });
    return newImagePreviews;
  }

  const handleDeleteImage = (cardIndex, blockIndex) => {
    const updatedImagePreviews = { ...imagePreviews };
    delete updatedImagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`];
    setImagePreviews(updatedImagePreviews);
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.image`, null, { shouldDirty: true, shouldTouch: true });
  };

  const handleRemoveBlock = (cardIndex, blockIndex) => {
    const currentCards = getValues('cards');
    currentCards[cardIndex].blocks.splice(blockIndex, 1);
    setValue('cards', currentCards);

    const updatedImagePreviews = updateImagePreviewsForBlocks(imagePreviews, cardIndex, blockIndex);
    setImagePreviews(updatedImagePreviews);

    setCurrentBlockIndex((prevIndex) => {
      if (prevIndex >= currentCards[cardIndex].blocks.length - 1) {
        return Math.max(currentCards[cardIndex].blocks.length - 1, 0);
      } else if (prevIndex > 0 && prevIndex >= blockIndex) {
        return prevIndex - 1;
      }
      return prevIndex;
    });

    if (blockIndex === 0 && currentCards[cardIndex].blocks.length > 0) {
      setValue(`cards.${cardIndex}.blocks.0`, { ...currentCards[cardIndex].blocks[0] }, { shouldDirty: true, shouldTouch: true });
    }
  };

  const handleRemoveCard = (cardIndex) => {
    const currentCards = getValues('cards');
    currentCards.splice(cardIndex, 1);
    setValue('cards', currentCards, { shouldDirty: true, shouldTouch: true });

    const updatedImagePreviews = updateImagePreviewsForCards(imagePreviews, cardIndex);
    setImagePreviews(updatedImagePreviews);

    setCurrentCardIndex((prevIndex) => {
      if (prevIndex >= currentCards.length - 1) {
        return Math.max(currentCards.length - 1, 0);
      } else if (prevIndex > 0 && prevIndex >= cardIndex) {
        return prevIndex - 1;
      }
      return prevIndex;
    });

    if (cardIndex === 0 && currentCards.length > 0) {
      setValue('cards.0', { ...currentCards[0] }, { shouldDirty: true, shouldTouch: true });
    }
    setCurrentBlockIndex(0);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prevIndex) => Math.min(prevIndex + 1, fields.length - 1));
    setCurrentBlockIndex(0);
  };

  const handlePreviousCard = () => {
    setCurrentCardIndex((prevIndex) => Math.max(prevIndex - 1, 0));
    setCurrentBlockIndex(0);
  };

  const handleNextBlock = () => {
    const currentBlocks = fields[currentCardIndex]?.blocks || [];
    setCurrentBlockIndex((prevIndex) => Math.min(prevIndex + 1, currentBlocks.length - 1));
  };

  const handlePreviousBlock = () => {
    setCurrentBlockIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const openPreviewModal = (card) => {
    const currentCard = getValues(`cards.${currentCardIndex}`);
    setPreviewCard(currentCard);
    setIsPreviewModalOpen(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpen(false);
    setPreviewCard(null);
  };

  const confirmDeleteStory = () => {
    setShowModal(true);
  };

  const handleDeleteStory = async () => {
    setValue('title', '');
    setValue('subtitle', '');
    setValue('cards', [{
      cardTitle: '',
      selectedSoftSkill: '',
      selectedMentor: '',
      blocks: [{ content: '', blockType: '' }]
    }]);
    setImagePreviews({});
    setCurrentCardIndex(0);
    setCurrentBlockIndex(0);
    setFormKey(prevKey => prevKey + 1);
    setShowModal(false);
    if (storyId) {
      try {
        await deleteStory(storyId);
        navigate('/', { state: { storyDeleted: true } });
      } catch (error) {
        console.error('Error al eliminar el recall:', error);
      }
    }
  };

  const cancelDeleteStory = () => {
    setShowModal(false);
  };

  const openCreateMentorModal = () => {
    setShowCreateMentorModal(true);
  };

  const closeCreateMentorModal = () => {
    setShowCreateMentorModal(false);
  };

  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-4xl font-extrabold pb-6'>
        STORY {initialData ? "EDITION" : "CREATION"} MODULE
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-blue-50 px-3 py-6 rounded-lg mb-4' key={formKey}>
        <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-2'>
          <div className='font-semibold'>Story Title</div>
          <div className='col-span-2 md:col-span-5'>
            <TextInput placeholder='Insert a “Title” to your story'
              id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
        </div>
        <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-3'>
          <div className='font-semibold'>Story Subtitle</div>
          <div className='col-span-2 md:col-span-5'>
            <TextInput placeholder='Insert a Subtitle to your story'
              id="subtitle" {...register('subtitle', { required: 'Subtitle is required' })} />
            {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
          </div>
        </div>
        <div className='flex pb-3'>
          <div className='flex pe-4'>
            <div className='pe-2'>Is private</div>
            <Controller
              name="is_private"
              control={control}
              render={({ field }) => (
                <ToggleSwitch
                  color="cyan"
                  checked={field.value}
                  onChange={(checked) => {
                    setValue('is_private', checked);
                    if (checked) {
                      setValue('free_access', false);
                    }
                  }}
                />
              )}
            />
          </div>
          {!isPrivate && (
            <div className='flex'>
              <div className='pe-2'>
                <Tooltip content="Public Url">Free Access</Tooltip></div>
              <Controller
                name="free_access"
                control={control}
                render={({ field }) => (
                  <ToggleSwitch
                    color="cyan"
                    checked={field.value}
                    onChange={(checked) => setValue('free_access', checked)}
                  />
                )}
              />
            </div>
          )}

        </div>
        {fields.length > 0 && (
          <div className='border px-3 py-6 rounded-lg mb-2 bg-purple-100' key={currentCardIndex}>
            <div className='flex justify-between md:grid md:grid-cols-6 items-center pb-3'>
              <div className='text-xl md:text-2xl font-semibold text-gray-500'>
                CARD {currentCardIndex + 1} / {fields.length}
              </div>
              <div className='md:col-span-5'>
                <Tooltip content="Take a look!">
                  <button type='button' className='bg-[#BD7DF4] py-2 px-3 rounded-lg flex items-center text-white shadow-lg'
                    onClick={() => openPreviewModal(fields[currentCardIndex])}>
                    <span className='pe-2'>CARD PREVIEW</span>
                    <LuEye />
                  </button>
                </Tooltip>

              </div>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-4'>
              <div className='font-semibold'>Card Title</div>
              <div className='col-span-2 md:col-span-5'>
                <TextInput placeholder='Insert a “Title” to your card'
                  {...register(`cards.${currentCardIndex}.cardTitle`, { required: 'Card title is required' })} />
                {errors.cards?.[currentCardIndex]?.cardTitle &&
                  <p className="text-red-500">{errors.cards[currentCardIndex].cardTitle.message}</p>}
              </div>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-4'>
              <div className='font-semibold'>Soft Skill</div>
              <div className='col-span-2 md:col-span-5'>
                <Controller
                  control={control}
                  name={`cards.${currentCardIndex}.selectedSoftSkill`}
                  rules={{ required: 'Soft Skill is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="" disabled>Select Soft Skill</option>
                      {softSkills.map(skill => (
                        <option key={skill.id} value={skill.id}>{skill.name}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.cards?.[currentCardIndex]?.selectedSoftSkill &&
                  <p className="text-red-500">A soft skill selection is required.</p>}
              </div>
            </div>
            <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-4'>
              <div className='font-semibold flex items-center'>
                <div className='pe-2'>Mentor</div>
                {showCreateMentorButton &&
                  <Tooltip content="Create a new mentor">
                    <button type="button"
                      className='bg-[#3DB1FF] p-1 rounded-full text-white flex items-center'
                      onClick={() => openCreateMentorModal()}>
                      <FaPlus />
                    </button>
                  </Tooltip>

                }
              </div>
              <div className='col-span-2 md:col-span-5'>
                <Controller
                  control={control}
                  name={`cards.${currentCardIndex}.selectedMentor`}
                  rules={{ required: 'Mentor is required' }}
                  render={({ field }) => (
                    <Select {...field}>
                      <option value="" disabled>Select Mentor</option>
                      {mentors.map(mentor => (
                        <option key={mentor.id} value={mentor.id}>{mentor.name} - {mentor.job}</option>
                      ))}
                    </Select>
                  )}
                />
                {errors.cards?.[currentCardIndex]?.selectedMentor &&
                  <p className="text-red-500">A mentor selection is required.</p>}
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-6 items-center pb-4'>
              <div className='hidden md:block'></div>
              <div className='md:col-span-5 flex items-center justify-between'>
                <div className='flex items-center space-x-1 md:space-x-2'>
                  <button type="button"
                    className='bg-[#BD7DF4] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
                    disabled={currentCardIndex === 0} onClick={handlePreviousCard}>
                    <FaAngleLeft /> <span className='px-1 text-sm md:text-base'>PREV</span>
                  </button>
                  <div className='text-sm text-[#BD7DF4] font-semibold'>
                    {currentCardIndex + 1}/{fields.length}
                  </div>
                  <button type="button"
                    className='bg-[#BD7DF4] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
                    disabled={currentCardIndex === fields.length - 1}
                    onClick={handleNextCard}>
                    <span className='px-1 text-sm md:text-base'>NEXT</span><FaAngleRight />
                  </button>
                </div>
                <div className='flex items-center space-x-2 md:space-x-3'>
                  {fields.length > 1 && (
                    <div className='flex items-center'>
                      <button type="button"
                        className='bg-[#FD4E3F] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center'
                        onClick={() => handleRemoveCard(currentCardIndex)} >
                        <span className='pe-3 hidden md:block'>DELETE CARD</span> <FaMinusCircle />
                      </button>
                    </div>
                  )}
                  <div className='flex'>
                    <button type="button"
                      className='bg-[#BD7DF4] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center'
                      onClick={() => {
                        const newCard = { cardTitle: '', selectedSoftSkill: '', selectedMentor: '', blocks: [{ content: '', blockType: '' }] };
                        append(newCard);
                        setCurrentCardIndex(fields.length);
                        setCurrentBlockIndex(0);
                      }}>
                      <span className='pe-3 hidden md:block'>ADD NEW CARD</span> <FaPlusCircle />
                    </button>
                  </div>
                </div>
              </div>
            </div>
            <div className='border p-3 rounded-lg mb-2 bg-[#EBFFEE]'>
              {fields[currentCardIndex]?.blocks?.length > 0 && (
                <div key={currentBlockIndex}>
                  <div className='text-xl md:text-2xl font-semibold text-gray-500'>
                    BLOCK {currentBlockIndex + 1} / {fields[currentCardIndex].blocks.length}
                  </div>
                  <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-4'>
                    <div>
                      <div className="font-semibold">Block Type</div>
                    </div>
                    <div className='col-span-2 md:col-span-5'>
                      <Controller
                        control={control}
                        name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.blockType`}
                        rules={{ required: 'Block type is required' }}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select Block Type</option>
                            {blockTypes.map((type) => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.blockType &&
                        <p className="text-red-500">Block type selection is required.</p>}
                    </div>

                  </div>
                  <div className='grid grid-cols-1 md:grid-cols-6 pb-4'>
                    <div className='pb-3 md:pb-0'>
                      <div className="font-semibold">Block Text</div>
                    </div>
                    <div className='md:col-span-5'>
                      <Controller
                        control={control}
                        name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.content`}
                        rules={{ required: 'Block content is required.' }}
                        render={({ field }) => (
                          <>
                            <MDEditor
                              value={field.value}
                              onChange={field.onChange}
                              preview="edit"
                            />
                          </>
                        )}
                      />
                      {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content &&
                        <p className="text-red-500">
                          {errors.cards[currentCardIndex].blocks[currentBlockIndex].content.message}
                        </p>}
                    </div>

                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 items-center md:items-start">
                    <div className="font-semibold mb-3">
                      Block Image
                    </div>
                    <div className="relative mb-3 flex md:block items-center">
                      <div className="relative inline-block">
                        <FileInput
                          type="file"
                          accept="image/png, image/jpeg, image/gif"
                          className='absolute opacity-0'
                          {...register(`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`)}
                          onChange={(e) => {
                            const file = e.target.files[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onloadend = () => {
                                setImagePreviews(prev => ({ ...prev, [`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`]: reader.result }));
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                        />
                        <button
                          type="button"
                          className="bg-[#43B29D] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center"
                          onClick={() => document.querySelector(`input[name='cards.${currentCardIndex}.blocks.${currentBlockIndex}.image']`).click()}
                        >
                          <span className='pe-3 hidden md:block'>ADD AN IMAGE</span> <BsFileEarmarkPlusFill className='text-xl' />
                        </button>
                      </div>
                      {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`] && (
                        <div className='md:mt-4 ps-4 md:ps-0'>
                          <button
                            type="button"
                            className="bg-[#FD4E3F] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center"
                            onClick={() => handleDeleteImage(currentCardIndex, currentBlockIndex)}
                          >
                            <span className='pe-3 hidden md:block'>DELETE IMAGE</span> <BsFillFileEarmarkMinusFill className='text-xl' />
                          </button>
                        </div>
                      )}

                    </div>
                    {imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`] ? (
                      <div className='col-span-2 md:col-span-4 flex items-center justify-center '>
                        <img
                          src={imagePreviews[`cards.${currentCardIndex}.blocks.${currentBlockIndex}.image`]}
                          alt="Preview"
                          className='max-h-[400px] rounded-lg'
                        />
                      </div>
                    ) : (
                      <div className='col-span-2 md:col-span-4 bg-white h-[200px] border rounded-md md:ms-3 flex justify-center items-center text-gray-500'>
                        Image Preview
                      </div>
                    )}
                  </div>

                </div>
              )}
              <div className='grid grid-cols-1 md:grid-cols-6 items-center pt-3 md:pt-6 md:pb-3'>
                <div className='hidden md:block'></div>
                <CardBlockNavigation
                  currentBlockIndex={currentBlockIndex}
                  setCurrentBlockIndex={setCurrentBlockIndex}
                  currentCardIndex={currentCardIndex}
                  fields={fields}
                  handlePreviousBlock={handlePreviousBlock}
                  handleNextBlock={handleNextBlock}
                  handleRemoveBlock={handleRemoveBlock}
                  getValues={getValues}
                  setValue={setValue}
                />
              </div>

            </div>
          </div>
        )}
        <div className='flex justify-end pt-3'>
          <button type='button' onClick={confirmDeleteStory}
            className='bg-[#FD4E3F] px-3 md:px-4 py-3 md:py-2 rounded-full md:rounded-lg 
          text-white flex items-center me-3'>
            <span className='pe-3 hidden md:block'>DELETE STORY</span> <HiMiniTrash />
          </button>
          <button type="submit" className='bg-[#3DB1FF] px-2 md:px-4 md:py-2 rounded-lg text-white flex items-center'>
            <span className='pe-2 md:pe-3'>SUBMIT STORY</span> <IoDownload />
          </button>
        </div>
        {submitMessage && (
          <div className={`mt-4 text-center ${isSubmitError ? 'text-red-500' : 'text-green-500'}`}>
            {submitMessage}
          </div>
        )}
      </form>
      {isPreviewModalOpen && <CardPreviewModal onClose={closePreviewModal} card={previewCard} />}
      {showModal && <ConfirmationModal
        onConfirm={handleDeleteStory}
        onCancel={cancelDeleteStory}
        message={"¿Are you sure you want to delete this story?"}
        buttonColor={"#FD4E3F"}
      />}
      {showCreateMentorModal &&
        <CreateMentorModal onClose={closeCreateMentorModal} onMentorCreated={() => loadSoftSkillsAndMentors(true)} />}
    </div>
  )
}
