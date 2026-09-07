import { useEffect, useState } from 'react';
import { FaPlus, FaCheck, FaTimes } from 'react-icons/fa';
import { useUser } from '../../../../context/UserContext';
import { listAssessmentAttempts } from '../../../../api/attempts.api';

function formatDuration(durationSeconds) {
  if (typeof durationSeconds !== 'number') return null;
  const totalSeconds = Math.round(durationSeconds);
  const mins = Math.floor(totalSeconds / 60);
  const secs = totalSeconds % 60;
  return `${mins}m ${String(secs).padStart(2, '0')}s`;
}

function formatDate(startTime) {
  if (!startTime) return null;
  return new Date(startTime).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
}

function AttemptSummaryRow({ attempt }) {
  const duration = formatDuration(attempt.duration_seconds);
  const date = formatDate(attempt.start_time);
  const score = typeof attempt.score === 'number' ? attempt.score.toFixed(2) : '—';

  return (
    <div className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
      <div className="flex flex-col gap-0.5">
        <div className={`flex items-center gap-1 text-sm font-semibold ${attempt.approved ? 'text-green-600' : 'text-red-500'}`}>
          {attempt.approved ? <FaCheck className="text-xs" /> : <FaTimes className="text-xs" />}
          {attempt.approved ? 'Approved' : 'Failed'}
        </div>
        {(date || duration) && (
          <div className="text-gray-400 text-xs">
            {[date, duration].filter(Boolean).join(' · ')}
          </div>
        )}
      </div>
      <div className="flex flex-col items-end gap-0.5">
        <div className="text-gray-700 text-sm font-medium">{score}</div>
        <div className="text-gray-400 text-xs">{attempt.points_obtained ?? 0} pts</div>
      </div>
    </div>
  );
}

export function AttemptsView({ assessment }) {
  const { user } = useUser();
  const [attempts, setAttempts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id || !assessment?.id) return;
    let cancelled = false;
    setLoading(true);
    listAssessmentAttempts(user.id, assessment.id)
      .then(res => {
        if (cancelled) return;
        setAttempts(res.data.results ?? res.data ?? []);
      })
      .catch(err => console.error('Failed to load attempts history:', err))
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [user?.id, assessment?.id]);

  const completedAttempts = attempts.filter(a => a.is_finished).slice(0, 2);

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
        Attempts left:{' '}
        <span className="font-bold text-gray-800">{assessment.available_attempts}</span>
        {' '}out of{' '}
        <span className="font-bold text-gray-800">{assessment.allowed_attempts}</span>
      </div>

      {!loading && completedAttempts.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-gray-700 text-sm">Your attempts</div>
          <div className="flex flex-col gap-1.5">
            {completedAttempts.map(attempt => (
              <AttemptSummaryRow key={attempt.id} attempt={attempt} />
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2">
        <div className="font-semibold text-gray-700">Do you want to add more attempts?</div>
        <div className="text-sm text-gray-500">
          If you want to add more attempts for this assessment click on the button below.
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#3DB1FF] text-white rounded-full px-5 py-2.5 font-semibold text-sm w-fit cursor-pointer select-none">
        <div className="bg-white rounded-full p-1 flex items-center justify-center">
          <FaPlus className="text-[#3DB1FF] text-xs" />
        </div>
        ADD NEW ATTEMPT
      </div>
    </div>
  );
}
