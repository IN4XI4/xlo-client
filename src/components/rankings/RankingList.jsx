import { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaSpinner, FaUser } from 'react-icons/fa';
import { getUsersByRanking } from '../../api/users.api';
import { getUsersByRankingCategory } from '../../api/attempts.api';
import { RankingRow } from './RankingRow';


export function RankingList({ categoryId, rankingType, search, onUsersLoaded, selectedUserId, onUserSelect }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [error, setError] = useState(null);

  useEffect(() => {
    setUsers([]);
    setHasMore(true);
    setCurrentPage(1);
    loadUsers(1);
  }, [categoryId, rankingType, search]);

  useEffect(() => {
    if (currentPage === 1) return;
    loadUsers(currentPage);
  }, [currentPage]);

  async function loadUsers(page) {
    try {
      let response;
      if (categoryId === '0') {
        response = await getUsersByRanking(rankingType, page, search);
      } else {
        response = await getUsersByRankingCategory(rankingType, categoryId, page, search);
        response.data.results.forEach(obj => {
          obj.points = obj.total_points;
          obj.profile_picture = obj.picture;
          obj.id = obj.user_id;
        });
      }
      const newUsers = response.data.results;
      if (page === 1) {
        setUsers(newUsers);
        setTotalCount(response.data.count || 0);
        onUsersLoaded?.(newUsers);
      } else {
        setUsers(prev => [...prev, ...newUsers]);
      }
      setHasMore(!!response.data.next);
    } catch (err) {
      setError(err.message || 'Error fetching users');
      setHasMore(false);
    }
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className="font-bold text-[#3DB1FF] text-xl">All user rankings</span>
        <span className="flex items-center gap-1.5 bg-blue-50 text-[#3DB1FF] text-sm px-3 py-1 rounded-full font-medium">
          <FaUser className="text-xs" />
          {totalCount} active users
        </span>
      </div>
      {error && <div className="text-red-500 text-sm mb-2">Error: {error}</div>}
      <div className="overflow-x-auto rounded-xl bg-white">
        <InfiniteScroll
          dataLength={users.length}
          scrollThreshold="90%"
          next={() => setCurrentPage(prev => prev + 1)}
          hasMore={hasMore}
          loader={
            <div className="flex justify-center py-4">
              <FaSpinner className="text-[#3DB1FF] text-2xl animate-spin" />
            </div>
          }
          endMessage={
            <div className="text-center text-gray-400 py-4 text-sm">You've seen all rankings!</div>
          }
        >
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-gray-500 uppercase border-b border-gray-100">
              <tr>
                <th className="py-3 px-3">Rank</th>
                <th className="py-3 px-3">User</th>
                <th className="py-3 px-3 hidden md:table-cell">Age</th>
                <th className="py-3 px-3 hidden lg:table-cell">Job</th>
                <th className="py-3 px-3 hidden sm:table-cell">Country</th>
                <th className="py-3 px-3">Level</th>
                <th className="py-3 px-3 hidden md:table-cell">Badges</th>
                <th className="py-3 px-3">Points</th>
                <th className="py-3 px-3">Score</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user, index) => (
                <RankingRow
                  key={user.id || index}
                  user={user}
                  position={index + 1}
                  isSelected={user.id === selectedUserId}
                  onSelect={onUserSelect}
                />
              ))}
            </tbody>
          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
}
