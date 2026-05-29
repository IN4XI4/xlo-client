import { FaPlus } from 'react-icons/fa';
import { RemainAttemptsIcon } from '../../../../components/illustrations/icons/RemainAttemptsIcon';

export function AttemptsView({ assessment }) {
  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="bg-gray-100 rounded-xl px-4 py-3 text-sm text-gray-600">
        Attempts left:{' '}
        <span className="font-bold text-gray-800">{assessment.available_attempts}</span>
        {' '}out of{' '}
        <span className="font-bold text-gray-800">{assessment.allowed_attempts}</span>
      </div>

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
