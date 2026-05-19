import React, { useState } from 'react'
import { FaRegHeart, FaHeart, FaPlus, FaArrowRight } from 'react-icons/fa';
import { BsImage } from 'react-icons/bs';
import { Tooltip, Alert } from 'flowbite-react';
import { HiInformationCircle } from 'react-icons/hi';
import ReactGA from 'react-ga4';
import { startAttempt } from '../../../api/attempts.api';
import { useNavigate } from 'react-router-dom';
import { followAssessment, unfollowAssessment } from '../../../api/assessments.api';
import { ConfirmationModal } from '../../modals/ConfirmationModal';
import { DifficultyRatingModal } from './DifficultyRatingModal';
import { HiOutlineBadgeCheck } from "react-icons/hi";
import { CiCircleQuestion, CiClock2 } from "react-icons/ci";
import { AiOutlineLineChart } from "react-icons/ai";
import { PiRepeatLight } from "react-icons/pi";
import { FaRegChartBar } from "react-icons/fa6";
import { AiOutlineNumber } from "react-icons/ai";
import { CreatorSettings } from './CreatorSettings';
import { CommunityReview } from './CommunityReview';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';

function DescriptionSection({ description }) {
  const [expanded, setExpanded] = useState(false);
  const [isLg, setIsLg] = useState(() => window.matchMedia('(min-width: 1024px)').matches);

  React.useEffect(() => {
    const mq = window.matchMedia('(min-width: 1024px)');
    const handler = (e) => setIsLg(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  if (!description) return null;
  const limit = isLg ? 50 : 30;
  const words = description.split(' ');
  const isLong = words.length > limit;
  const displayed = isLong && !expanded ? words.slice(0, limit).join(' ') + '…' : description;

  return (
    <div className="pt-4 pb-4 border-b">
      <div className="font-semibold underline text-[#3DB1FF] pb-1">Assessment info:</div>
      <div className="text-[#3DB1FF] text-sm">{displayed}</div>
      {isLong && (
        <div className="flex items-center gap-1 text-gray-400 text-sm cursor-pointer 
        mt-1 select-none w-fit"
          onClick={() => setExpanded(e => !e)}>
          {expanded ? <>Show less <FaChevronUp className="text-xs" />
          </> : <>Show more <FaChevronDown className="text-xs" /></>}
        </div>
      )}
    </div>
  );
}

export function AssessmentDetail({ assessment, onReload }) {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showDifficultyRating, setShowDifficultyRating] = useState(false);
  const [ratingSuccess, setRatingSuccess] = useState(false);
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
      ReactGA.event('assessment_started', { assessment_id: assessment.id, topic: assessment.topic_name });
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
    <div className="bg-white rounded-xl p-4">
      {ratingSuccess && (
        <Alert color="success" icon={HiInformationCircle} className='mb-3' onDismiss={() => setRatingSuccess(false)}>
          <span className="font-medium">Difficulty rating submitted successfully!</span>
        </Alert>
      )}
      <div className="flex items-end justify-between border-b-2 border-gray-600 pb-3 mb-3">
        <div className="text-2xl font-bold text-gray-600">{assessment.name}</div>
        {assessment.image ? (
          <div className="h-16 w-24 rounded-lg overflow-hidden flex-shrink-0 ml-3">
            <img
              src={assessment.image}
              alt={`${assessment.name} image`}
              className="object-cover w-full h-full"
            />
          </div>
        ) : (
          <div className="h-20 w-28 rounded-lg bg-gray-100 flex items-center justify-center flex-shrink-0 ml-3">
            <BsImage className="text-gray-400 text-2xl" />
          </div>
        )}
      </div>
      <div className="flex lg:justify-end items-center gap-3">
        {assessmentDetails.is_following !== null && (
          <div
            className="bg-gray-200 rounded-full p-2 cursor-pointer flex-shrink-0"
            onClick={handleFollowClick}
          >
            {typeof assessmentDetails.is_following === 'number'
              ? <FaHeart className="text-xl text-red-400" />
              : <FaRegHeart className="text-xl text-gray-500" />}
          </div>
        )}
        <div
          className={`flex items-center gap-3 rounded-full px-5 py-2 font-semibold text-sm
            ${assessment.is_owner || assessment.available_attempts <= 0
              ? 'bg-gray-300 text-gray-400 cursor-not-allowed'
              : 'bg-[#3DB1FF] text-white cursor-pointer'}`}
          onClick={() => !assessment.is_owner && assessment.available_attempts > 0 && setShowConfirm(true)}
        >
          <div className="bg-white rounded-full p-1 flex items-center justify-center">
            <FaArrowRight className={`text-sm ${assessment.is_owner || assessment.available_attempts <= 0 ? 'text-gray-400' : 'text-[#3DB1FF]'}`} />
          </div>
          START ATTEMPT
        </div>
      </div>
      <CreatorSettings assessment={assessment} />
      <DescriptionSection description={assessment.description} />
      <CommunityReview
        assessment={assessment}
        canRate={!assessment.is_owner && assessmentDetails.is_following !== null
          && assessment.available_attempts < assessment.allowed_attempts}
        onRateDifficulty={() => setShowDifficultyRating(true)}
      />

      {showDifficultyRating && (
        <DifficultyRatingModal
          assessmentId={assessment.id}
          onConfirm={() => {
            setShowDifficultyRating(false);
            setRatingSuccess(true);
            setTimeout(() => setRatingSuccess(false), 8000);
            onReload();
          }}
          onCancel={() => setShowDifficultyRating(false)}
        />
      )}
      {showConfirm && (
        <ConfirmationModal
          message={`You're about to use one of your attempts, you only have ${assessment.available_attempts} left, make them count! Ready to go?`}
          buttonColor="#3DB1FF"
          onConfirm={() => { setShowConfirm(false); handleStartClick(); }}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  )
}