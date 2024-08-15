import React, { useEffect, useState } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { getMentors, getSoftSkills } from '../api/base.api';
import { createStoryFull, getBlockTypes } from '../api/blog.api';
import { FileInput, Select, TextInput } from 'flowbite-react';
import { getUser } from '../api/users.api';
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import MDEditor from '@uiw/react-md-editor';
import { LuEye } from "react-icons/lu";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
import { FaAngleLeft, FaAngleRight } from "react-icons/fa6";
import { BsFileEarmarkPlusFill } from "react-icons/bs";
import { IoDownload } from "react-icons/io5";
import { HiMiniTrash } from "react-icons/hi2";
import { CardPreviewModal } from '../components/create_stories/CardPreviewModal';


export function CreateStoryPage() {
  const { id: topicId, slug } = useParams();
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);
  const [softSkills, setSoftSkills] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [blockTypes, setBlockTypes] = useState([]);
  const [imagePreviews, setImagePreviews] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);
  const [previewCard, setPreviewCard] = useState(null);

  const { control, register, handleSubmit, formState: { errors }, getValues, setValue } = useForm({
    defaultValues: {
      title: '',
      subtitle: '',
      cards: [{
        cardTitle: '',
        selectedSoftSkill: '',
        selectedMentor: '',
        blocks: [{ content: '', blockType: '' }]
      }]
    }
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards"
  });

  useEffect(() => {
    const loadSoftSkillsAndMentors = async () => {
      try {
        const softSkillsRes = await getSoftSkills();
        const mentorsRes = await getMentors();
        setSoftSkills(softSkillsRes.data.results);
        setMentors(mentorsRes.data.results);
      } catch (error) {
        console.error("Error loading data:", error);
      }
    };

    loadSoftSkillsAndMentors();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const blockTypesRes = await getBlockTypes();
        setBlockTypes(blockTypesRes.data.results);
        console.log("types", blockTypesRes.data.results);
        
      } catch (error) {
        console.error("Error loading block types:", error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const loadUserMe = async () => {
      try {
        setIsLoading(true);
        const response = await getUser();
        setIsCreator(response.data.is_creator);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserMe();
  }, []);

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

  const onSubmit = async (data) => {
    setIsLoading(true);
    const formData = new FormData();

    formData.append('title', data.title);
    formData.append('subtitle', data.subtitle);
    formData.append('topic', topicId);

    data.cards.forEach((card, cardIndex) => {
      const cardPrefix = `cards[${cardIndex}]`;

      formData.append(`${cardPrefix}.cardTitle`, card.cardTitle);
      formData.append(`${cardPrefix}.selectedSoftSkill`, card.selectedSoftSkill);
      formData.append(`${cardPrefix}.selectedMentor`, card.selectedMentor);

      card.blocks.forEach((block, blockIndex) => {
        const blockPrefix = `${cardPrefix}.blocks[${blockIndex}]`;

        formData.append(`${blockPrefix}.content`, block.content);
        formData.append(`${blockPrefix}.blockType`, block.blockType);

        if (block.image && block.image.length > 0) {
          formData.append(`${blockPrefix}.image`, block.image[0]);
        }
      });
    });
    try {
      const response = await createStoryFull(formData);
      setIsSubmitError(false);
      navigate(`/topic/${slug}`, { state: { storyCreated: true } });
    } catch (error) {
      console.error("Error creating story:", error.response?.data || error.message);
      setSubmitMessage('Failed to create story. Please try again.');
      setIsSubmitError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">Loading...</div>;
  }

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

  if (!isCreator) {
    return <Navigate to="/" />;
  }
  return (
    <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">
      <div className='text-2xl md:text-4xl font-extrabold pb-6'>
        STORY CREATION MODULE
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='bg-blue-50 px-3 py-6 rounded-lg mb-4'>
        <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-2'>
          <div className='font-semibold'>Story Title</div>
          <div className='col-span-2 md:col-span-5'>
            <TextInput placeholder='Insert a “Title” to your story'
              id="title" {...register('title', { required: 'Title is required' })} />
            {errors.title && <p className="text-red-500">{errors.title.message}</p>}
          </div>
        </div>
        <div className='grid grid-cols-3 md:grid-cols-6 items-center pb-4'>
          <div className='font-semibold'>Story Subtitle</div>
          <div className='col-span-2 md:col-span-5'>
            <TextInput placeholder='Insert a Subtitle to your story'
              id="subtitle" {...register('subtitle', { required: 'Subtitle is required' })} />
            {errors.subtitle && <p className="relative w-full-red-500">{errors.subtitle.message}</p>}
          </div>
        </div>
        {fields.length > 0 && (
          <div className='border px-3 py-6 rounded-lg mb-2 bg-purple-100' key={currentCardIndex}>
            <div className='flex justify-between md:grid md:grid-cols-6 items-center pb-3'>
              <div className='text-xl md:text-2xl font-semibold text-gray-500'>
                CARD {currentCardIndex + 1} / {fields.length}
              </div>
              <div className='md:col-span-5'>
                <button type='button' className='bg-[#BD7DF4] py-2 px-3 rounded-lg flex items-center text-white'
                  onClick={() => openPreviewModal(fields[currentCardIndex])}>
                  <span className='pe-2'>CARD PREVIEW</span>
                  <LuEye />
                </button>
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
              <div className='font-semibold'>Mentor</div>
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
                        rules={{ required: 'Block content is required' }}
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
                    </div>
                    {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.content &&
                      <p className="text-red-500">
                        {errors.cards[currentCardIndex].blocks[currentBlockIndex].content.message}
                      </p>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-6 items-center md:items-start">
                    <div className="font-semibold mb-3">
                      Block Image
                    </div>
                    <div className="relative mb-3">
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
                <div className='md:col-span-5 flex items-center justify-between'>
                  <div className='flex justify-between items-center'>
                    <button type="button"
                      className='bg-[#43B29D] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
                      disabled={currentBlockIndex === 0} onClick={handlePreviousBlock}>
                      <FaAngleLeft /> <span className='px-1 text-sm md:text-base'>PREV</span>
                    </button>
                    <div className='text-sm text-[#43B29D] font-semibold px-1'>
                      {currentBlockIndex + 1} / {fields[currentCardIndex].blocks.length}
                    </div>
                    <button type="button"
                      className='bg-[#43B29D] px-2 md:px-3 py-2 rounded-full text-white flex items-center'
                      disabled={currentBlockIndex === fields[currentCardIndex]?.blocks?.length - 1}
                      onClick={handleNextBlock}>
                      <span className='px-1 text-sm md:text-base'>NEXT</span><FaAngleRight />
                    </button>
                  </div>
                  <div className='flex justify-end'>
                    {fields[currentCardIndex].blocks.length > 1 && (
                      <button type="button" onClick={() => handleRemoveBlock(currentCardIndex, currentBlockIndex)}
                        className="bg-[#FD4E3F] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center me-3">
                        <span className='pe-3 hidden md:block'>DELETE BLOCK</span> <FaMinusCircle />
                      </button>
                    )}
                    <button type="button" onClick={() => {
                      const currentCards = getValues(`cards`);
                      currentCards[currentCardIndex].blocks.push({ content: '', blockType: '' });
                      setValue(`cards`, currentCards);
                      setCurrentBlockIndex(currentCards[currentCardIndex].blocks.length - 1);
                    }} className="bg-[#43B29D] px-2 md:px-4 py-2 rounded-full md:rounded-lg text-white flex items-center">
                      <span className='pe-3 hidden md:block'>ADD NEW BLOCK</span> <FaPlusCircle />
                    </button>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}
        <div className='flex justify-end pt-3'>
          <button type='button' className='bg-[#FD4E3F] px-3 md:px-4 py-3 md:py-2 rounded-full md:rounded-lg text-white flex items-center me-3'>
            <span className='pe-3 hidden md:block'>DELETE STORY</span> <HiMiniTrash />
          </button>
          <button type="submit" className='bg-[#3DB1FF] px-2 md:px-4 md:py-2 rounded-lg text-white flex items-center'>
            <span className='pe-3'>SUBMIT STORY</span> <IoDownload />
          </button>
        </div>
        {submitMessage && (
          <div className={`mt-4 text-center ${isSubmitError ? 'text-red-500' : 'text-green-500'}`}>
            {submitMessage}
          </div>
        )}
      </form>
      {isPreviewModalOpen && <CardPreviewModal onClose={closePreviewModal} card={previewCard} />}
    </div>
  )
}
