import { FaCheck, FaExclamationTriangle } from 'react-icons/fa';

export function EndAttemptModal({ openModal, setOpenModal, onEndAttempt, userResponses, totalCount }) {
  if (openModal !== 'endAttempt') return null;

  const answeredCount = userResponses.length;
  const hasUnanswered = answeredCount < totalCount;

  const handleConfirm = () => {
    setOpenModal(undefined);
    onEndAttempt(userResponses);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50" onClick={() => setOpenModal(undefined)}>
      <div className="bg-white rounded-2xl p-6 w-[90%] max-w-sm shadow-xl" onClick={e => e.stopPropagation()}>
        <div className="flex flex-col items-center text-center gap-3">
          <div className={`rounded-full p-4 ${hasUnanswered ? 'bg-yellow-100' : 'bg-[#E6F7FF]'}`}>
            {hasUnanswered
              ? <FaExclamationTriangle className="text-yellow-500 text-2xl" />
              : <FaCheck className="text-[#3DB1FF] text-2xl" />}
          </div>
          <div className="font-bold text-gray-800 text-lg">
            {hasUnanswered ? 'Unanswered questions' : 'Finish attempt?'}
          </div>
          <div className="text-gray-500 text-sm">
            {hasUnanswered
              ? `You have only answered ${answeredCount} of ${totalCount} questions. You can still go back and complete the rest.`
              : 'Your answers will be submitted and you will not be able to make changes.'}
          </div>
          {hasUnanswered && (
            <div className="text-xs text-gray-400">Unanswered questions will count as incorrect.</div>
          )}
        </div>
        <div className="flex gap-3 mt-6">
          <div
            className="flex-1 text-center border border-gray-300 text-gray-600 rounded-full py-2 text-sm font-medium cursor-pointer"
            onClick={() => setOpenModal(undefined)}
          >
            Go back
          </div>
          <div
            className="flex-1 text-center bg-[#3DB1FF] text-white rounded-full py-2 text-sm font-medium cursor-pointer"
            onClick={handleConfirm}
          >
            Finish
          </div>
        </div>
      </div>
    </div>
  );
}
