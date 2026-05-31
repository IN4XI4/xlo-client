import { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { AttemptNavBar } from './AttemptNavBar';
import { EndAttemptModal } from './EndAttemptModal';
import { QuestionBlock } from './QuestionBlock';
import { FaCheck } from 'react-icons/fa6';

function QuestionsList({ attempt, questions, onEndAttempt }) {
  const [userResponses, setUserResponses] = useState([]);
  const [openModal, setOpenModal] = useState(undefined);

  useEffect(() => {
    const stored = localStorage.getItem('attempt_session');
    if (!stored) return;
    const session = JSON.parse(stored);
    localStorage.setItem('attempt_session', JSON.stringify({ ...session, responses: userResponses }));
  }, [userResponses]);

  const handleChoiceChange = (questionId, choiceId) => {
    const updatedResponses = [...userResponses];
    let response = updatedResponses.find(r => r.question_id === questionId);
    if (response) {
      response.choices = [choiceId];
    } else {
      response = { question_id: questionId, choices: [choiceId] };
      updatedResponses.push(response);
    }
    setUserResponses(updatedResponses);
  };

  const getSelectedChoice = (questionId) => {
    const response = userResponses.find(r => r.question_id === questionId);
    return response?.choices?.[0] ?? null;
  };

  return (
    <div className="pb-24 select-none px-4" style={{ userSelect: "none" }} translate="no">
      <Helmet>
        <meta name="google" content="notranslate" />
      </Helmet>
      <div className="flex items-center gap-4 mb-4">
        {attempt.assessment_image && (
          <img src={attempt.assessment_image} className="w-14 h-14 rounded-xl object-cover flex-shrink-0" alt="" />
        )}
        <div>
          <div className="text-sm text-gray-500">Author: {attempt.assessment_author_first_name} {attempt.assessment_author_last_name}</div>
          <div className="text-2xl font-bold text-gray-800">{attempt.assessment_name}</div>
        </div>
      </div>
      <AttemptNavBar
        start_time={attempt.start_time}
        assessment_time_limit={attempt.assessment_time_limit}
        onEndAttempt={onEndAttempt}
        userResponses={userResponses}
        answeredCount={userResponses.length}
        totalCount={questions.length}
        onOpenFinishModal={() => setOpenModal('endAttempt')}
      />
      <div className='bg-white p-3 lg:p-5 rounded-xl'>
        {questions.map((question, index) => (
          <QuestionBlock
            key={index}
            question={question}
            index={index}
            selectedChoiceId={getSelectedChoice(question.question_id)}
            onChoiceChange={handleChoiceChange}
          />
        ))}
      </div>
      <div className="flex justify-center mt-6">
        <div
          className="flex items-center gap-2 bg-[#3DB1FF] text-white rounded-full px-6 py-2.5 font-semibold text-sm cursor-pointer select-none"
          onClick={() => setOpenModal('endAttempt')}
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center">
            <FaCheck className="text-[#3DB1FF] text-xs" />
          </div>
          FINISH
        </div>
      </div>
      <EndAttemptModal
        openModal={openModal}
        setOpenModal={setOpenModal}
        onEndAttempt={onEndAttempt}
        userResponses={userResponses}
        totalCount={questions.length}
      />
    </div>
  );
}

export default QuestionsList;
