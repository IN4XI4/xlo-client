import MarkdownRenderer from '../MardownRenderer';
import { QuestionMedia } from './QuestionMedia';
import { QuestionAudio } from './QuestionAudio';
import { ChoiceBlock } from './ChoiceBlock';

export function QuestionBlock({ question, index, selectedChoiceIds, onChoiceChange }) {
  const isMultiple = question.is_multiple_choice;

  return (
    <div className="border-4 border-[#CEC5FF] rounded-xl mb-4 overflow-hidden p-1">
      <div className="px-5 pt-4 pb-2">
        <div className="flex flex-col lg:flex-row lg:items-start lg:gap-4">
          <div className="flex-1 min-w-0">
            <MarkdownRenderer
              content={question.description}
              additionalClass="text-gray-800 text-base [&_p]:!mt-0 [&_p]:!mb-1 [&_pre]:!mt-0"
              disableCopy
            />
          </div>
          <QuestionMedia image={question.image} />
        </div>
        <QuestionAudio audio={question.audio} />
        {isMultiple && (
          <div className="text-xs text-[#846EFF] mt-1">Select all that apply</div>
        )}
      </div>
      <div className="border-b-2 mx-5 border-[#846EFF]" />
      <div>
        {question.choices.map((choice, cIndex) => (
          <ChoiceBlock
            key={cIndex}
            choice={choice}
            isMultiple={isMultiple}
            isSelected={selectedChoiceIds.includes(choice.choice_id)}
            isLast={cIndex === question.choices.length - 1}
            onSelect={() => onChoiceChange(question.question_id, choice.choice_id, isMultiple)}
          />
        ))}
      </div>
    </div>
  );
}
