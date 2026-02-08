import React, { useEffect, useState } from 'react'
import { useFieldArray, useForm, useWatch } from 'react-hook-form'
import { HiMiniTrash } from 'react-icons/hi2';

import { StoryOptions } from './StoryOptions'
import { CardEditor } from './CardEditor';
import { ConfirmationModal } from '../modals/ConfirmationModal';
import { deleteStory } from '../../api/blog.api';
import { CardsNavBar } from './CardsNavBar';


export function NewStoryForm({ initialData, onSubmit, userLevel, submitMessage, isSubmitError, storyId = null }) {
  const [formKey, setFormKey] = useState(0);
  const [imagePreviews, setImagePreviews] = useState({});
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedSoftSkill, setSelectedSoftSkill] = useState(null);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const defaultValues = React.useMemo(() => {
    if (initialData) {
      const firstCard = initialData.cards?.[0] || {};
      return {
        ...initialData,
        globalSoftSkill: firstCard.selectedSoftSkill ?? '',
        globalMentor: firstCard.selectedMentor ?? '',
      };
    }
    return {
      title: '',
      subtitle: '',
      image: null,
      life_moments: '',
      story_identities: '',
      difficulty_level: '',
      language: '',
      spaces: [],
      is_private: false,
      free_access: false,
      globalSoftSkill: '',
      globalMentor: '',
      cards: [{
        id: null,
        cardTitle: '',
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
    };
  }, [initialData]);

  const { control, register, handleSubmit, formState: { errors }, getValues, setValue, trigger, unregister } = useForm({
    defaultValues,
  });

  const globalSoftSkill = useWatch({ control, name: 'globalSoftSkill' });
  const globalMentor = useWatch({ control, name: 'globalMentor' });
  const { fields, append, remove } = useFieldArray({
    control,
    name: "cards"
  });

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

  const goToNextCard = () => {
    setCurrentCardIndex((prevIndex) => {
      if (prevIndex < fields.length - 1) {
        return prevIndex + 1;
      }
      return prevIndex;
    });
  };

  const goToPreviousCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
    }
  };

  const confirmDeleteStory = () => {
    setShowModal(true);
  };

  const cancelDeleteStory = () => {
    setShowModal(false);
  };

  return (
    <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">
      <div className='text-2xl md:text-4xl xl:text-5xl font-extrabold pb-6 text-[#4B5563]'>
        STORY {initialData ? "EDITION" : "CREATION"} MODULE
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className='py-6 mb-4' key={formKey}>
        <StoryOptions initialData={initialData} control={control} errors={errors} setValue={setValue} userLevel={userLevel}
          onSoftSkillSelected={setSelectedSoftSkill} onMentorSelected={setSelectedMentor} />
        <CardEditor
          control={control}
          register={register}
          unregister={unregister}
          append={append}
          errors={errors}
          getValues={getValues}
          setValue={setValue}
          setCurrentCardIndex={setCurrentCardIndex}
          imagePreviews={imagePreviews}
          setImagePreviews={setImagePreviews}
          fields={fields}
          currentCardIndex={currentCardIndex}
          globalSoftSkill={selectedSoftSkill}
          globalMentor={selectedMentor} />
        <div className='p-4 md:p-8 lg:p-12'>
          <div className='flex justify-end pt-3'>
            <button type='button' onClick={confirmDeleteStory}
              className='bg-[#FD4E3F] p-3 rounded-full text-white flex items-center me-3'>
              <HiMiniTrash />
            </button>
            <button type="submit" className='bg-[#3DB1FF] px-3 md:px-6 md:py-2 rounded-full text-white flex items-center'>
              SUBMIT STORY
            </button>
          </div>
          {submitMessage && (
            <div className={`mt-4 text-center ${isSubmitError ? 'text-red-500' : 'text-green-500'}`}>
              {submitMessage}
            </div>
          )}
        </div>
      </form>
      {showModal && <ConfirmationModal
        onConfirm={handleDeleteStory}
        onCancel={cancelDeleteStory}
        message={"¿Are you sure you want to delete this story?"}
        buttonColor={"#FD4E3F"}
      />}
      <CardsNavBar goToNextCard={goToNextCard} goToPreviousCard={goToPreviousCard} />
    </div>
  )
}
