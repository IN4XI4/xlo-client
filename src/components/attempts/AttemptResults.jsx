import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRotateLeft } from 'react-icons/fa6';
import { FaCheck } from 'react-icons/fa6';
import { startAttempt } from '../../api/attempts.api';
import { ConfirmationModal } from '../modals/ConfirmationModal';

const RESULT_CONFIG = {
  approved: {
    title: 'CONGRATS!',
    subtitle: 'You just completed the assessment:',
    gradientClass: 'bg-gradient-to-br from-[#3DB1FF] to-[#846EFF]',
    gradientStyle: null,
  },
  failed: {
    title: 'FAIL!',
    subtitle: "You didn't succeed the assessment:",
    gradientClass: '',
    gradientStyle: { background: 'linear-gradient(to top right, #FFE943 0%, #FFB733 47%, #FE1D21 100%)' },
  },
};

function StatRow({ label, value }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-500 text-sm">{label}</span>
      <span className="text-gray-700 text-sm font-medium bg-gray-100 rounded-full px-3 py-0.5">
        {value ?? '—'}
      </span>
    </div>
  );
}

function BottomCard({ bg, textColor, borderColor, value, label }) {
  return (
    <div className={`${bg} rounded-2xl flex flex-col items-center justify-center py-6 gap-3`}>
      <div className={`w-16 h-16 rounded-full border-4 ${borderColor} flex items-center justify-center`}>
        <span className={`text-2xl font-bold ${textColor}`}>{value ?? '—'}</span>
      </div>
      <span className={`text-sm font-medium ${textColor}`}>{label}</span>
    </div>
  );
}

export function AttemptResults({ attempt, results }) {
  const { approved, score, points_obtained } = results;
  const config = RESULT_CONFIG[approved ? 'approved' : 'failed'];
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);

  const canRetry = attempt.available_attempts > 0;

  const handleTryAgain = async () => {
    try {
      const res = await startAttempt({ assessment: attempt.assessment });
      navigate(`/attempts/${res.data.id}`);
    } catch (err) {
      console.error(err);
    }
  };

  const timeSpent = useMemo(() => {
    if (!attempt.end_time) return null;
    const ms = new Date(attempt.end_time) - new Date(attempt.start_time);
    const mins = Math.floor(ms / 60000);
    const secs = Math.floor((ms % 60000) / 1000);
    return `${mins} min. ${String(secs).padStart(2, '0')} sec.`;
  }, [attempt.start_time, attempt.end_time]);

  return (
    <div className="px-4 space-y-4">
      <div className={`rounded-2xl p-4 lg:p-10 text-center text-white ${config.gradientClass}`} style={config.gradientStyle ?? undefined}>
        <div className="font-extrabold text-3xl tracking-widest mb-2">{config.title}</div>
        <div className="text-sm opacity-90">{config.subtitle}</div>
        <div className="font-bold text-lg mt-1 mb-4 lg:mb-6">{attempt.assessment_name}</div>
        <div className="bg-white rounded-2xl p-4">
          <div className="flex flex-col lg:flex-row gap-4 pb-4">
            <div className="bg-blue-50 py-3 rounded-xl lg:w-36 lg:flex-shrink-0 flex flex-col items-center justify-center">
              <div className="text-5xl font-bold text-[#3DB1FF]">{score}</div>
              <div className="text-xs text-[#3DB1FF] text-center">Your total score</div>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8">
              <StatRow label="Total number of questions:" value={attempt.assessment_number_of_questions} />
              <StatRow label="Minimum score to pass:" value={attempt.assessment_min_score != null ? `${attempt.assessment_min_score}%` : null} />
              <StatRow label="Community difficulty:" value={attempt.assessment_community_difficulty?.toFixed(2)} />
              <StatRow label="Assessment difficulty:" value={attempt.assessment_difficulty?.toFixed(2)} />
              <StatRow label="Time spent:" value={timeSpent} />
              <StatRow label="Remaining attempts:" value={attempt.available_attempts} />
            </div>

          </div>
          <div className="grid grid-cols-2 gap-4">
            <BottomCard
              bg="bg-[#E0FAF4]"
              textColor="text-green-500"
              borderColor="border-green-400"
              value={attempt.correct_answers_count}
              label="Correct answers"
            />
            <BottomCard
              bg="bg-[#E8E4FF]"
              textColor="text-[#846EFF]"
              borderColor="border-[#846EFF]"
              value={points_obtained}
              label="Mixelo points"
            />
          </div>
        </div>
        <div className="flex justify-center mt-4">
          <div className="flex items-center w-full lg:w-auto bg-white rounded-full shadow-lg p-1.5 gap-4 justify-between lg:justify-normal">
            <div
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 font-semibold text-sm ${
                canRetry
                  ? 'bg-[#846EFF] text-white cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
              onClick={() => canRetry && setShowConfirm(true)}
            >
              <div className="bg-white rounded-full p-1 flex items-center justify-center">
                <FaRotateLeft className={`text-xs ${canRetry ? 'text-[#846EFF]' : 'text-gray-400'}`} />
              </div>
              TRY AGAIN
            </div>
            <div
              className="flex items-center gap-2 bg-[#3DB1FF] text-white rounded-full px-5 py-2.5 font-semibold text-sm cursor-pointer"
              onClick={() => navigate('/assessments')}
            >
              <div className="bg-white rounded-full p-1 flex items-center justify-center">
                <FaCheck className="text-[#3DB1FF] text-xs" />
              </div>
              COMPLETE
            </div>
          </div>
        </div>
      </div>
      {showConfirm && (
        <ConfirmationModal
          message={`You're about to use one of your attempts. You have ${attempt.available_attempts} left, make them count!`}
          buttonColor="#846EFF"
          onConfirm={() => { setShowConfirm(false); handleTryAgain(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}
