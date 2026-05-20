import flagEN from '../../../assets/flags/gb.svg';
import flagES from '../../../assets/flags/es.svg';
import flagFR from '../../../assets/flags/fr.svg';
import flagDE from '../../../assets/flags/de.svg';
import flagIT from '../../../assets/flags/it.svg';
import flagPT from '../../../assets/flags/pt.svg';
import { FaGlobe, FaUser } from 'react-icons/fa';
import { useState } from 'react';
import { CreatorIcon } from '../../illustrations/icons/CreatorIcon';
import { LanguageIcon } from '../../illustrations/icons/LanguageIcon';
import { AllowedAttemptsIcon } from '../../illustrations/icons/AllowedAttemptsIcon';
import { SearchIcon } from '../../illustrations/icons/SearchIcon';
import { CategoryIcon } from '../../illustrations/icons/CategoryIcon';
import { TopicIcon } from '../../illustrations/icons/TopicIcon';
import { StoryIcon } from '../../illustrations/icons/StoryIcon';
import { CreationDateIcon } from '../../illustrations/icons/CreationDateIcon';
import { DifficultyLevelIcon } from '../../illustrations/icons/DifficultyLevelIcon';
import { MinScoreIcon } from '../../illustrations/icons/MinScoreIcon';
import { QuestionsIcon } from '../../illustrations/icons/QuestionsIcon';
import { RequirementIcon } from '../../illustrations/icons/RequirementIcon';
import { TimeDurationIcon } from '../../illustrations/icons/TimeDurationIcon';

const FLAG_MAP = { EN: flagEN, ES: flagES, FR: flagFR, DE: flagDE, IT: flagIT, PT: flagPT };

export function CreatorSettings({ assessment }) {
  const [showRequirements, setShowRequirements] = useState(false);
  const pill = "bg-[#E6E2FF] text-[#846EFF] rounded-full px-2 py-0.5 text-sm font-medium w-fit";
  const plain = "text-[#846EFF] text-sm font-medium";
  const label = "text-gray-500 text-sm flex items-center gap-1.5";
  const row = "grid grid-cols-2 gap-2 py-1.5";
  const icon = "w-4 h-4 flex-shrink-0";
  const langCode = assessment.language?.toUpperCase();

  return (
    <div className="mt-3 pb-3 border-b">
      <div className="font-semibold text-[#3DB1FF] mb-3">Creator-based settings</div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 px-3">
        <div>
          <div className={row}>
            <div className={label}><CreatorIcon color="#6B7280" className={icon} />Creator name</div>
            <div className={`${pill} flex items-center gap-1 max-w-[10.5rem] overflow-hidden`}>
              {assessment.user_avatar
                ? <img src={assessment.user_avatar} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaUser className="text-xs flex-shrink-0" />}
              <span className="truncate">{assessment.user_first_name} {assessment.user_last_name}</span>
            </div>
          </div>
          <div className={row}>
            <div className={label}><LanguageIcon color="#6B7280" className={icon} />Language</div>
            <div className={`${pill} flex items-center gap-1`}>
              {FLAG_MAP[langCode]
                ? <img src={FLAG_MAP[langCode]} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
                : <FaGlobe className="text-xs flex-shrink-0" />}
              {assessment.language_name}
            </div>
          </div>
          <div className={row}>
            <div className={label}><AllowedAttemptsIcon color="#6B7280" className={icon} />Allowed attempts</div>
            <div className={`${pill} flex items-center gap-1`}>
              <AllowedAttemptsIcon color="#846EFF" className="w-4 h-4 flex-shrink-0" />
              {assessment.available_attempts} / {assessment.allowed_attempts}
            </div>
          </div>
        </div>
        <div>
          <div className={row}>
            <div className={label}><CategoryIcon color="#6B7280" className={icon} />Related category</div>
            <div className={`${pill} flex items-center gap-1`}>
              <SearchIcon color="#846EFF" className="w-3.5 h-3.5 flex-shrink-0" />
              {assessment.category_name}
            </div>
          </div>
          <div className={row}>
            <div className={label}><TopicIcon color="#6B7280" className={icon} />Related topic</div>
            <div className={`${pill} flex items-center gap-1`}>
              <SearchIcon color="#846EFF" className="w-3.5 h-3.5 flex-shrink-0" />
              {assessment.topic_name}
            </div>
          </div>
          <div className={row}>
            <div className={label}><StoryIcon color="#6B7280" className={icon} />Related story</div>
            <div className={`${pill} flex items-center gap-1`}>
              <SearchIcon color="#846EFF" className="w-3.5 h-3.5 flex-shrink-0" />
              —
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 my-2 mx-3" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 px-3">
        <div>
          <div className={row}>
            <div className={label}><CreationDateIcon color="#6B7280" className={icon} />Creation date</div>
            <div className={`${plain} flex items-center gap-1`}>
              <CreationDateIcon color="#846EFF" className={icon} />
              {new Date(assessment.created_at).toLocaleDateString()}
            </div>
          </div>
          <div className={row}>
            <div className={label}><DifficultyLevelIcon color="#6B7280" className={icon} />Difficulty</div>
            <div className={`${plain} flex items-center gap-1`}>
              <DifficultyLevelIcon color="#846EFF" className={icon} />
              {assessment.difficulty?.toFixed(2)} / 10.00
            </div>
          </div>
          <div className={row}>
            <div className={label}><MinScoreIcon color="#6B7280" className={icon} />Minimum score</div>
            <div className={`${plain} flex items-center gap-1`}>
              <MinScoreIcon color="#846EFF" className={icon} />
              {assessment.min_score}%
            </div>
          </div>
        </div>
        <div>
          <div className={row}>
            <div className={label}><RequirementIcon color="#6B7280" className={icon} />Minimum requirements</div>
            {assessment.minimum_requirements
              ? <div className={`${plain} flex items-center gap-1 cursor-pointer`} onClick={() => setShowRequirements(true)}>
                  <RequirementIcon color="#846EFF" className={icon} />
                  See info
                </div>
              : <div className={`${plain} flex items-center gap-1`}>
                  <RequirementIcon color="#846EFF" className={icon} />
                  —
                </div>}
          </div>
          <div className={row}>
            <div className={label}><QuestionsIcon color="#6B7280" className={icon} />Number of questions</div>
            <div className={`${plain} flex items-center gap-1`}>
              <QuestionsIcon color="#846EFF" className={icon} />
              {assessment.number_of_questions}
            </div>
          </div>
          <div className={row}>
            <div className={label}><TimeDurationIcon color="#6B7280" className={icon} />Time limit</div>
            <div className={`${plain} flex items-center gap-1`}>
              <TimeDurationIcon color="#846EFF" className={icon} />
              {assessment.time_limit} mins
            </div>
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
