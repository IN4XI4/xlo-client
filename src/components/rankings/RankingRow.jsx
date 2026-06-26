import { FaRegStar, FaStar, FaUser } from 'react-icons/fa';
import { USER_LEVELS } from '../../globals';

const CURRENT_YEAR = new Date().getFullYear();

function RankStar({ position }) {
  if (position === 1) return <FaStar className="text-yellow-400 flex-shrink-0" />;
  if (position === 2) return <FaRegStar className="text-gray-400 flex-shrink-0" />;
  if (position === 3) return <FaStar className="text-orange-400 flex-shrink-0" />;
  return <FaRegStar className="text-gray-200 flex-shrink-0" />;
}

export function RankingRow({ user, position, isSelected, onSelect }) {
  const levelName = user.level != null
    ? USER_LEVELS.find(l => l.level === user.level)?.name
    : null;
  const age = user.birth_year ? CURRENT_YEAR - user.birth_year : null;
  const photo = user.profile_picture || user.picture;

  return (
    <tr className={`transition-colors ${isSelected ? 'bg-gray-100' : 'hover:bg-gray-50'}`}>
      <td className="py-3 px-3">
        <div className="flex items-center gap-1.5">
          <RankStar position={position} />
          <span className="font-mono font-semibold text-gray-700">
            {String(position).padStart(2, '0')}
          </span>
        </div>
      </td>
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          {photo ? (
            <img src={photo} alt="" className="w-8 h-8 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
              <FaUser className="text-gray-400 text-xs" />
            </div>
          )}
          <span
            className={`font-medium whitespace-nowrap cursor-pointer transition-colors ${isSelected ? 'text-[#3DB1FF]' : 'text-gray-800 hover:text-[#3DB1FF]'}`}
            onClick={() => onSelect(user.id)}
          >
            {user.first_name} {user.last_name}
          </span>
        </div>
      </td>
      <td className="py-3 px-3 hidden md:table-cell text-gray-600">
        {age ?? '—'}
      </td>
      <td className="py-3 px-3 hidden lg:table-cell text-gray-600 max-w-[140px]">
        <span className="block truncate">{user.profession || '—'}</span>
      </td>
      <td className="py-3 px-3 hidden sm:table-cell">
        <div className="flex items-center gap-1.5">
          {user.country_flag && (
            <img src={user.country_flag} alt="" className="w-5 h-4 object-cover rounded-sm flex-shrink-0" />
          )}
          <span className="text-gray-600 whitespace-nowrap">{user.country || '—'}</span>
        </div>
      </td>
      <td className="py-3 px-3">
        {levelName ? (
          <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-[#3DB1FF] whitespace-nowrap">
            {levelName}
          </span>
        ) : '—'}
      </td>
      <td className="py-3 px-3 hidden md:table-cell text-gray-700 font-medium">
        {user.badges_count ?? '—'}
      </td>
      <td className="py-3 px-3 text-gray-700 font-semibold">
        {Math.round(user.points)}
      </td>
      <td className="py-3 px-3 text-gray-600">
        {Number(user.average_score).toFixed(2)}
      </td>
    </tr>
  );
}
