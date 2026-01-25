import React, { useState } from 'react'
import { Timer } from './Timer';
import { EndAttemptModal } from './EndAttemptModal';
import { Button } from 'flowbite-react';

function QuestionsList({ attempt, questions, onEndAttempt }) {
  const [userResponses, setUserResponses] = useState([]);
  const [openModal, setOpenModal] = useState(undefined);

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
    console.log("User responses:", updatedResponses);
  };

  return (
    <div className="p-4 select-none" style={{ userSelect: "none" }}>
      <Timer
        assessment_time_limit={attempt.assessment_time_limit}
        start_time={attempt.start_time}
        onEndAttempt={onEndAttempt}
        userResponses={userResponses} />
      {questions.map((question, index) => (
        <div key={index} className="p-4 border rounded-md mb-4">
          <h2 className="text-xl font-bold mb-2">{question.description}</h2>
          <form>
            {question.choices.map((choice, cIndex) => (
              <label key={cIndex} className="flex items-center mb-2">
                <input
                  type="radio"
                  name={`question_${index}`}
                  value={choice.id}
                  className="text-blue-500 mr-2"
                  onChange={() => handleChoiceChange(question.question_id, choice.choice_id)}
                />
                <span>{choice.description}</span>
              </label>
            ))}
          </form>
        </div>
      ))}
      <div className="flex mt-4">
        <Button className="w-auto bg-[#3DB1FF] text-white" onClick={() => setOpenModal('endAttempt')}>
          Finish attempt
        </Button>
        <EndAttemptModal
          openModal={openModal}
          setOpenModal={setOpenModal}
          onEndAttempt={onEndAttempt}
          userResponses={userResponses}
        />
      </div>
    </div>
  )
}

export default QuestionsList