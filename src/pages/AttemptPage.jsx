import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { finalizeAttempt, getAttempt } from '../api/attempts.api';
import QuestionsList from '../components/attempts/QuestionsList';
import { AttemptResults } from '../components/attempts/AttemptResults';
import { useAppState } from '../context/ScrollContext';


export function AttemptPage() {
  const { id } = useParams();
  const { refreshNavigation } = useAppState();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);
  const [finalizing, setFinalizing] = useState(false);
  const [finalizeError, setFinalizeError] = useState(false);
  const isActiveRef = useRef(false);

  useEffect(() => {
    setAttempt(null);
    setResults(null);
    setShowResults(false);
    setFinalizing(false);
    setFinalizeError(false);
    setError(null);
    loadAttempt();
  }, [id]);

  useEffect(() => {
    isActiveRef.current = !!attempt && !showResults && !finalizeError && !finalizing;
  }, [attempt, showResults, finalizeError, finalizing]);

  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (!isActiveRef.current) return;
      e.preventDefault();
      e.returnValue = '';
    };

    const handlePageHide = () => {
      if (!isActiveRef.current) return;
      const stored = localStorage.getItem('attempt_session');
      const responses = stored ? (JSON.parse(stored).responses ?? []) : [];
      const token = localStorage.getItem('token');
      const apiBase = import.meta.env.VITE_API_BASE_URL;
      fetch(`${apiBase}attempts/attempts/${id}/finalize_attempt/`, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(responses),
        keepalive: true,
      });
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('pagehide', handlePageHide);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('pagehide', handlePageHide);
    };
  }, [id]);

  useEffect(() => {
    if (attempt?.questions) {
      localStorage.setItem('attempt_session', JSON.stringify({ attemptId: id, questions: attempt.questions, responses: [] }));
      setQuestions(attempt.questions);
    } else {
      const stored = localStorage.getItem('attempt_session');
      if (stored) {
        const { attemptId, questions: savedQuestions } = JSON.parse(stored);
        if (attemptId === id) {
          setQuestions(savedQuestions);
        } else {
          localStorage.removeItem('attempt_session');
        }
      }
    }
  }, [attempt]);

  const handleEndAttempt = async (userResponses, retryCount = 0) => {
    setFinalizing(true);
    try {
      const res = await finalizeAttempt(id, userResponses);
      ReactGA.event('attempt_submitted', {
        score: res.data.score,
        passed: res.data.approved,
        assessment_id: attempt?.assessment,
      });
      setResults(res.data);
      setAttempt(prev => ({ ...prev, ...res.data }));
      setShowResults(true);
      localStorage.removeItem('attempt_session');
      refreshNavigation();
    } catch (err) {
      console.error(err);
      if (retryCount < 1) {
        handleEndAttempt(userResponses, retryCount + 1);
      } else {
        setFinalizing(false);
        setFinalizeError(true);
      }
    }
  };

  async function loadAttempt() {
    try {
      const res = await getAttempt(id);
      setAttempt(res.data);
      setResults({
        score: res.data.score,
        approved: res.data.approved,
        points_obtained: res.data.points_obtained
      });
      if (res.data.is_finished) {
        setShowResults(true);
      } else {
        const startTime = new Date(res.data.start_time);
        const currentTime = new Date();
        const timeLimitInMs = res.data.assessment_time_limit * 60 * 1000;
        if (currentTime - startTime >= timeLimitInMs) {
          const stored = localStorage.getItem('attempt_session');
          const savedResponses = stored ? (JSON.parse(stored).responses ?? []) : [];
          handleEndAttempt(savedResponses);
        }
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setAttempt(null);
    }
  }

  if (error) {
    return <div className="pt-28">Error loading attempt: {error.message}</div>;
  }

  if (!attempt) {
    return (
      <div className="flex justify-center pt-48">
        <div className="w-10 h-10 border-4 border-[#3DB1FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (questions.length === 0 && !showResults) {
    return (
      <div className="pt-28">
        <h2>This assessment is now closed.</h2>
        <p>It seems like there are no available questions for this assessment.</p>
      </div>
    );
  }

  if (showResults) {
    return (
      <div className="pt-28">
        <AttemptResults attempt={attempt} results={results} />
      </div>
    );
  }

  if (finalizing) {
    return (
      <div className="flex justify-center pt-48">
        <div className="w-10 h-10 border-4 border-[#3DB1FF] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (finalizeError) {
    return (
      <div className="pt-28 flex flex-col items-center gap-3 text-center px-6">
        <div className="text-gray-700 font-semibold text-lg">We couldn't finalize your attempt</div>
        <div className="text-gray-500 text-sm max-w-xs">There was a connection issue. Don't worry — this will be resolved automatically soon.</div>
      </div>
    );
  }

  return (<div className="pt-28">
    <QuestionsList
      attempt={attempt}
      questions={questions}
      onEndAttempt={handleEndAttempt} />
  </div>)
}
