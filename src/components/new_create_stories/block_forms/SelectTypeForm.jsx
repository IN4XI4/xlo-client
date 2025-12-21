import React from 'react'
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


const OPTIONS = [
  { value: 1, key: 'STANDARD', Icon: StandardIcon, label: 'Standard' },
  { value: 4, key: 'HERO', Icon: HeroIcon, label: 'Hero' },
  { value: 3, key: 'MENTOR', Icon: MentorIcon, label: 'Mentor' },
  { value: 2, key: 'MONSTER', Icon: MonsterIcon, label: 'Monster' },
  { value: 5, key: 'HIGHLIGHT', Icon: HighlightIcon, label: 'Highlight' },
  { value: 6, key: 'QUOTE', Icon: QuoteIcon, label: 'Quote' },
  { value: 13, key: 'ILLUSTRATION', Icon: IllustrationIcon, label: 'Illustration' },
  { value: 7, key: 'FLASHCARD', Icon: FlashcardIcon, label: 'Flashcard' },
  { value: 8, key: 'FACT', Icon: FactIcon, label: 'Fact' },
  { value: 10, key: 'QUESTION', Icon: QuestionIcon, label: 'Question' },
  { value: 12, key: 'REFLECTION', Icon: ReflectionIcon, label: 'Reflection' },
  { value: 11, key: 'TESTIMONIAL', Icon: TestimonialIcon, label: 'Testimonial' },
  { value: 9, key: 'WONDER', Icon: WonderIcon, label: 'Wonder' },
];

export function SelectTypeForm({ value, onSelect, size = "large" }) {

  const itemCls = size === "large" ? "w-9 h-9 md:w-12 md:h-12" : "w-8 h-8 md:w-9 md:h-9"

  return (
    <div className={`grid grid-cols-7 md:flex justify-between gap-y-2 place-items-center pt-2
      ${size === "large" ? "" : "md:px-12"}`}>
      {OPTIONS.map(({ value: optionValue, key, Icon, label }) => {
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
            <Icon className={`${itemCls} cursor-pointer`} />
          </button>
        );
      })}
    </div>
  )
}
