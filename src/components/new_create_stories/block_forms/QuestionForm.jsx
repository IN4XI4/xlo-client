import React, { useEffect, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { FaMinus, FaPlus } from 'react-icons/fa';


export function QuestionForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, imagePreviews, getValues, setValue
}) {
  const [extraOptions, setExtraOptions] = useState([]);
  const color = globalSoftskill?.color || "#3DB1FF";

  const name = `cards.${cardIndex}.blocks.${blockIndex}.content`;
  const reg = register(name, { required: "Content is required" });
  const autosize = (el) => {
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  };

  useEffect(() => {
    const incorrectAnswers = getValues(
      `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers`
    );
    if (incorrectAnswers && incorrectAnswers.length > 1) {
      setExtraOptions(Array.from({ length: incorrectAnswers.length - 1 }, (_, i) => i));
    }
  }, [getValues, cardIndex, blockIndex]);

  const handleAddIncorrectAnswer = () => {
    setExtraOptions([...extraOptions, extraOptions.length]);
  };

  const handleRemoveIncorrectAnswer = (indexToRemove) => {
    const updatedOptions = extraOptions.filter((_, index) => index !== indexToRemove);
    setExtraOptions(updatedOptions);

    const incorrectAnswers = getValues(
      `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers`
    );

    const filteredAnswers = incorrectAnswers.filter((_, index) => index !== indexToRemove + 1);

    setValue(
      `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers`,
      filteredAnswers
    );
  };
  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]' style={{ borderColor: color }}>
      <div className='pb-2 border-b-2' style={{ borderColor: color }}>
        <textarea
          id="content"
          placeholder="Insert question here *"
          {...reg}
          ref={(el) => {
            reg.ref(el);
            if (!el) return;
            requestAnimationFrame(() => autosize(el));
          }}
          className="w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0"
          rows={1}
          onInput={(e) => {
            e.target.style.height = "auto";
            e.target.style.height = `${e.target.scrollHeight}px`;
          }}
        />
        {errors.cards?.blocks?.content && (
          <p className="text-red-500 text-sm mt-1">{errors.cards?.blocks?.content.message}</p>
        )}
      </div>
      <div className='py-3 flex items-center md:px-3'>
        <input
          type="radio"
          className='me-3'
          checked={true}
          readOnly
        />
        <input
          placeholder='Insert correct answer here'
          className='w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0'
          {...register(
            `cards.${cardIndex}.blocks.${blockIndex}.options.correct_answer.0`,
            { required: "Correct answer is required." }
          )} />
        {errors.cards?.[cardIndex]?.blocks?.[blockIndex]?.options?.correct_answer?.[0] &&
          <p className="text-red-500 pb-2 ps-2">
            {errors.cards?.[cardIndex]?.blocks?.[blockIndex]?.options?.correct_answer?.[0].message}
          </p>}
      </div>
      <div className='py-3 flex items-center md:px-3'>
        <input
          type="radio"
          className='me-3'
          checked={false}
          readOnly
        />
        <input
          placeholder='Insert incorrect answer here'
          className='w-full bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none py-0'
          {...register(
            `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers.0`,
            { required: "Incorrect answer is required." }
          )} />
        {errors.cards?.[cardIndex]?.blocks?.[blockIndex]?.options?.incorrect_answers?.[0] && (
          <p className="text-red-500 pb-2 ps-2">
            {errors.cards[cardIndex].blocks[blockIndex].options.incorrect_answers[0].message}
          </p>
        )}
      </div>
      {extraOptions.map((_, index) => (
        <div key={index}>
          <div className="py-3 flex items-center md:px-3">
            <input
              type="radio"
              className='me-3'
              checked={false}
              readOnly
            />
            <input
              className='flex-grow pe-3 bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none'
              placeholder="Insert incorrect answer here"
              {...register(
                `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers.${index + 1}`,
                { required: "Additional incorrect answer is required." }
              )}
            />
            {errors.cards?.[cardIndex]?.blocks?.[blockIndex]?.options?.incorrect_answers?.[
              index + 1
            ] && (
                <p className="text-red-500 pb-2 ps-2">
                  {
                    errors.cards[cardIndex].blocks[blockIndex].options.incorrect_answers[
                      index + 1
                    ].message
                  }
                </p>
              )}
            <div>
              <button
                type="button"
                onClick={() => handleRemoveIncorrectAnswer(index)}
                className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center"
              >
                <FaMinus />
              </button>
            </div>
          </div>
        </div>
      ))}
      <div className="md:pt-2 pb-2">
        <button type="button" onClick={handleAddIncorrectAnswer}
          className='flex bg-[#5B0FFE] items-center p-2 rounded-full text-white'>
          <FaPlus />
        </button>
      </div>
      {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
        <div className='flex items-center justify-center py-3 border-t-2' style={{ borderColor: color }}>
          <img
            src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
            alt="Preview"
            className='max-h-[400px] rounded-lg'
          />
        </div>
      ) : (
        <div></div>
      )}
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
