import { useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { SIDEBAR_VIEWS } from './sidebarViews';

export function AssessmentDetailSidebarCol({ assessment, activeView, setActiveView }) {
  const navigate = useNavigate();

  const { label, Icon, Content } = SIDEBAR_VIEWS[activeView];

  return (
    <div className="lg:col-span-3 xl:col-span-2">
      <div className="bg-white rounded-xl px-3 py-3">
        <div
          className="flex items-center gap-3 pb-3 cursor-pointer"
          onClick={() => navigate('/assessments/')}
        >
          <div className="bg-gray-200 rounded-full p-2 flex-shrink-0">
            <FaArrowLeft className="text-gray-600" />
          </div>
          <div className="font-semibold text-gray-700">Back to assessments</div>
        </div>
        <div className="border-t border-gray-200" />
        <div className="py-3 flex items-center gap-2">
          <Icon color="#374151" className="w-6 h-6 flex-shrink-0" />
          <div className="font-semibold text-gray-700">{label}</div>
        </div>
        <div className="border-t border-gray-200" />
        <Content assessment={assessment} />
      </div>
    </div>
  );
}
