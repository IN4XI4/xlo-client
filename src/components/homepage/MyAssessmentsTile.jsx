import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaChartLine, FaClock, FaGlobe, FaUser } from 'react-icons/fa';
import { filterAssessments } from '../../api/assessments.api';
import { assessmentUrl } from '../../utils/slugify';
import flagEN from '../../assets/flags/gb.svg';
import flagES from '../../assets/flags/es.svg';
import flagFR from '../../assets/flags/fr.svg';
import flagDE from '../../assets/flags/de.svg';
import flagIT from '../../assets/flags/it.svg';
import flagPT from '../../assets/flags/pt.svg';
import { QuestionsIcon } from '../illustrations/icons/QuestionsIcon';
import { HoverTooltip } from '../HoverTooltip';
import { MyAssessmentsTileSkeleton } from './MyAssessmentsTileSkeleton';

const FLAG_MAP = { EN: flagEN, ES: flagES, FR: flagFR, DE: flagDE, IT: flagIT, PT: flagPT };
const TOP_ASSESSMENTS_COUNT = 3;

// The top list is the same for every user and changes rarely, so it's kept for the
// session: returning to the home shows it instantly while it refreshes in the background.
let cachedTopAssessments = null;

// className goes on the tooltip wrapper, which is the flex item of the pills row.
function Pill({ tooltip, className = 'flex-shrink-0', children }) {
  return (
    <HoverTooltip content={tooltip} className={className}>
      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#BFBBFC] text-[#6155F5]">
        {children}
      </div>
    </HoverTooltip>
  );
}

const VISIBILITY = {
  compact: { topic: 'hidden lg:block 2xl:hidden', creator: 'hidden sm:block 2xl:hidden' },
  full: { topic: '', creator: 'hidden sm:block' },
};

function AssessmentRow({ assessment, visibility }) {
  const pills = [];
  const creatorName = [assessment.user_first_name, assessment.user_last_name].filter(Boolean).join(' ');

  if (creatorName) {
    pills.push(
      <Pill key="creator" tooltip="Created by" className={`${visibility.creator} min-w-0`}>
        <FaUser className="flex-shrink-0" />
        <span className="truncate">{creatorName}</span>
      </Pill>
    );
  }

  if (assessment.language) {
    const flag = FLAG_MAP[assessment.language.toUpperCase()];
    pills.push(
      <Pill key="lang" tooltip="Language">
        {flag
          ? <img src={flag} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
          : <FaGlobe className="flex-shrink-0" />}
        {assessment.language.toUpperCase()}
      </Pill>
    );
  }
  if (assessment.time_limit != null) {
    pills.push(
      <Pill key="time" tooltip="Time limit"><FaClock className="flex-shrink-0" />{assessment.time_limit} min</Pill>
    );
  }
  if (assessment.difficulty != null) {
    pills.push(
      <Pill key="diff" tooltip="Difficulty"><FaChartLine className="flex-shrink-0" />{assessment.difficulty.toFixed(1)}</Pill>
    );
  }
  if (assessment.number_of_questions != null) {
    pills.push(
      <Pill key="questions" tooltip="Questions">
        <QuestionsIcon color="#6155F5" className="w-3 h-3 flex-shrink-0" />
        {assessment.number_of_questions}
      </Pill>
    );
  }

  return (
    <Link to={assessmentUrl(assessment)} className="bg-[#EFEEFE] rounded-xl flex items-center gap-2 mb-1 p-1.5 border-gray-100 last:mb-0">
      {assessment.image && (
        <img
          src={assessment.image}
          alt=""
          width={48}
          height={40}
          decoding="async"
          className="w-12 h-10 flex-shrink-0 rounded-lg object-cover"
        />
      )}
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        {assessment.topic_name && (
          <div className={`${visibility.topic} text-gray-400 italic text-xs truncate`}>{assessment.topic_name}</div>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-semibold text-sm truncate">{assessment.name}</span>
        </div>
        {pills.length > 0 && (
          <div className="flex flex-wrap gap-1">{pills}</div>
        )}
      </div>
    </Link>
  );
}

export function MyAssessmentsTile({ variant = 'compact' }) {
  const visibility = VISIBILITY[variant];
  const [isOpen, setIsOpen] = useState(true);
  const [topAssessments, setTopAssessments] = useState(cachedTopAssessments ?? []);
  const [loading, setLoading] = useState(!cachedTopAssessments);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    filterAssessments({ ordering: '-attempts_count', pageSize: TOP_ASSESSMENTS_COUNT })
      .then(r => {
        const results = r.data.results ?? r.data;
        cachedTopAssessments = results;
        if (cancelled) return;
        setTopAssessments(results);
        setError(null);
      })
      .catch(err => {
        console.error('Failed to load top assessments:', err);
        if (!cancelled) setError(err);
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const renderList = () => {
    if (loading) {
      return Array.from({ length: TOP_ASSESSMENTS_COUNT }).map((_, i) => (
        <MyAssessmentsTileSkeleton key={i} topicClassName={visibility.topic} />
      ));
    }
    // With cached data a failed refresh keeps showing it; the error only shows when there's nothing.
    if (error && topAssessments.length === 0) {
      return <div className="text-[#6155F5] text-xs opacity-60 py-2">Could not load assessments</div>;
    }
    if (topAssessments.length === 0) {
      return <div className="text-[#6155F5] text-xs opacity-60 py-2">No assessments yet</div>;
    }
    return topAssessments.map(a => <AssessmentRow key={a.id} assessment={a} visibility={visibility} />);
  };

  return (
    <div className="h-full flex flex-col">
      <div className={`bg-[#DFDDFD] rounded-xl px-6 py-3 lg:p-3 ${isOpen ? 'flex-grow flex flex-col' : ''}`}>
        <div className="flex items-center" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex-grow pe-3 cursor-pointer">
            <div className="text-[#6155F5] font-bold md:text-xl xl:text-2xl border-b-2 border-[#6155F5]">
              Top assessments
            </div>
            <div className="text-end text-[#6155F5] text-sm pb-1">
              [Mixelo assessments]
            </div>
          </div>
          <div className="text-[#6155F5] text-xl cursor-pointer">
            {isOpen ? <FiChevronUp /> : <FiChevronDown />}
          </div>
        </div>
        {isOpen && (
          <div className="flex-grow flex flex-col">
            <div className="flex-grow pt-2 pb-1">
              <div className="bg-white rounded-xl p-1.5">
                {renderList()}
              </div>
            </div>
            <div className="flex justify-center pt-1">
              <Link
                to="/assessments"
                className="bg-[#6155F5] text-white uppercase text-sm tracking-wide rounded-full px-8 py-2 hover:bg-[#4F43E0]"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                See all assessments
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
