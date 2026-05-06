import { Link } from 'react-router-dom';
import { FaUser, FaChartLine, FaClock, FaStar, FaGlobe } from "react-icons/fa";
import { Tooltip } from 'flowbite-react';
import flagEN from '../../assets/flags/gb.svg';
import flagES from '../../assets/flags/es.svg';
import flagFR from '../../assets/flags/fr.svg';
import flagDE from '../../assets/flags/de.svg';
import flagIT from '../../assets/flags/it.svg';
import flagPT from '../../assets/flags/pt.svg';

const FLAG_MAP = { EN: flagEN, ES: flagES, FR: flagFR, DE: flagDE, IT: flagIT, PT: flagPT };

function Tag({ approved, children }) {
  return (
    <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium flex-shrink-0 
    ${approved ? 'bg-gray-100 text-gray-500' : 'bg-[#B3E0FF] text-[#0098FF]'}`}>
      {children}
    </div>
  );
}

export function AssessmentCard({ assessment }) {
  const approved = assessment.is_approved;
  const creatorName = [assessment.user_first_name, assessment.user_last_name].filter(Boolean).join(' ');

  return (
    <Link to={`/assessments/${assessment.id}`}
      className={`flex p-2 my-3 rounded-3xl border ${approved ? 'bg-[#3DB1FF]/40' : 'bg-gray-100'}`}>
      {assessment.image && (
        <div className="w-24 h-20 flex-shrink-0 overflow-hidden rounded-xl mr-2 self-center">
          <img src={assessment.image} alt={`${assessment.name} image`} className="w-full h-full object-cover" />
        </div>
      )}
      <div className="w-full overflow-hidden">
        <div className="flex justify-between pb-1">
          <div className="text-base font-bold leading-tight">{assessment.name}</div>
          <div className="text-gray-500 flex items-center gap-1 flex-shrink-0 ml-2 text-sm">
            {assessment.topic_image && (
              <img src={assessment.topic_image} alt="icon" className="w-5 h-5 rounded" />
            )}
            {assessment.topic_name}
          </div>
        </div>
        <div className="truncate text-gray-500 text-sm mb-1">
          {assessment.description}
        </div>
        <div className="flex flex-wrap gap-1">
          {creatorName && (
            <Tag approved={approved}>
              {assessment.user_avatar
                ? <img src={assessment.user_avatar}
                  className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaUser className="text-xs flex-shrink-0" />
              }
              {creatorName}
            </Tag>
          )}
          {assessment.language && (
            <Tag approved={approved}>
              {FLAG_MAP[assessment.language.toUpperCase()]
                ? <img src={FLAG_MAP[assessment.language.toUpperCase()]}
                  className="w-3.5 h-3.5 flex-shrink-0 rounded-full object-cover" alt="" />
                : <FaGlobe className="text-xs flex-shrink-0" />
              }
              {assessment.language.toUpperCase()}
            </Tag>
          )}
          {assessment.difficulty != null && (
            <Tooltip content="Difficulty">
              <Tag approved={approved}>
                <FaChartLine className="text-xs flex-shrink-0" />
                {assessment.difficulty.toFixed(1)}
              </Tag>
            </Tooltip>
          )}
          {assessment.time_limit != null && (
            <Tooltip content="Time limit">
              <Tag approved={approved}>
                <FaClock className="text-xs flex-shrink-0" />
                {assessment.time_limit} min
              </Tag>
            </Tooltip>
          )}
          {assessment.user_difficulty_rating != null && (
            <Tooltip content="Community difficulty">
              <Tag approved={approved}>
                <FaStar className="text-xs flex-shrink-0" />
                {assessment.user_difficulty_rating.toFixed(1)}
              </Tag>
            </Tooltip>
          )}
        </div>
      </div>
    </Link>
  );
}