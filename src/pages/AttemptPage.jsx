import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { finalizeAttempt, getAttempt } from '../api/attempts.api';
import QuestionsList from '../components/attempts/QuestionsList';


export function AttemptPage() {
  const { id } = useParams();
  const [attempt, setAttempt] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAttempt();
  }, [id]);

  useEffect(() => {
    if (attempt?.questions) {
      localStorage.setItem('questions', JSON.stringify(attempt.questions));
      setQuestions(attempt.questions);
    }
    else {
      const localQuestions = localStorage.getItem('questions');
      if (localQuestions) {
        setQuestions(JSON.parse(localQuestions));
      }
    }
    const handleUnload = () => {
      localStorage.removeItem('questions');
    };
    window.addEventListener('beforeunload', handleUnload);
    return () => {
      window.removeEventListener('beforeunload', handleUnload);
    };
  }, [attempt]);

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
      }
      else {
        const startTime = new Date(res.data.start_time);
        const currentTime = new Date();
        const timeLimitInMs = res.data.assessment_time_limit * 60 * 1000;
        if (currentTime - startTime >= timeLimitInMs) {
          setShowResults(true);
        }
        setError(null);
      }
    } catch (error) {
      console.error(error);
      setError(error);
      setAttempt(null);
    }
  }

  const handleEndAttempt = async (userResponses) => {
    try {
      const res = await finalizeAttempt(id, userResponses);
      setResults(res.data);
      setShowResults(true);
      localStorage.removeItem('questions');
    } catch (error) {
      console.error(error);
    }
  };

  if (error) {
    return <div className="pt-28">Error loading attempt: {error.message}</div>;
  }

  if (!attempt) {
    return <div className="pt-28">Loading attempt...</div>;
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
    return <div className="pt-28 flex flex-col items-center">
      <div className='text-2xl pb-2'>Your score is:</div>
      <div className="text-8xl font-bold mb-4">{results.score} <span className='text-7xl'>/ 100</span></div>
      <div className={`text-3xl font-medium ${results.approved ? 'text-green-500' : 'text-red-500'}`}>
        {results.approved ? 'You passed' : 'You failed!'}
      </div>
      <div>
        Points Obtained: {results.points_obtained}
      </div>
    </div>
  }
  return (<div className="pt-28">
    <QuestionsList
      attempt={attempt}
      questions={questions}
      onEndAttempt={handleEndAttempt} />
  </div>)

}
