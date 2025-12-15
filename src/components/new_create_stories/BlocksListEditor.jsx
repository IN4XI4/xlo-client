import React, { useMemo, useState } from 'react'
import { useFieldArray, useWatch } from 'react-hook-form';

import { SelectTypeForm } from './block_forms/SelectTypeForm';
import { QuoteForm } from './block_forms/QuoteForm';
import { TestimonialForm } from './block_forms/TestimonialForm';
import { FactForm } from './block_forms/FactForm';
import { WonderForm } from './block_forms/WonderForm';
import { FlashcardForm } from './block_forms/FlashcardForm';
import { ReflectionForm } from './block_forms/ReflectionForm';
import { QuestionForm } from './block_forms/QuestionForm';
import { StandardForm } from './block_forms/StandardForm';
import { MonsterForm } from './block_forms/MonsterForm';
import { MentorForm } from './block_forms/MentorForm';
import { HeroForm } from './block_forms/HeroForm';
import { HighlightForm } from './block_forms/HighlightForm';
import { FaMinusCircle, FaPlusCircle } from 'react-icons/fa';
import { BlockNavigationBar } from './BlockNavigationBar';
import { ConfirmationModal } from '../modals/ConfirmationModal';


const HELP_TEXTS = {
  STANDARD: "Used for general storytelling and contains no special features.",
  MONSTER: "Used to enhance the intensity of suspenseful and confrontational scenes.",
  MENTOR: "Used to provide valuable help or advice at critical moments in the story.",
  HERO: "Used to introduce and highlight the main character of the story.",
  HIGHLIGHT: "Used to highlight important aspects of the generated content.",
  QUOTE: "Showcases a significant statement or quote to add context or depth to the story.",
  TESTIMONIAL: "Used near the conclusion, encourages in-depth contemplation.",
  FACT: "Used to support the story providing informations like fact, myth or opinion?",
  WONDER: "Used in pivotal situations that call for profound contemplation.",
  FLASHCARD: "Used as a helpful study resource, providing a fresh perspective on knowledge.",
  REFLECTION: "Used at the end of a chapter or at key moments to encourage personal reflection.",
  QUESTION: "For interactive learning, enabling to prompt with question.",
};

const BLOCK_TYPE_COMPONENTS = {
  1: StandardForm,      // STANDARD
  2: MonsterForm,       // MONSTER
  3: MentorForm,        // MENTOR
  4: HeroForm,          // HERO
  5: HighlightForm,     // HIGHLIGHT
  6: QuoteForm,         // QUOTE
  7: FlashcardForm,     // FLASHCARD
  8: FactForm,          // FACT
  9: WonderForm,        // WONDER
  10: QuestionForm,     // QUESTION
  11: TestimonialForm,  // TESTIMONIAL
  12: ReflectionForm,   // REFLECTION
};

function BlockRow({ cardIndex, blockIndex, getValues, setValue, register, errors, globalMentor, globalSoftSkill,
  showTypeSelector, blockType, imagePreviews, setImagePreviews }) {

  const BlockComponent = useMemo(
    () => (blockType ? BLOCK_TYPE_COMPONENTS[blockType] : null),
    [blockType]
  )

  const onSelectType = (type) => {
    setValue(`cards.${cardIndex}.blocks.${blockIndex}.blockType`, type, {
      shouldDirty: true,
      shouldValidate: true,
      shouldTouch: true,
    })
  }

  if (!blockType) {
    return (
      <div className="pb-2">
        <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]'>
          <div className='text-gray-500 pb-2'>Select a block-type:</div>
          <SelectTypeForm value={blockType} onSelect={onSelectType} />
        </div>
      </div>
    )
  }

  return (
    <div className="pb-2">
      {BlockComponent ? (
        <BlockComponent cardIndex={cardIndex} blockIndex={blockIndex} globalMentor={globalMentor} globalSoftskill={globalSoftSkill}
          register={register} errors={errors} showTypeSelector={showTypeSelector} value={blockType} onSelect={onSelectType}
          imagePreviews={imagePreviews} getValues={getValues} setValue={setValue} setImagePreviews={setImagePreviews} />
      ) : (
        <div className="text-gray-400 italic">No form for this block type yet.</div>
      )}
    </div>
  )
}

export function BlocksListEditor({ fields, currentCardIndex, control, setValue, register, errors, globalSoftSkill, globalMentor,
  append, setCurrentCardIndex, getValues, imagePreviews, setImagePreviews,
}) {
  const [typeSelectorVisibility, setTypeSelectorVisibility] = useState({});
  const [pendingDeleteCardIndex, setPendingDeleteCardIndex] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const {
    fields: blockFields,
    append: appendBlock,
    remove: removeBlock,
  } = useFieldArray({
    control,
    name: `cards.${currentCardIndex}.blocks`,
  });

  const blocks = useWatch({
    control,
    name: `cards.${currentCardIndex}.blocks`,
  });

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
  };

  const confirmDeleteCard = () => {
    setPendingDeleteCardIndex(currentCardIndex);
    setShowModal(true);
  };

  const cancelDeleteCard = () => {
    setShowModal(false);
    setPendingDeleteCardIndex(null);
  };

  const confirmDelete = () => {
    if (pendingDeleteCardIndex === null) return;
    handleRemoveCard(pendingDeleteCardIndex);
    setShowModal(false);
    setPendingDeleteCardIndex(null);
  };

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
      } else {
        newImagePreviews[key] = imagePreviews[key];
      }
    });

    return newImagePreviews;
  }

  return (
    <div className='md:px-16 lg:px-24'>
      {fields.length > 0 && (
        <div className="bg-white rounded-lg p-4 md:p-8 lg:p-12">
          <div className='flex ps-2'>
            <div className='flex-grow'>
              <div className=''>
                <input
                  id="cardTitle"
                  placeholder="Insert a title to your card"
                  {...register(`cards.${currentCardIndex}.cardTitle`, { required: false })}
                  className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none
                     font-semibold text-gray-500 text-xl  xl:text-2xl py-0"
                  onInput={(e) => {
                    e.target.style.height = "auto";
                    e.target.style.height = `${e.target.scrollHeight}px`;
                  }}
                />
                {errors.cards?.title && (
                  <p className="text-red-500 text-sm mt-1">{errors.cards?.title}</p>
                )}
              </div>
            </div>
            <div className='flex items-center space-x-2 md:space-x-3 pb-3 justify-end'>
              {fields.length > 1 && (
                <div className='flex items-center'>
                  <button type="button"
                    className='bg-[#FD4E3F] p-2 rounded-full text-white flex items-center'
                    onClick={confirmDeleteCard}>
                    <FaMinusCircle />
                  </button>
                </div>
              )}
              <div className='text-sm text-gray-500 font-semibold px-1'>
                {currentCardIndex + 1} - {fields.length}
              </div>
              <div className='flex'>
                <button type="button"
                  className='bg-[#5B0FFE] p-2 rounded-full text-white flex items-center'
                  onClick={() => {
                    const newCard = { cardTitle: '', selectedSoftSkill: '', selectedMentor: '', blocks: [{ content: '', blockType: '' }] };
                    append(newCard);
                    setCurrentCardIndex(fields.length);
                  }}>
                  <FaPlusCircle />
                </button>
              </div>
            </div>
          </div>
          {blockFields.map((f, i) => {
            const currentBlock = blocks?.[i] || {};
            const currentBlockType = blocks?.[i]?.blockType || '';

            const isPrimaryActive = currentBlock.isPrimaryActive !== undefined ? currentBlock.isPrimaryActive : true;
            const showMainImage = isPrimaryActive;
            const showSecondImage = !isPrimaryActive;

            return (
              <div key={f.id}>
                <BlockRow
                  key={f.id}
                  cardIndex={currentCardIndex}
                  blockIndex={i}
                  getValues={getValues}
                  setValue={setValue}
                  register={register}
                  errors={errors}
                  globalMentor={globalMentor}
                  globalSoftSkill={globalSoftSkill}
                  showTypeSelector={typeSelectorVisibility[`${currentCardIndex}-${i}`]}
                  blockType={currentBlockType}
                  imagePreviews={imagePreviews}
                  setImagePreviews={setImagePreviews}
                />
                <BlockNavigationBar
                  control={control}
                  register={register}
                  currentCardIndex={currentCardIndex}
                  currentBlockIndex={i}
                  getValues={getValues}
                  setValue={setValue}
                  imagePreviews={imagePreviews}
                  setImagePreviews={setImagePreviews}
                  appendBlock={appendBlock}
                  removeBlock={removeBlock}
                  typeSelectorVisibility={typeSelectorVisibility}
                  setTypeSelectorVisibility={setTypeSelectorVisibility}
                  blockType={currentBlockType}
                  blockCount={blockFields.length}
                  showMainImage={showMainImage}
                  showSecondImage={showSecondImage}
                />
              </div>
            );
          })}
        </div>
      )}
      {showModal && <ConfirmationModal
        onConfirm={confirmDelete}
        onCancel={cancelDeleteCard}
        message={"¿Are you sure you want to delete this card?"}
        buttonColor={"#FD4E3F"}
      />}
    </div>
  )
}
