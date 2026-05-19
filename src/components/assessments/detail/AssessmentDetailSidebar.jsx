import { useState } from 'react';
import { FaChevronDown, FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { DetailInfo } from './DetailInfo';

export function AssessmentDetailSidebar({ assessment }) {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="lg:hidden pt-6 md:pt-0">
      <div
        className={`flex items-center bg-white px-5 py-3 select-none transition-[border-radius] duration-300 ${open ? 'rounded-t-3xl' : 'rounded-full'}`}
      >
        <div
          className="bg-gray-200 rounded-full p-2 flex-shrink-0 cursor-pointer mr-3"
          onClick={() => navigate('/assessments/')}
        >
          <FaArrowLeft className="text-gray-600" />
        </div>
        <div className="font-semibold text-gray-700 flex-1 cursor-pointer" onClick={() => setOpen(o => !o)}>
          Creator info
        </div>
        <div className="bg-gray-200 rounded-full p-2 flex-shrink-0 cursor-pointer" onClick={() => setOpen(o => !o)}>
          <FaChevronDown className={`text-gray-600 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-[1200px] opacity-100' : 'max-h-0 opacity-0'}`}>
        <div className="bg-white rounded-b-xl">
          <DetailInfo assessment={assessment} />
        </div>
      </div>
    </div>
  );
}
