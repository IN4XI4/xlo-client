import React, { useEffect, useState } from 'react'

import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";


const shuffle = (arr) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};


const MultichoiceQuestionContent = ({ children, additionalClass, image, blockOptions, color }) => {

  const [selectedOptions, setSelectedOptions] = useState([]);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  const correct = Array.isArray(blockOptions?.correct_answers) ? blockOptions.correct_answers : [];
  const incorrect = Array.isArray(blockOptions?.incorrect_answers) ? blockOptions.incorrect_answers : [];

  const allOptions = React.useMemo(
    () => [...correct, ...incorrect].filter(v => (v ?? "").toString().trim().length > 0),
    [correct, incorrect]
  );

  const [shuffledOptions, setShuffledOptions] = useState(null);

  useEffect(() => {
    if (shuffledOptions !== null) return;
    if (allOptions.length === 0) return;
    setShuffledOptions(shuffle(allOptions));
  }, [allOptions, shuffledOptions]);

  const toggleOption = (option) => {
    setSelectedOptions((prev) => {
      if (prev.includes(option)) return prev.filter((o) => o !== option);
      return [...prev, option];
    });
  };

  const handleCheck = () => {
    if (selectedOptions.length === 0) {
      setIsCorrect(null);
      return;
    }

    const selectedSet = new Set(selectedOptions);
    const correctSet = new Set(correct);

    const pickedAllCorrect = correct.every((c) => selectedSet.has(c));
    const pickedNoIncorrect = selectedOptions.every((s) => correctSet.has(s));
    const exactMatch = pickedAllCorrect && pickedNoIncorrect;

    setIsCorrect(exactMatch);
    setHasChecked(true);
  };

  if (!shuffledOptions) {
    return (
      <div className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
        style={{ borderColor: color || "#3DB1FF" }}>
        <div className="p-3 rounded-lg items-center">
          <MarkdownRenderer content={children} additionalClass="text-lg" />
        </div>
      </div>
    );
  }

  return (
    <div
      className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`} style={{ borderColor: color || "#3DB1FF" }}
    >
      <div className="p-3 rounded-lg items-center">
        <MarkdownRenderer content={children} additionalClass="text-lg" />
        <div className="border-t-2 mt-3 bg-red-500"  style={{ borderColor: color || "#3DB1FF" }}>
          {shuffledOptions.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 p-2 cursor-pointer bg-white`}
            >
              <input
                className='rounded'
                type="checkbox"
                value={option}
                checked={selectedOptions.includes(option)}
                onChange={() => toggleOption(option)}
                disabled={hasChecked}
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        <ImageContainer image={image} />
        <div className="flex justify-center">
          <button
            onClick={handleCheck}
            className={`px-4 py-2 rounded-lg shadow text-white ${hasChecked
              ? "bg-gray-400 cursor-not-allowed" : "bg-blue-500 hover:bg-blue-600"}`}
            disabled={hasChecked}
          >
            Check answer
          </button>
        </div>

        {isCorrect !== null && (
          <div
            className={`mt-2 text-lg text-white rounded-lg p-1 text-center font-bold 
              ${isCorrect ? "bg-[#3DB1FF]" : "bg-[#FD4E3F]"}`}
          >
            {isCorrect ? "Your response is correct!" : "Your response is incorrect!"}
          </div>
        )}
      </div>
    </div>
  );
}

export function MultiChoiceQuestionBlock({ content, image, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated,
  block_id, onRecallUpdate, color, blockOptions, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        color={color}
        image={image}
        blockOptions={blockOptions}
        isPreview={isPreview}
        isRecall={isRecall}
        CustomContent={MultichoiceQuestionContent}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

