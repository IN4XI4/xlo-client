import React from 'react'
import { Tooltip } from 'flowbite-react'
import { StandardIcon } from '../../illustrations/icons/block_types/StandardIcon'
import { FactIcon } from '../../illustrations/icons/block_types/FactIcon'
import { FlashcardIcon } from '../../illustrations/icons/block_types/FlashcardIcon'
import { HeroIcon } from '../../illustrations/icons/block_types/HeroIcon'
import { HighlightIcon } from '../../illustrations/icons/block_types/HighlightIcon'
import { MentorIcon } from '../../illustrations/icons/block_types/MentorIcon'
import { MonsterIcon } from '../../illustrations/icons/block_types/MonsterIcon'
import { QuestionIcon } from '../../illustrations/icons/block_types/QuestionIcon'
import { QuoteIcon } from '../../illustrations/icons/block_types/QuoteIcon'
import { ReflectionIcon } from '../../illustrations/icons/block_types/ReflectionIcon'
import { TestimonialIcon } from '../../illustrations/icons/block_types/TestimonialIcon'
import { WonderIcon } from '../../illustrations/icons/block_types/WonderIcon'
import { IllustrationIcon } from '../../illustrations/icons/block_types/IllustrationIcon'
import { MultipleChoiceIcon } from '../../illustrations/icons/block_types/MultipleChoiceIcon'


const OPTIONS = [
  { value: 1, key: 'STANDARD', Icon: StandardIcon, label: 'Standard', info: 'STANDARD: Used for general storytelling and contains no special features.' },
  { value: 4, key: 'HERO', Icon: HeroIcon, label: 'Hero', info: 'HERO: Used to introduce and highlight your personal “Avatar”.' },
  { value: 3, key: 'MENTOR', Icon: MentorIcon, label: 'Mentor', info: 'MENTOR: Used to introduce and highlight the character you select as the mentor for the story.' },
  { value: 2, key: 'MONSTER', Icon: MonsterIcon, label: 'Monster', info: 'MONSTER: Used to enhances the intensity of suspenseful and confrontational scenes.' },
  { value: 5, key: 'HIGHLIGHT', Icon: HighlightIcon, label: 'Highlight', info: 'HIGHLIGHT: Used to highlight important aspects of the generated content.' },
  { value: 6, key: 'QUOTE', Icon: QuoteIcon, label: 'Quote', info: 'QUOTE: Used to introduce a motivational or captivating passage in the story.' },
  { value: 13, key: 'ILLUSTRATION', Icon: IllustrationIcon, label: 'Illustration', info: 'PICTURE: Used in illustrated situations requiring visual information and a caption.' },
  { value: 7, key: 'FLASHCARD', Icon: FlashcardIcon, label: 'Flashcard', info: 'FLASHCARD: Used as a helpful study resource, providing a fresh perspective on knowledge.' },
  { value: 8, key: 'FACT', Icon: FactIcon, label: 'Fact', info: 'FACT: Used to support the story providing informations like fact, myth or opinion.' },
  { value: 10, key: 'QUESTION', Icon: QuestionIcon, label: 'Question', info: 'QUESTION: Used for interactive learning, enabling to prompt with question.' },
  { value: 14, key: 'MULTICHOICE', Icon: MultipleChoiceIcon, label: 'Multichoice Question', info: 'MULTICHOICE: Used for interactive learning, enabling to prompt with multiple choice questions.' },
  { value: 12, key: 'REFLECTION', Icon: ReflectionIcon, label: 'Reflection', info: 'REFLECTION: Used at the end of a chapter or at key moments to encourage personal reflection.' },
  { value: 11, key: 'TESTIMONIAL', Icon: TestimonialIcon, label: 'Testimonial', info: 'TESTIMONIAL: Used near the conclusion, encourages in-depth contemplation.' },
  { value: 9, key: 'WONDER', Icon: WonderIcon, label: 'Wonder', info: 'WONDER: Used in pivotal situations that call for profound contemplation.' },
];

export function SelectTypeForm({ value, onSelect }) {

  return (
    <div className={`grid grid-cols-7 xl:flex justify-between gap-y-2 place-items-center pt-2`}>
      {OPTIONS.map(({ value: optionValue, key, Icon, label, info }) => {
        const selected = value === optionValue;
        return (
          <button
            key={key}
            type="button"
            aria-label={label}
            aria-pressed={selected}
            onClick={() => onSelect(optionValue)}
            className={`p-1 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2
        ${selected ? 'ring-2 ring-[#3DB1FF] bg-gray-50' : 'hover:bg-gray-100'}`}
            title={label}
          >
            <Tooltip content={info} placement="top">
              <Icon className={`w-9 h-9 md:w-12 md:h-12 cursor-pointer`} />
            </Tooltip>
          </button>
        );
      })}
    </div>
  )
}
