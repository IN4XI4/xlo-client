import MarkdownRenderer from '../MardownRenderer';

export function ChoiceBlock({ choice, isMultiple, isSelected, isLast, onSelect }) {
  return (
    <div>
      <div
        className="flex items-center gap-3 px-5 py-3 cursor-pointer"
        onClick={onSelect}
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
      {!isLast && (
        <div className="border-b border-gray-200 mx-5" />
      )}
    </div>
  );
}
