import React, { useState } from 'react'
import { FaStar } from 'react-icons/fa';
import { startAttempt } from '../../api/attempts.api';
import { useNavigate } from 'react-router-dom';
import { followAssessment, unfollowAssessment } from '../../api/assessments.api';
import { CiImageOn } from 'react-icons/ci';
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { CiCircleQuestion, CiClock2 } from "react-icons/ci";
import { AiOutlineLineChart } from "react-icons/ai";
import { PiRepeatLight } from "react-icons/pi";
import { FaRegChartBar } from "react-icons/fa6";
import { AiOutlineNumber } from "react-icons/ai";


export function AssessmentDetail({ assessment }) {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [assessmentDetails, setAssessmentDetails] = useState({
    ...assessment,
    is_following: assessment.is_following,
  });

  const handleFollowClick = async () => {
    try {
      if (assessmentDetails.is_following) {
        await unfollowAssessment(assessmentDetails.is_following);
        setAssessmentDetails({
          ...assessmentDetails,
          is_following: false,
        });
      } else {
        const response = await followAssessment(assessmentDetails.id);
        setAssessmentDetails({
          ...assessmentDetails,
          is_following: response.data.id,
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleStartClick = async () => {
    try {
      const data = {
        assessment: assessment.id,
        user: assessment.user
      };
      if (assessment.available_attempts <= 0) {
        return
      }
      const response = await startAttempt(data);
      setApiError(null);
      navigate(`/attempts/${response.data.id}`);
    } catch (error) {
      console.error(error);
      setApiError(error.response?.data ?? 'An error occurred');
    }
  };
  const formatDifficulty = (difficulty) => {
    return difficulty.toFixed(2);
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty < 4) {
      return 'text-green-600';
    } else if (difficulty >= 4 && difficulty <= 7) {
      return 'text-yellow-300';
    } else {
      return 'text-red-600';
    }
  }
  return (
    <div className="lg:w-2/3">
      <div className="flex items-center">
        <div>
          <div className="flex justify-center items-center h-36 w-48 rounded-lg overflow-hidden">
            {assessment.image ? (
              <img
                src={assessment.image}
                alt={`${assessment.name} image`}
                className="object-cover max-h-full max-w-full rounded-lg"
              />
            ) : (
              <div className='flex justify-center items-center bg-teal-900 rounded-lg w-full h-full'>
                <CiImageOn size={32} className="text-white" />
              </div>
            )}
          </div>
        </div>
        <div className="w-full ps-3 pb-3">
          <div className="grid grid-cols-1 md:grid-cols-3">
            <div className="col-span-2">
              <div className="text-4xl font-bold pb-1">{assessment.name}</div>
              <div className="text-gray-500 pb-1">
                Created by {assessment.user_username}, {" "}
                {new Date(assessment.created_at).toLocaleDateString()}
              </div>
              {assessmentDetails.is_following !== null && (
                <FaStar className={`cursor-pointer
                  ${typeof assessmentDetails.is_following === 'number' ? 'text-yellow-300 text-xl' : 'text-gray-500 text-xl'}`}
                  onClick={handleFollowClick} />
              )}
            </div>
            <div className='flex justify-end items-center'>
              <div className=''>
                <div className='bg-white text-gray-500 text-lg cursor-pointer rounded-lg border-gray-300 border-2 font-light
                flex items-center justify-center px-4 py-3 hover:shadow hover:font-normal'
                  onClick={handleStartClick}>
                  Start attempt
                </div>
                <div className='text-sm text-gray-500 pt-1'>
                  You have <span className='font-semibold'>{assessment.available_attempts}</span> attempts left
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
      <div className="flex justify-evenly">
        <div className='flex items-start justify-start'>
          <div className='pt-2 text-lg text-gray-500 pe-2'>
            <AiOutlineLineChart />
          </div>
          <div className=''>
            <div className='font-light text-xl'>
              Difficulty
            </div>
            <div className={`text-xl font-semibold pt-1`}>
              <span className={`${getDifficultyColor(assessment.difficulty)}`}>
                {formatDifficulty(assessment.difficulty)}</span> / 10.00
            </div>
          </div>
        </div>
        <div className='flex items-start justify-start'>
          <div className='pt-2 text-lg text-gray-500 pe-2'>
            <HiOutlineBadgeCheck />
          </div>
          <div>
            <div className='font-light text-xl'>
              Minimum Score
            </div>
            <div className='text-xl font-semibold pt-1'>
              {assessment.min_score} / 100
            </div>
          </div>
        </div>
      </div>
      <div className='flex justify-evenly pt-2'>
        <div className='flex items-start justify-start'>
          <div className='pt-2 text-lg text-gray-500 pe-2'>
            <CiCircleQuestion />
          </div>
          <div>
            <div className='font-light text-xl'>
              Number of questions
            </div>
            <div className='text-xl font-semibold pt-1'>
              {assessment.number_of_questions}
            </div>
          </div>
        </div>
        <div className='flex items-start justify-start'>
          <div className='pt-2 text-lg text-gray-500 pe-2'>
            <CiClock2 />
          </div>
          <div>
            <div className='font-light text-xl'>
              Time limit
            </div>
            <div className='text-xl font-semibold pt-1'>
              {assessment.time_limit}
            </div>
          </div>
        </div>
        <div className='flex items-start justify-start'>
          <div className='pt-2 text-lg text-gray-500 pe-2'>
            <PiRepeatLight />
          </div>
          <div>
            <div className='font-light text-xl'>
              Allowed attempts
            </div>
            <div className='text-xl font-semibold pt-1'>
              {assessment.allowed_attempts}
            </div>
          </div>
        </div>
      </div>
      <div className="py-2 px-4 flex bg-teal-900 text-white rounded-lg space-x-4 my-3">
        <div className="flex text-center items-center pe-2">
          <div className='pe-3'>
            Language
          </div>
          <div className='text-xl'>
            {assessment.language_name}
          </div>
        </div>
        <div className="flex text-center items-center pe-2">
          <div className='pe-3'>
            Category
          </div>
          <div className='text-xl'>
            {assessment.category_name}
          </div>
        </div>
        <div className="flex text-center items-center">
          <div className='pe-3'>
            Topic
          </div>
          <div className='text-xl'>
            {assessment.topic_name}
          </div>
        </div>
      </div>
      <div className="p-2 bg-gray-100 rounded-lg my-3 flex justify-between">
        <div className='text-gray-500 font-semibold pb-0'>
          Results
        </div>
        <div className='flex flex-grow justify-evenly'>
          <div className='flex items-start justify-start'>
            <div className='pt-2 text-lg text-gray-500 pe-2'>
              <FaRegChartBar />
            </div>
            <div>
              <div className='font-light text-xl'>Average Score</div>
              <div className='text-xl font-semibold pt-1'>{assessment.average_score} / 100</div>
            </div>
          </div>
          <div className='flex items-start justify-start'>
            <div className='pt-2 text-lg text-gray-500 pe-2'>
              <AiOutlineNumber />
            </div>
            <div>
              <div className='font-light text-xl'>Total Attempts</div>
              <div className='text-xl font-semibold pt-1'>{assessment.attempts_count}</div>
            </div>
          </div>
        </div>
      </div>

      <div className='pt-4'>
        <div className='py-3'>
          <div className="text-3xl pb-1 font-light">Description</div>
          <p>{assessment.description}</p>
        </div>
        <div className='py-3'>
          <div className="text-3xl pb-1 font-light">Minimum Requirements</div>
          <p>{assessment.minimum_requirements}</p>
        </div>
      </div>
    </div>
  )
}