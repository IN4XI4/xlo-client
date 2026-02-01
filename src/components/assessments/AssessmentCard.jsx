import { Link } from 'react-router-dom';
import { FaChartLine, FaClock } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";
import { Tooltip } from 'flowbite-react';


const getDifficultyColor = (difficulty) => {
  if (difficulty < 4) {
    return 'text-green-600';
  } else if (difficulty >= 4 && difficulty <= 7) {
    return 'text-yellow-400';
  } else {
    return 'text-red-600';
  }
}

export function AssessmentCard({ assessment }) {
  return (
    <Link to={`/assessments/${assessment.id}`} className="flex px-1 lg:px-3 py-2 bg-gray-100 my-3 rounded-lg">
      <div className="flex justify-center items-center lg:me-3">
        {assessment.image ? (
          <div  className="w-24 h-16 flex justify-center items-center">
            <img src={assessment.image} alt={`${assessment.name} image`} className="object-cover max-h-full max-w-full rounded-lg" />
          </div>
        ) : (
          <div></div>
        )}
      </div>
      <div className="w-full overflow-hidden">
        <div className='flex justify-between pb-1'>
          <div className="text-xl font-bold">
              {assessment.name}
          </div>
          <div className="text-gray-500 flex items-center">
            <div className='pe-1'>
              {assessment.topic_image && (
                <img src={assessment.topic_image} alt="icon" className='w-5 h-5 rounded' />
              )}
            </div>
            {assessment.topic_name}
          </div>
        </div>
        <div className='truncate'>{assessment.description}</div>
        <div className="text-gray-500 flex pt-1 items-center flex-wrap">
          <div className='pe-3'>{assessment.user_first_name} {assessment.user_last_name}</div>
          <div className='flex items-center pe-3'>
            <Tooltip content="Attempts count">
              <FaRepeat className='text-gray-500' />
            </Tooltip>
            <div className='ps-1'>{assessment.attempts_count}</div>
          </div>
          <div className={`flex items-center pe-3`}>
            <Tooltip content="Difficulty">
              <FaChartLine className='text-gray-500' />
            </Tooltip>
            <div className={`ps-1 ${getDifficultyColor(assessment.difficulty)} font-semibold`}>
              {assessment.difficulty.toFixed(2)}
            </div>
          </div>
          <div className='flex items-center pe-3'>
            <Tooltip content="Time limit">
              <FaClock className='text-gray-500' />
            </Tooltip>
            <div className='ps-1'>{assessment.time_limit} mins</div>
          </div>
        </div>
      </div>
    </Link>
  );
}