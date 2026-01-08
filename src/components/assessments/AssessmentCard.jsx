import { Link } from 'react-router-dom';
import { CiImageOn } from "react-icons/ci";
import { FaChartLine, FaClock } from "react-icons/fa";
import { FaRepeat } from "react-icons/fa6";

const getDifficultyColor = (difficulty) => {
  if (difficulty < 4) {
    return 'text-green-600';
  } else if (difficulty >= 4 && difficulty <= 7) {
    return 'text-yellow-300';
  } else {
    return 'text-red-600';
  }
}

export function AssessmentCard({ assessment }) {
  return (
    <div className="flex px-3 py-2 bg-gray-100 my-3 rounded-lg">
      <div className="flex justify-center items-center me-3">
        <Link to={`/assessments/${assessment.id}`} className="w-24 h-16 flex justify-center items-center">
          {assessment.image ? (
            <img src={assessment.image} alt={`${assessment.name} image`} className="object-cover max-h-full max-w-full rounded-lg" />
          ) : (
            <div className='flex justify-center items-center bg-teal-900 rounded-lg w-full h-full'>
              <CiImageOn size={32} className="text-white" />
            </div>
          )}
        </Link>
      </div>
      <div className="w-full overflow-hidden">
        <div className='flex justify-between pb-1'>
          <div className="text-xl font-bold">
            <Link to={`/assessments/${assessment.id}`}>
              {assessment.name}
            </Link>
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
        <div className="text-gray-500 flex pt-1">
          <div className='ps-1'>{assessment.user_username}</div>
          <div className='flex items-center px-3'>
            <FaRepeat className='text-teal-900' />
            <div className='ps-1'>{assessment.attempts_count}</div>
          </div>
          <div className={`flex items-center px-3`}>
            <FaChartLine className='text-teal-900' />
            <div className={`ps-1 ${getDifficultyColor(assessment.difficulty)} font-semibold`}>
              {assessment.difficulty.toFixed(2)}
            </div>
          </div>
          <div className='flex items-center px-3'>
            <FaClock className='text-teal-900' />
            <div className='ps-1'>{assessment.time_limit} mins</div>
          </div>
        </div>
      </div>
    </div>
  );
}