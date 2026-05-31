export function QuestionBlock({ question, index, selectedChoiceId, onChoiceChange }) {
  return (
    <div className="border-4 border-[#CEC5FF] rounded-xl mb-4 overflow-hidden p-1">
      <div className="px-5 pt-4 pb-3">
        <div className="font-bold text-gray-800 text-base">{question.description}</div>
      </div>
      <div className="border-b-2 mx-5 border-[#846EFF]" />
      <div>
        {question.choices.map((choice, cIndex) => (
          <div key={cIndex}>
            <div
              className="flex items-center gap-3 px-5 py-3 cursor-pointer"
              onClick={() => onChoiceChange(question.question_id, choice.choice_id)}
            >
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                selectedChoiceId === choice.choice_id
                  ? 'border-[#846EFF]'
                  : 'border-gray-400'
              }`}>
                {selectedChoiceId === choice.choice_id && (
                  <div className="w-2.5 h-2.5 rounded-full bg-[#846EFF]" />
                )}
              </div>
              <span className="text-gray-700 text-sm">{choice.description}</span>
            </div>
            {cIndex < question.choices.length - 1 && (
              <div className="border-b border-gray-200 mx-5" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
