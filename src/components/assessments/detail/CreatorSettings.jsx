import flagEN from '../../../assets/flags/gb.svg';
import flagES from '../../../assets/flags/es.svg';
import flagFR from '../../../assets/flags/fr.svg';
import flagDE from '../../../assets/flags/de.svg';
import flagIT from '../../../assets/flags/it.svg';
import flagPT from '../../../assets/flags/pt.svg';
import { FaGlobe, FaUser } from 'react-icons/fa';
import { useState } from 'react';

const FLAG_MAP = { EN: flagEN, ES: flagES, FR: flagFR, DE: flagDE, IT: flagIT, PT: flagPT };

export function CreatorSettings({ assessment }) {
  const [showRequirements, setShowRequirements] = useState(false);
  const pill = "bg-[#E6E2FF] text-[#846EFF] rounded-full px-2 py-0.5 text-sm font-medium w-fit";
  const plain = "text-[#846EFF] text-sm font-medium";
  const label = "text-gray-500 text-sm";
  const row = "grid grid-cols-2 gap-2 py-1.5";
  const langCode = assessment.language?.toUpperCase();

  return (
    <div className="mt-3 pb-3 border-b">
      <div className="font-semibold text-[#3DB1FF] mb-3">Creator-based settings</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 px-3">
        <div>
          <div className={row}>
            <div className={label}>Creator name</div>
            <div className={`${pill} flex items-center gap-1 max-w-[10.5rem] overflow-hidden`}>
              {assessment.user_avatar
                ? <img src={assessment.user_avatar} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaUser className="text-xs flex-shrink-0" />}
              <span className="truncate">{assessment.user_first_name} {assessment.user_last_name}</span>
            </div>
          </div>
          <div className={row}>
            <div className={label}>Language</div>
            <div className={`${pill} flex items-center gap-1`}>
              {FLAG_MAP[langCode]
                ? <img src={FLAG_MAP[langCode]} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaGlobe className="text-xs flex-shrink-0" />}
              {assessment.language_name}
            </div>
          </div>
          <div className={row}>
            <div className={label}>Allowed attempts</div>
            <div className={pill}>{assessment.available_attempts} / {assessment.allowed_attempts}</div>
          </div>
        </div>
        <div>
          <div className={row}>
            <div className={label}>Related category</div>
            <div className={pill}>{assessment.category_name}</div>
          </div>
          <div className={row}>
            <div className={label}>Related topic</div>
            <div className={pill}>{assessment.topic_name}</div>
          </div>
          <div className={row}>
            <div className={label}>Related story</div>
            <div className={pill}>—</div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2 mx-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 px-3">
        <div>
          <div className={row}>
            <div className={label}>Creation date</div>
            <div className={plain}>{new Date(assessment.created_at).toLocaleDateString()}</div>
          </div>
          <div className={row}>
            <div className={label}>Difficulty</div>
            <div className={plain}>{assessment.difficulty?.toFixed(2)} / 10.00</div>
          </div>
          <div className={row}>
            <div className={label}>Minimum score</div>
            <div className={plain}>{assessment.min_score}%</div>
          </div>
        </div>
        <div>
          <div className={row}>
            <div className={label}>Minimum requirements</div>
            {assessment.minimum_requirements
              ? <div className={`${plain} cursor-pointer`} onClick={() => setShowRequirements(true)}>See info</div>
              : <div className={plain}>—</div>}
          </div>
          <div className={row}>
            <div className={label}>Number of questions</div>
            <div className={plain}>{assessment.number_of_questions}</div>
          </div>
          <div className={row}>
            <div className={label}>Time limit</div>
            <div className={plain}>{assessment.time_limit} mins</div>
          </div>
        </div>
      </div>
      {showRequirements && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-40" onClick={() => setShowRequirements(false)}>
          <div className="bg-white rounded-xl p-6 w-[90%] max-w-md shadow-lg" onClick={e => e.stopPropagation()}>
            <div className="font-semibold text-gray-700 mb-3">Minimum requirements</div>
            <div className="text-gray-500 text-sm">{assessment.minimum_requirements}</div>
            <div className="flex justify-end mt-4">
              <div className="bg-gray-200 text-gray-500 px-4 py-2 rounded-xl text-sm cursor-pointer" onClick={() => setShowRequirements(false)}>
                Close
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
