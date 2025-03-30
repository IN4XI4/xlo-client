import React, { useState } from "react";

import { BlockContainer } from "./BlockContainer";
import MarkdownRenderer from "../MardownRenderer";
import { ImageContainer } from "./ImageContainer";


const QuestionContent = ({ children, additionalClass, image, blockOptions }) => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [hasChecked, setHasChecked] = useState(false);

  const options = React.useMemo(() => {
    const allOptions = [
      ...blockOptions.correct_answer,
      ...blockOptions.incorrect_answers,
    ];
    return allOptions.sort(() => Math.random() - 0.5);
  }, [blockOptions]);

  const handleCheck = () => {
    if (selectedOption === null) {
      setIsCorrect(null);
      return;
    }
    setIsCorrect(blockOptions.correct_answer.includes(selectedOption));
    setHasChecked(true);
  };

  return (
    <div
      className={`flex-grow p-2 shadow rounded-2xl border-[5px] ${additionalClass}`}
    >
      <div className="p-3 rounded-lg items-center">
        <MarkdownRenderer content={children} additionalClass="text-lg" />
        <div className="border-t-2 mt-3 bg-red-500">
          {options.map((option, index) => (
            <label
              key={index}
              className={`flex items-center gap-2 p-2 cursor-pointer bg-white`}
            >
              <input
                type="radio"
                value={option}
                checked={selectedOption === option}
                onChange={() => setSelectedOption(option)}
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


export function QuestionBlock({ content, image, user_has_liked, user_has_recalled, onLikeClick, isAuthenticated, block_id,
  onRecallUpdate, blockOptions, isPreview = false, isRecall = false }) {
  const hasLiked = user_has_liked !== false;
  return (
    <div>
      <BlockContainer
        hasLiked={hasLiked}
        userHasRecalled={user_has_recalled}
        onLikeClick={onLikeClick}
        isAuthenticated={isAuthenticated}
        block_id={block_id}
        image={image}
        blockOptions={blockOptions}
        isPreview={isPreview}
        isRecall={isRecall}
        CustomContent={QuestionContent}
        onRecallUpdate={onRecallUpdate}
        content={content}>{content}
      </BlockContainer>
    </div>
  )
}

