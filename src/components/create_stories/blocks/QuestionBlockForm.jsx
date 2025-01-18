import React, { useState } from 'react'
import { TextInput } from 'flowbite-react'
import { FaMinus, FaPlus } from 'react-icons/fa6';


export function QuestionBlockForm({ control, currentCardIndex, currentBlockIndex, register, setImagePreviews, setValue,
  getValues, imagePreviews, errors }) {
  const [extraOptions, setExtraOptions] = useState([]);

  const handleAddIncorrectAnswer = () => {
    setExtraOptions([...extraOptions, extraOptions.length]);
  };

  const handleRemoveIncorrectAnswer = (indexToRemove) => {
    const updatedOptions = extraOptions.filter((_, index) => index !== indexToRemove);
    setExtraOptions(updatedOptions);

    const incorrectAnswers = getValues(
      `cards.${currentCardIndex}.blocks.${currentBlockIndex}.options.incorrect_answers`
    );

    const filteredAnswers = incorrectAnswers.filter((_, index) => index !== indexToRemove + 1);

    setValue(
      `cards.${currentCardIndex}.blocks.${currentBlockIndex}.options.incorrect_answers`,
      filteredAnswers
    );
  };

  return (
    <div>
      <div>
        <div className="font-semibold text-green-500">
          Correct answer <span className='text-red-500'>*</span>
        </div>
        <div className='py-3'>
          <TextInput
            placeholder='Insert your text here'
            {...register(
              `cards.${currentCardIndex}.blocks.${currentBlockIndex}.options.correct_answer.0`,
              { required: "Correct answer is required." }
            )} />
          {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.options?.correct_answer?.[0] &&
            <p className="text-red-500 pb-2 ps-2">
              {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.options?.correct_answer?.[0].message}
            </p>}
        </div>
      </div>
      <div>
        <div className="font-semibold text-red-500">
          Incorrect answer *
        </div>
        <div className='py-3'>
          <TextInput
            placeholder='Insert your text here'
            {...register(
              `cards.${currentCardIndex}.blocks.${currentBlockIndex}.options.incorrect_answers.0`,
              { required: "Incorrect answer is required." }
            )} />
          {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.options?.incorrect_answers?.[0] && (
            <p className="text-red-500 pb-2 ps-2">
              {errors.cards[currentCardIndex].blocks[currentBlockIndex].options.incorrect_answers[0].message}
            </p>
          )}
        </div>
      </div>
      {extraOptions.map((_, index) => (
        <div key={index}>
          <div className="font-semibold text-red-500">
            Incorrect Answer *
          </div>
          <div className="py-3 flex items-center">
            <TextInput
              className='flex-grow pe-3'
              placeholder="Insert your text here"
              {...register(
                `cards.${currentCardIndex}.blocks.${currentBlockIndex}.options.incorrect_answers.${index + 1}`,
                { required: "Additional incorrect answer is required." }
              )}
            />
            {errors.cards?.[currentCardIndex]?.blocks?.[currentBlockIndex]?.options?.incorrect_answers?.[
              index + 1
            ] && (
                <p className="text-red-500 pb-2 ps-2">
                  {
                    errors.cards[currentCardIndex].blocks[currentBlockIndex].options.incorrect_answers[
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
      <div className="md:pt-2">
        <button type="button" onClick={handleAddIncorrectAnswer} 
        className='flex bg-[#5B0FFE] items-center p-2 rounded-full md:rounded-lg text-white'>
          <FaPlus/> <span className='hidden md:block md:ps-2'>Add Incorrect Answer</span>
        </button>
      </div>
    </div>
  )
}
