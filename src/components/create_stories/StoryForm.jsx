import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray, Controller, useWatch } from 'react-hook-form';
import { FileInput, Select, TextInput, ToggleSwitch, Tooltip } from 'flowbite-react';
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { MdImage } from "react-icons/md";
import { FaPlus } from 'react-icons/fa';
import { BsFileEarmarkPlusFill, BsFillFileEarmarkMinusFill } from "react-icons/bs";
import { HiMiniTrash } from "react-icons/hi2";

import { ConfirmationModal } from '../ConfirmationModal';
import { CardPreviewModal } from './CardPreviewModal';
import { CardBlockNavigation } from './CardBlockNavigation';
import { getMentors, getSoftSkills } from '../../api/base.api';
import { deleteStory } from '../../api/blog.api';
import { CreateMentorModal } from './CreateMentorModal';
import { CREATOR_LEVEL_3, BLOCK_TYPES } from '../../globals';
import { BlockForm } from './blocks/BlockForm';


export function StoryForm({ initialData, onSubmit, submitMessage, isSubmitError, userLevel, userPicture, userColor, storyId = null }) {
  const navigate = useNavigate();
  const [softSkills, setSoftSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
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
      image: null,
      life_moments: '',
      story_identities: '',
      difficulty_level: '',
      language: '',
      is_private: initialData?.is_private ?? false,
      free_access: initialData?.free_access ?? false,
      cards: [{
        id: null,
        cardTitle: '',
        selectedSoftSkill: '',
        selectedMentor: '',
        blocks: [{
          id: null,
          blockType: '',
          content_class: '',
          title: '',
          content: '',
          content_2: '',
          image: null,
          image_2: null,
          quoted_by: '',
          block_color: '',
          options: null,
        }]
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
    if (initialData) {
      if (initialData.image) {
        setImagePreviews(prev => ({
          ...prev,
          [`image`]: initialData.image
        }));
      }
      initialData.cards.forEach((card, cardIndex) => {
        card.blocks.forEach((block, blockIndex) => {
          if (block.image) {
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${cardIndex}.blocks.${blockIndex}.image`]: block.image
            }));
          }
          if (block.image_2) {
            setImagePreviews(prev => ({
              ...prev,
              [`cards.${cardIndex}.blocks.${blockIndex}.image_2`]: block.image_2
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
      blocks: [{ content: '', blockType: '', quoted_by: '', block_color: '', content_class: '', options: null }]
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
      <form onSubmit={handleSubmit(onSubmit)} className='bg-[#94D2FD] px-3 py-6 rounded-lg mb-4' key={formKey}>
        <div className='grid grid-cols-1 md:grid-cols-3 items-center pb-3'>
          <div className='col-span-1 md:col-span-2 md:pe-4 pb-3 md:pb-0'>
            <div className='font-semibold pb-1'>Title <span className='text-red-500'>*</span></div>
            <div className='col-span-2 md:col-span-5'>
              <TextInput placeholder='Insert a story title'
                id="title" {...register('title', { required: 'Title is required' })} />
              {errors.title && <p className="text-red-500">{errors.title.message}</p>}
            </div>
          </div>
          <div className='col-span-1'>
            <div className='font-semibold pb-1'>Subtitle</div>
            <div className='col-span-2 md:col-span-5'>
              <TextInput
                placeholder='Insert a story subtitle'
                rules={{ required: false }}
                id="subtitle"
                {...register('subtitle',)} />
              {errors.subtitle && <p className="text-red-500">{errors.subtitle.message}</p>}
            </div>
          </div>
        </div>
        <div className='grid grid-cols-2 md:grid-cols-3 items-center pb-3'>
          <div className='col-span-1 pe-1 md:pe-4 pb-3 '>
            <div className='font-semibold pb-1'>Life moments</div>
            <Controller
              control={control}
              name="life_moments"
              rules={{ required: false }}
              render={({ field }) => (
                <Select {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}>
                  <option value="">Unspecified Age</option>
                  <option value="1">Aged 5 to 10</option>
                  <option value="2">Aged 10 to 15</option>
                  <option value="3">Aged 15 to 20</option>
                  <option value="4">Aged 20 to 30</option>
                  <option value="5">Aged 40 to 50</option>
                  <option value="6">Aged 50 to 60</option>
                  <option value="7">Aged 60 to 70</option>
                  <option value="8">Aged 70 and more</option>
                </Select>
              )}
            />
            {errors.life_moments && <p className="text-red-500">{errors.life_moments.message}</p>}
          </div>
          <div className='col-span-1 ps-1 md:ps-0 md:pe-4 pb-3'>
            <div className='font-semibold pb-1'>Story Identities</div>
            <Controller
              control={control}
              name="story_identities"
              rules={{ required: false }}
              render={({ field }) => (
                <Select {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}>
                  <option value="">Unspecified Identity</option>
                  <option value="1">Instinctive Identity</option>
                  <option value="2">Emotional Identity</option>
                  <option value="3">Mental Identity</option>
                </Select>
              )}
            />
            {errors.story_identities && <p className="text-red-500">{errors.story_identities.message}</p>}
          </div>
          <div className='col-span-1 pe-1 md:pe-0 pb-0 md:pb-3 '>
            <div className='font-semibold pb-1'>Difficulty levels</div>
            <Controller
              control={control}
              name="difficulty_level"
              rules={{ required: false }}
              render={({ field }) => (
                <Select {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}>
                  <option value="">Unspecified Difficulty</option>
                  <option value="1">Beginner</option>
                  <option value="2">Amateur</option>
                  <option value="3">Intermediate</option>
                  <option value="4">Professional</option>
                  <option value="5">Expert</option>
                </Select>
              )}
            />
            {errors.difficulty_level && <p className="text-red-500">{errors.difficulty_level.message}</p>}
          </div>
          <div className='col-span-1 md:pe-4 ps-1 md:ps-0 md:pb-0 self-start '>
            <div className='font-semibold pb-1'>Language</div>
            <Controller
              control={control}
              name="language"
              rules={{ required: false }}
              render={({ field }) => (
                <Select {...field}
                  value={field.value || ""}
                  onChange={(e) => field.onChange(e.target.value)}>
                  <option value="">Unspecified Language</option>
                  <option value="EN">English</option>
                  <option value="FR">French</option>
                  <option value="ES">Spanish</option>
                  <option value="DE">German</option>
                  <option value="IT">Italian</option>
                  <option value="PT">Portuguese</option>
                  <option value="OT">Other</option>
                </Select>
              )}
            />
            {errors.difficulty_level && <p className="text-red-500">{errors.difficulty_level.message}</p>}
          </div>
          <div className='col-span-2 md:col-span-1 md:pe-4 pb-3 md:pb-0 pt-3 md:pt-0 flex justify-center'>
            <div className='flex'>
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
          </div>
          <div className='col-span-2 md:col-span-1 pb-3 md:pb-0'>
            <Tooltip content="Small image (1 mb max)"><div className='font-semibold pb-1'>Thumbnail</div></Tooltip>
            <div className='flex md:pe-4 items-center '>
              <div>
                <div className='relative'>
                  {!imagePreviews['image'] ? (
                    <div
                      className='w-[90px] h-[60px] bg-white flex justify-center items-center rounded-lg cursor-pointer'
                      onClick={() => document.querySelector('input[name="image"]').click()}
                    >
                      <span className='text-gray-300 text-xl'><MdImage /></span>
                    </div>
                  ) : (
                    <img
                      src={imagePreviews['image']}
                      alt="Story Preview"
                      className='w-[90px] h-[60px] rounded-lg object-cover cursor-pointer'
                      onClick={() => document.querySelector('input[name="image"]').click()}
                    />
                  )}
                  <FileInput
                    type="file"
                    accept="image/png, image/jpeg, image/gif"
                    className='hidden'
                    {...register('image')}
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        if (file.size > 1048576) {
                          alert('Image size must not exceed 1 MB');
                          return;
                        }
                        setValue('image', file, { shouldDirty: true, shouldTouch: true });
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setImagePreviews(prev => ({ ...prev, 'image': reader.result }));
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </div>
              </div>
              <div className='ps-3 flex items-center justify-center'>
                <div className='bg-[#FD4E3F] p-2 rounded-full text-white cursor-pointer'>
                  <BsFillFileEarmarkMinusFill
                    onClick={() => {
                      setImagePreviews(prev => {
                        const updatedPreviews = { ...prev };
                        delete updatedPreviews['image'];
                        return updatedPreviews;
                      });
                      setValue('image', null, { shouldDirty: true, shouldTouch: true });
                    }} />
                </div>
              </div>
              <div className='ps-3 flex items-center justify-center'>
                <div className='bg-[#5B0FFE] p-2 rounded-full text-white cursor-pointer'
                  onClick={() => document.querySelector('input[name="image"]').click()}>
                  <BsFileEarmarkPlusFill />
                </div>
              </div>
            </div>
          </div>
        </div>

        {fields.length > 0 && (
          <div className='border px-3 py-6 rounded-lg mb-2 bg-[#B9E3FF]' key={currentCardIndex}>
            <div className='flex justify-between md:grid md:grid-cols-6 items-center pb-5'>
              <div className='text-xl md:text-2xl font-semibold'>
                CARD {currentCardIndex + 1} - {fields.length}
              </div>
              <div className='md:col-span-5 flex text-sm md:text-base md:justify-end'>
                <Tooltip content="Take a look!">
                  <button type='button' className='bg-[#3DB1FF] py-2 px-6 rounded-lg flex items-center text-white shadow-lg'
                    onClick={() => openPreviewModal(fields[currentCardIndex])}>
                    CARD PREVIEW
                  </button>
                </Tooltip>
              </div>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-3'>
              <div className='flex flex-col pb-4 md:pe-4'>
                <div className='font-semibold pb-1'>Title <span className='text-red-500'>*</span></div>
                <div className='col-span-2 md:col-span-5'>
                  <TextInput placeholder='Insert a “Title” to your card'
                    {...register(`cards.${currentCardIndex}.cardTitle`, { required: 'Card title is required' })} />
                  {errors.cards?.[currentCardIndex]?.cardTitle &&
                    <p className="text-red-500">{errors.cards[currentCardIndex].cardTitle.message}</p>}
                </div>
              </div>
              <div className='flex flex-col pb-4 md:pe-4'>
                <div className='font-semibold pb-1'>Skill <span className='text-red-500'>*</span></div>
                <div className='col-span-2 md:col-span-5'>
                  <Controller
                    control={control}
                    name={`cards.${currentCardIndex}.selectedSoftSkill`}
                    rules={{ required: 'Soft Skill is required' }}
                    render={({ field }) => (
                      <Select {...field}>
                        <option value="" disabled>Select Skill</option>
                        {softSkills.map(skill => (
                          <option key={skill.id} value={skill.id}>{skill.name}</option>
                        ))}
                      </Select>
                    )}
                  />
                  {errors.cards?.[currentCardIndex]?.selectedSoftSkill &&
                    <p className="text-red-500">A skill selection is required.</p>}
                </div>
              </div>
              <div className='flex flex-col pb-4'>
                <div className='font-semibold flex items-center pb-1'>
                  <div className='pe-2'>Mentor <span className='text-red-500'>*</span></div>
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
            </div>
            <div className='flex items-center justify-between pb-4'>
              <div className='flex items-center space-x-1 md:space-x-2'>
                <button type="button"
                  className='bg-[#3DB1FF] p-2 rounded-full text-white flex items-center'
                  disabled={currentCardIndex === 0} onClick={handlePreviousCard}>
                  <FaAngleLeft />
                </button>
                <div className='text-sm text-[#3DB1FF] font-semibold px-1'>
                  {currentCardIndex + 1} - {fields.length}
                </div>
                <button type="button"
                  className='bg-[#3DB1FF] p-2 rounded-full text-white flex items-center'
                  disabled={currentCardIndex === fields.length - 1}
                  onClick={handleNextCard}>
                  <FaAngleRight />
                </button>
              </div>
              <div className='flex items-center space-x-2 md:space-x-4'>
                {fields.length > 1 && (
                  <div className='flex items-center'>
                    <button type="button"
                      className='bg-[#FD4E3F] p-2 rounded-full text-white flex items-center'
                      onClick={() => handleRemoveCard(currentCardIndex)} >
                      <FaMinusCircle />
                    </button>
                  </div>
                )}
                <div className='flex'>
                  <button type="button"
                    className='bg-[#5B0FFE] p-2 rounded-full text-white flex items-center'
                    onClick={() => {
                      const newCard = { cardTitle: '', selectedSoftSkill: '', selectedMentor: '', blocks: [{ content: '', blockType: '' }] };
                      append(newCard);
                      setCurrentCardIndex(fields.length);
                      setCurrentBlockIndex(0);
                    }}>
                    <FaPlusCircle />
                  </button>
                </div>
              </div>
            </div>
            <div className='border px-3 py-6 rounded-lg mb-2 bg-[#E3F4FF]'>
              {fields[currentCardIndex]?.blocks?.length > 0 && (
                <div key={currentBlockIndex}>
                  <div className='text-xl md:text-2xl font-semibold pb-3'>
                    BLOCK {currentBlockIndex + 1} - {fields[currentCardIndex].blocks.length}
                  </div>
                  <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-2'>
                    <div>
                      <div className="font-semibold">Block <span className='text-red-500'>*</span></div>
                    </div>
                    <div className='col-span-2 md:col-span-5'>
                      <Controller
                        control={control}
                        name={`cards.${currentCardIndex}.blocks.${currentBlockIndex}.blockType`}
                        rules={{ required: 'Block type is required' }}
                        render={({ field }) => (
                          <Select {...field}>
                            <option value="">Select Block Type</option>
                            {Object.entries(BLOCK_TYPES).map(([key, value]) => (
                              <option key={key} value={key}>{value}</option>
                            ))}
                          </Select>
                        )}
                      />
                      {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.blockType &&
                        <p className="text-red-500">Block type selection is required.</p>}
                    </div>
                  </div>
                  <BlockForm
                    control={control}
                    currentCardIndex={currentCardIndex}
                    currentBlockIndex={currentBlockIndex}
                    imagePreviews={imagePreviews}
                    setImagePreviews={setImagePreviews}
                    setValue={setValue}
                    getValues={getValues}
                    register={register}
                    errors={errors} />
                </div>
              )}
              <div className='items-center pt-3 md:pb-3'>
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
            className='bg-[#FD4E3F] p-3 rounded-full text-white flex items-center me-3'>
            <HiMiniTrash />
          </button>
          <button type="submit" className='bg-[#3DB1FF] px-2 md:px-4 md:py-2 rounded-lg text-white flex items-center'>
            SUBMIT STORY
          </button>
        </div>
        {submitMessage && (
          <div className={`mt-4 text-center ${isSubmitError ? 'text-red-500' : 'text-green-500'}`}>
            {submitMessage}
          </div>
        )}
      </form>
      {isPreviewModalOpen &&
        <CardPreviewModal onClose={closePreviewModal} card={previewCard} userPicture={userPicture} userColor={userColor} />}
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
