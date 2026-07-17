import MarkdownRenderer from '../MardownRenderer';

export function QuestionBlock({ question, index, selectedChoiceIds, onChoiceChange }) {
  const isMultiple = question.is_multiple_choice;

  return (
    <div className="border-4 border-[#CEC5FF] rounded-xl mb-4 overflow-hidden p-1">
      <div className="px-5 pt-4 pb-2">
        <MarkdownRenderer
          content={question.description}
          additionalClass="text-gray-800 text-base [&_p]:!mt-0 [&_p]:!mb-1 [&_pre]:!mt-0"
          disableCopy
        />
        {isMultiple && (
          <div className="text-xs text-[#846EFF] mt-1">Select all that apply</div>
        )}
      </div>
      <div className="border-b-2 mx-5 border-[#846EFF]" />
      <div>
        {question.choices.map((choice, cIndex) => {
          const isSelected = selectedChoiceIds.includes(choice.choice_id);
          return (
            <div key={cIndex}>
              <div
                className="flex items-center gap-3 px-5 py-3 cursor-pointer"
                onClick={() => onChoiceChange(question.question_id, choice.choice_id, isMultiple)}
              >
                {isMultiple ? (
                  <div className={`w-5 h-5 rounded-sm border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-[#846EFF] bg-[#846EFF]' : 'border-gray-400'
                  }`}>
                    {isSelected && (
                      <svg className="w-3 h-3 text-white" viewBox="0 0 12 12" fill="none">
                        <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </div>
                ) : (
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                    isSelected ? 'border-[#846EFF]' : 'border-gray-400'
                  }`}>
                    {isSelected && (
                      <div className="w-2.5 h-2.5 rounded-full bg-[#846EFF]" />
                    )}
                  </div>
                )}
                <MarkdownRenderer
                  content={choice.description}
                  additionalClass="text-gray-700 text-sm [&_p]:!m-0"
                  disableCopy
                />
              </div>
              {cIndex < question.choices.length - 1 && (
                <div className="border-b border-gray-200 mx-5" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
