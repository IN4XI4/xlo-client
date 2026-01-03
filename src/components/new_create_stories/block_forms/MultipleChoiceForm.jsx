import React, { useEffect, useState } from 'react'
import { SelectTypeForm } from './SelectTypeForm'
import { FaMinus, FaPlus } from 'react-icons/fa';


export function MultipleChoiceForm({ cardIndex, blockIndex, register, errors, globalMentor, globalSoftskill, showTypeSelector,
  value, onSelect, getValues, setValue, imagePreviews
}) {
  const [options, setOptions] = useState([]);
  const MIN_OPTIONS = 3;

  const uid = () =>
    (typeof crypto !== "undefined" && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(16).slice(2)}`;

  useEffect(() => {

    const correctPath = `cards.${cardIndex}.blocks.${blockIndex}.options.correct_answers`;
    const incorrectPath = `cards.${cardIndex}.blocks.${blockIndex}.options.incorrect_answers`;

    const rawCorrect = getValues(correctPath) || [];
    const rawIncorrect = getValues(incorrectPath) || [];

    const correctAnswers = rawCorrect.filter(v => v !== undefined);
    const incorrectAnswers = rawIncorrect.filter(v => v !== undefined);

    const hasRealData =
      [...correctAnswers, ...incorrectAnswers].some(
        (v) => (v ?? "").toString().trim().length > 0
      ) || options.length > 1;

    if (!hasRealData) {

      setOptions([
        { id: uid(), correct: true, pos: 0, value: "" },
        { id: uid(), correct: true, pos: 1, value: "" },
        { id: uid(), correct: false, pos: 0, value: "" },
      ]);
      return;
    }

    setOptions([
      ...correctAnswers.map((v, pos) => ({ id: uid(), correct: true, pos, value: v ?? "" })),
      ...incorrectAnswers.map((v, pos) => ({ id: uid(), correct: false, pos, value: v ?? "" })),
    ]);
  }, [cardIndex, blockIndex]);

  const handleAddAnswer = () => {
    setOptions((prev) => {
      const nextPos = prev.filter((o) => o?.correct === false).length;
      return [...prev, { id: uid(), correct: false, pos: nextPos, value: "" }];
    });
  };


  const handleRemoveAnswer = (indexToRemove) => {
    if (options.length <= MIN_OPTIONS) return;

    const removed = options[indexToRemove];
    if (!removed) return;

    const correctCount = options.filter(o => o?.correct).length;
    if (removed.correct && correctCount <= 2) return;

    const fieldKey = removed.correct ? "correct_answers" : "incorrect_answers";
    const base = `cards.${cardIndex}.blocks.${blockIndex}.options.${fieldKey}`;
    const answers = getValues(base) || [];
    const filteredAnswers = answers.filter((_, i) => i !== removed.pos);
    setValue(base, filteredAnswers, { shouldValidate: false, shouldDirty: true });

    setOptions((prev) => {
      const removedPrev = prev[indexToRemove];
      const next = prev.filter((_, i) => i !== indexToRemove);

      return next.map((o) => {
        if (o.correct !== removedPrev.correct) return o;
        if (o.pos > removedPrev.pos) return { ...o, pos: o.pos - 1 };
        return o;
      });
    });
  };

  const handleToggleCorrect = (index) => {
    const opt = options[index];
    if (!opt) return;

    const correctCount = options.filter(o => o?.correct).length;
    if (opt.correct && correctCount <= 2) return;

    const oldKey = opt.correct ? "correct_answers" : "incorrect_answers";
    const newKey = opt.correct ? "incorrect_answers" : "correct_answers";

    const baseOld = `cards.${cardIndex}.blocks.${blockIndex}.options.${oldKey}`;
    const baseNew = `cards.${cardIndex}.blocks.${blockIndex}.options.${newKey}`;

    const oldArr = getValues(baseOld) || [];
    const newArr = getValues(baseNew) || [];

    const movedValue = oldArr[opt.pos] ?? "";

    const oldNext = oldArr.filter((_, i) => i !== opt.pos);
    const newPos = newArr.length;
    const newNext = [...newArr, movedValue];

    setValue(baseOld, oldNext, { shouldValidate: false, shouldDirty: true });
    setValue(baseNew, newNext, { shouldValidate: false, shouldDirty: true });

    setOptions((prev) =>
      prev.map((o, i) => {
        if (i === index) {
          return { ...o, correct: !o.correct, pos: newPos };
        }
        if (o.correct === opt.correct && o.pos > opt.pos) {
          return { ...o, pos: o.pos - 1 };
        }
        return o;
      })
    );
  };


  return (
    <div className=' p-3 bg-gray-50 shadow rounded-2xl border-[4px]'>
      <div className=''>
        <textarea
          id="content"
          placeholder="Insert question here *"
          {...register(`cards.${cardIndex}.blocks.${blockIndex}.content`, { required: "Content is required" })}
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
      {imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`] ? (
        <div className='col-span-2 md:col-span-4 flex items-center justify-center py-3'>
          <img
            src={imagePreviews[`cards.${cardIndex}.blocks.${blockIndex}.image`]}
            alt="Preview"
            className='max-h-[400px] rounded-lg'
          />
        </div>
      ) : (
        <div></div>
      )}
      {options.map((opt, index) => {
        if (!opt) return null;
        const fieldKey = opt.correct ? "correct_answers" : "incorrect_answers";
        const fieldPath = `cards.${cardIndex}.blocks.${blockIndex}.options.${fieldKey}.${opt.pos}`;

        const fieldError =
          errors?.cards?.[cardIndex]?.blocks?.[blockIndex]?.options?.[fieldKey]?.[opt.pos];

        const canRemove = options.length > 3;
        const correctCount = options.filter(o => o?.correct).length;
        const disableUncheck = opt.correct && correctCount <= 2;

        return (
          <div key={opt.id}>
            <div className="py-3 flex items-center md:px-3">
              <input
                type="checkbox"
                className='me-3 rounded'
                checked={!!opt.correct}
                disabled={disableUncheck}
                onChange={() => {
                  if (disableUncheck) return;
                  handleToggleCorrect(index);
                }}
              />
              <input
                className='flex-grow pe-3 bg-transparent border-none focus:outline-none focus:ring-0 focus:shadow-none'
                placeholder="Insert answer here"
                {...register(fieldPath, {
                  required: opt.correct
                    ? "Correct answer is required."
                    : "Incorrect answer is required.",
                })}
              />
              {fieldError && (
                <p className="text-red-500 pb-2 ps-2">{fieldError.message}</p>
              )}
              {canRemove && (
                <div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAnswer(index)}
                    className="bg-[#FD4E3F] p-2 rounded-full text-white flex items-center"
                  >
                    <FaMinus />
                  </button>
                </div>
              )}

            </div>
          </div>
        )
      }
      )}
      <div className="md:pt-2 pb-2">
        <button type="button" onClick={handleAddAnswer}
          className='flex bg-[#5B0FFE] items-center p-2 rounded-full md:rounded-lg text-white'>
          <FaPlus /> <span className='hidden md:block md:ps-2'>Add answer</span>
        </button>
      </div>
      {showTypeSelector &&
        <div className='text-gray-500 pb-1 border-t-2 border-gray-200'>
          <SelectTypeForm value={value} onSelect={onSelect} size='small' />
        </div>}
    </div>
  )
}
