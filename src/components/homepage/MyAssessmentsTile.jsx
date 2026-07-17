import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { FaChartLine, FaClock, FaGlobe } from 'react-icons/fa';
import { filterAssessments } from '../../api/assessments.api';
import { assessmentUrl } from '../../utils/slugify';
import flagEN from '../../assets/flags/gb.svg';
import flagES from '../../assets/flags/es.svg';
import flagFR from '../../assets/flags/fr.svg';
import flagDE from '../../assets/flags/de.svg';
import flagIT from '../../assets/flags/it.svg';
import flagPT from '../../assets/flags/pt.svg';

const FLAG_MAP = { EN: flagEN, ES: flagES, FR: flagFR, DE: flagDE, IT: flagIT, PT: flagPT };

function Pill({ children }) {
  return (
    <div className="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs bg-[#BFBBFC] text-[#6155F5] flex-shrink-0">
      {children}
    </div>
  );
}

function AssessmentRow({ assessment, index, variant }) {
  const pills = [];
  const visibleOnlyOnMobile = variant !== 'full';

  if (assessment.language) {
    const flag = FLAG_MAP[assessment.language.toUpperCase()];
    pills.push(
      <Pill key="lang">
        {flag
          ? <img src={flag} className="w-3.5 h-3.5 rounded-full object-cover flex-shrink-0" alt="" />
          : <FaGlobe className="flex-shrink-0" />}
        {assessment.language.toUpperCase()}
      </Pill>
    );
  }
  if (assessment.time_limit != null) {
    pills.push(
      <Pill key="time"><FaClock className="flex-shrink-0" />{assessment.time_limit} min</Pill>
    );
  }
  if (assessment.difficulty != null) {
    pills.push(
      <Pill key="diff"><FaChartLine className="flex-shrink-0" />{assessment.difficulty.toFixed(1)}</Pill>
    );
  }

  return (
    <Link to={assessmentUrl(assessment)} className="bg-[#EFEEFE] rounded-xl flex items-center gap-2 mb-1 p-1.5 border-gray-100 last:mb-0">
      {assessment.image && (
        <img
          src={assessment.image}
          alt=""
          className={`${visibleOnlyOnMobile ? 'sm:hidden' : ''} w-12 h-10 flex-shrink-0 rounded-lg object-cover`}
        />
      )}
      <div className="min-w-0 flex-1 flex flex-col gap-1">
        {assessment.topic_name && (
          <span className={`${visibleOnlyOnMobile ? 'sm:hidden' : ''} text-gray-400 italic text-xs truncate`}>{assessment.topic_name}</span>
        )}
        <div className="flex items-center gap-1.5">
          <span className="text-gray-500 font-semibold text-sm truncate">{assessment.name}</span>
        </div>
        {pills.length > 0 && (
          <div className="flex gap-1">{pills.slice(0, 3)}</div>
        )}
      </div>
    </Link>
  );
}

export function MyAssessmentsTile({ variant = 'compact' }) {
  const [isOpen, setIsOpen] = useState(true);
  const [topAssessments, setTopAssessments] = useState([]);

  useEffect(() => {
    filterAssessments({ ordering: '-attempts_count', pageSize: 3 })
      .then(r => setTopAssessments(r.data.results ?? r.data))
      .catch(() => {});
  }, []);

  return (
    <div className="h-full flex flex-col">
      <div className={`bg-[#DFDDFD] rounded-xl px-6 py-3 lg:p-3 mb-3 sm:mb-0 ${variant === 'full' ? '' : 'sm:ms-2'} ${isOpen ? 'flex-grow flex flex-col' : ''}`}>
        <div className="flex items-center" onClick={() => setIsOpen(!isOpen)}>
          <div className="flex-grow pe-3 cursor-pointer">
            <div className="text-[#6155F5] font-bold md:text-xl xl:text-2xl border-b-2 border-[#6155F5]">
              My assessments
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
            <div className="flex-grow py-3">
              <div className="bg-white rounded-xl px-2 py-1">
                <div className="text-[#6155F5] font-semibold text-lg pb-1">Top assessments</div>
                {topAssessments.length > 0 ? topAssessments.map((a, i) => (
                  <AssessmentRow key={a.id} assessment={a} index={i} variant={variant} />
                )) : (
                  <div className="text-[#6155F5] text-xs opacity-60 py-2">No assessments yet</div>
                )}
              </div>
            </div>
            <div className="flex justify-end pt-1">
              <Link
                to="/assessments"
                className="bg-[#6155F5] px-4 py-1 rounded-lg text-white cursor-pointer"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                ASSESSMENTS ACCESS
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
