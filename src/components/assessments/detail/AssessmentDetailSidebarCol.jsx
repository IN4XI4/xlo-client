import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { DetailInfo } from './DetailInfo';
import CreatorIcon from '../../../assets/assessments/Creator.svg';

export function AssessmentDetailSidebarCol({ assessment }) {
  const navigate = useNavigate();

  return (
    <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
      <div className="bg-white rounded-xl px-3 py-3">
        <div
          className="flex items-center gap-3 pb-3 cursor-pointer"
          onClick={() => navigate('/assessments/')}
        >
          <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
            <FaArrowLeft className="text-gray-600" />
          </div>
          <div className="font-semibold text-gray-700">
            Back to assessments
            </div>
        </div>
        <div className="border-t border-gray-200" />
        <div className="py-3 flex items-center gap-2">
          <img src={CreatorIcon} alt="" className="w-8 h-8 flex-shrink-0" />
          <div className="font-semibold text-gray-700">Creator info</div>
        </div>
        <div className="border-t border-gray-200" />
        <DetailInfo assessment={assessment} />
      </div>
    </div>
  );
}
