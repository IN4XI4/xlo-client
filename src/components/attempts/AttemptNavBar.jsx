import { useEffect, useState } from 'react';
import { FaChevronUp, FaChevronDown } from 'react-icons/fa';
import { FaCheck } from 'react-icons/fa6';
import { CiClock2, CiCircleQuestion } from 'react-icons/ci';

export function AttemptNavBar({ start_time, assessment_time_limit, onEndAttempt, userResponses, answeredCount, totalCount, onOpenFinishModal }) {
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const startTime = new Date(start_time).getTime();
    const timeLimitMillis = assessment_time_limit * 60 * 1000;

    const calculateTimeLeft = () => {
      const remaining = timeLimitMillis - (new Date().getTime() - startTime);
      const clamped = Math.max(0, remaining);
      setTimeLeft(clamped);
      if (remaining <= 0) {
        onEndAttempt(userResponses);
        clearInterval(timerId);
      }
    };

    calculateTimeLeft();
    const timerId = setInterval(calculateTimeLeft, 1000);
    return () => clearInterval(timerId);
  }, [start_time, assessment_time_limit, userResponses]);

  const minutes = timeLeft !== null ? Math.floor(timeLeft / 60000) : 0;
  const seconds = timeLeft !== null ? Math.floor((timeLeft / 1000) % 60) : 0;
  const timeStr = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  const scrollToBottom = () => window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });

  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center items-center p-3 z-30">
      <div className="flex items-center bg-white shadow-lg rounded-full py-2 px-4 gap-4">
        <div className="flex flex-col items-center cursor-pointer" onClick={scrollToTop}>
          <div className="border rounded-full p-2">
            <FaChevronUp className="text-[#3DB1FF]" />
          </div>
        </div>
        <div className="flex flex-col items-center cursor-pointer" onClick={scrollToBottom}>
          <div className="border rounded-full p-2">
            <FaChevronDown className="text-[#3DB1FF]" />
          </div>
        </div>
        <div className="flex flex-col items-center text-[#3DB1FF]">
          <CiClock2 className="text-xl flex-shrink-0" />
          <span className="font-semibold text-xs mt-0.5">{timeStr}</span>
        </div>
        <div className="flex flex-col items-center text-[#3DB1FF]">
          <CiCircleQuestion className="text-xl flex-shrink-0" />
          <span className="font-semibold text-xs mt-0.5">
            {String(answeredCount).padStart(2, '0')}|{String(totalCount).padStart(2, '0')}
          </span>
        </div>
        <div
          className="flex items-center gap-2 bg-[#3DB1FF] text-white rounded-full px-4 py-2 font-semibold text-sm cursor-pointer select-none"
          onClick={onOpenFinishModal}
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center">
            <FaCheck className="text-[#3DB1FF] text-xs" />
          </div>
          FINISH
        </div>
      </div>
    </div>
  );
}
