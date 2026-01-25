import React, { useEffect, useState } from 'react'
import { Table } from 'flowbite-react';
import { getUsersByRanking } from '../../api/users.api';
import { getUsersByRankingCategory } from '../../api/attempts.api';


export function RankingList({ categoryId, rankingType }) {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadUsers();
  }, [categoryId, rankingType]);

  async function loadUsers() {
    try {
      let response;
      if (categoryId === '0') {
        response = await getUsersByRanking(rankingType);
      } else {
        response = await getUsersByRankingCategory(rankingType, categoryId);
        response.data.results.forEach(obj => {
          obj.points = obj.total_points;
        });
      }
      setUsers(response.data.results);
    } catch (err) {
      setError(err.message || 'Error fetching users');
    }
  }

  return (
    <div>
      {error && <div>Error: {error}</div>}
      <Table>
        <Table.Head>
          <Table.HeadCell>Position</Table.HeadCell>
          <Table.HeadCell>Name</Table.HeadCell>
          <Table.HeadCell>Country</Table.HeadCell>
          <Table.HeadCell>Points</Table.HeadCell>
          <Table.HeadCell>Average Score</Table.HeadCell>
        </Table.Head>
        <Table.Body className="divide-y">
          {users.map((user, index) => (
            <Table.Row key={user.id || index} className="bg-white dark:border-gray-700 dark:bg-gray-800">
              <Table.Cell className="whitespace-nowrap font-medium text-gray-900 dark:text-white">
                {index + 1}
              </Table.Cell>
              <Table.Cell>{user.first_name} {user.last_name}</Table.Cell>
              <Table.Cell>
                <div className="flex items-center gap-2">
                  {user.country_flag && (
                    <img
                      src={user.country_flag}
                      alt={user.country}
                      className="w-5 h-4 object-cover rounded-sm"
                    />
                  )}
                  <span>{user.country}</span>
                </div>
              </Table.Cell>
              <Table.Cell>{user.points}</Table.Cell>
              <Table.Cell>{user.average_score}</Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>
    </div>
  )
}
