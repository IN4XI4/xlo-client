import React, { useState, useEffect } from 'react'
import { FaSpinner } from 'react-icons/fa';
import { getMyDifficultyRating, createOrUpdateDifficultyRating } from '../../api/assessments.api';

export function DifficultyRatingModal({ assessmentId, onConfirm, onCancel }) {
  const [selected, setSelected] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadExistingRating = async () => {
      try {
        const res = await getMyDifficultyRating(assessmentId);
        if (res.data) {
          setSelected(res.data.difficulty);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    loadExistingRating();
  }, [assessmentId]);

  const handleConfirm = async () => {
    if (selected === null || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createOrUpdateDifficultyRating(assessmentId, selected);
      onConfirm();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-40" onClick={onCancel}>
      <div
        className="relative top-40 mx-auto p-6 border w-[90%] md:w-80 shadow-lg rounded-md bg-white"
        onClick={handleModalClick}
      >
        <h3 className="text-lg font-bold text-gray-900 mb-3">Rate Difficulty</h3>
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <FaSpinner className="text-[#3DB1FF] text-3xl animate-spin" />
          </div>
        ) : (
          <>
            <div className="grid grid-cols-5 gap-2 mb-2">
              {Array.from({ length: 10 }, (_, i) => i + 1).map((num) => (
                <button
                  key={num}
                  onClick={() => setSelected(num)}
                  className={`py-2 rounded-lg text-sm font-semibold border transition-colors
                    ${selected === num
                      ? 'bg-[#3DB1FF] text-white border-[#3DB1FF]'
                      : 'bg-white text-gray-600 border-gray-300 hover:border-[#3DB1FF] hover:text-[#3DB1FF]'}`}
                >
                  {num}
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-400 mb-5">1 = Easiest &nbsp;·&nbsp; 10 = Hardest</p>
            <div className="flex justify-end gap-2">
              <button
                className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm"
                onClick={onCancel}
              >
                Cancel
              </button>
              <button
                className={`px-4 py-2 rounded-xl text-sm text-white transition-colors
                  ${selected !== null && !isSubmitting ? 'bg-[#3DB1FF] hover:bg-[#2da0ee]' : 'bg-gray-300 cursor-not-allowed'}`}
                onClick={handleConfirm}
                disabled={selected === null || isSubmitting}
              >
                {isSubmitting ? <FaSpinner className="animate-spin" /> : 'Accept'}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
