import React, { useState } from 'react'
import { FaSearch } from 'react-icons/fa';
import { FaRegCircleXmark } from 'react-icons/fa6';
import { ListUsers } from './ListUsers';
import { listInviteUsers, sendMultipleInvitations } from '../../../api/spaces.api';


export function InviteUsersModal({ spaceId, onCancel, onActionComplete }) {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchText, setSearchText] = useState('');
  const [addedUsers, setAddedUsers] = useState([]);

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const handleModalClick = (event) => {
    event.stopPropagation();
  };

  const handleSearch = async () => {
    if (inputText.trim().length < 2) {
      return;
    }
    setSearchText(inputText);
    setCurrentPage(1);
    await loadUsers(1, inputText);
  };

  async function loadUsers(page, query = searchText) {

    try {
      const res = await listInviteUsers(spaceId, page, 15, query);

      if (page === 1) {
        setUsers(res.data.results);
      } else {
        setUsers(prev => [...prev, ...res.data.results]);
      }

      setHasMore(!!res.data.next);
      if (page === 1) {
        setCurrentPage(1);
      }
    } catch (error) {
      setError(error);
      setHasMore(false);
    }
  }

  const loadMore = async () => {
    if (!hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    await loadUsers(nextPage);
  };

  const handleSendInvitations = async () => {
    if (addedUsers.length === 0) return;

    try {
      const userIds = addedUsers.map(user => user.id);
      await sendMultipleInvitations(spaceId, { user_ids: userIds });
      onActionComplete('Invitations sent successfully!')
      onCancel();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error sending invitations:", error);
      setError("Failed to send invitations");
    }
  };

  const handleAddUser = (user) => {
    const fullName = `${user.first_name} ${user.last_name}`.trim();
    setAddedUsers((prev) => [...prev, { id: user.id, name: fullName }]);
  };

  const handleRemoveUser = (id) => {
    setAddedUsers((prev) => prev.filter((user) => user.id !== id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center z-50" onClick={onCancel}>
      <div className="bg-white px-3 md:px-4 py-4 rounded-lg shadow-lg text-center w-11/12 md:w-1/3 my-3 overflow-y-auto
      flex flex-col items-between"
        onClick={handleModalClick}>
        <div>
          <div className='flex justify-between pb-3 md:pb-4'>
            <div className='flex-1 text-[#43B29D] font-semibold'>
              Invite new users
            </div>
            <div className='text-gray-500 flex justify-end cursor-pointer hover:text-gray-600' onClick={onCancel}>
              <FaRegCircleXmark className='text-2xl' />
            </div>
          </div>
          <div className='py-3 border-b relative w-full'>
            <input type="text"
              placeholder="Search by name..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyDown={handleSearchKeyDown}
              className="w-full px-4 py-2 border border-gray-300 rounded-full" />
            <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 cursor-pointer"
              onClick={handleSearch} />
          </div>
          <div className='flex flex-wrap text-sm text-gray-500 py-2 border-b'>
            {addedUsers.map((user) => {
              return (
                <div key={user.id}
                  className='px-3 rounded-full border border-[#3DB1FF] my-1 py-1 me-1 flex justify-between items-center'>
                  <div>
                    {user.name}
                  </div>
                  <FaRegCircleXmark className='ms-2 text-base cursor-pointer text-[#3DB1FF]'
                    onClick={() => handleRemoveUser(user.id)} />
                </div>
              )
            })}
          </div>
        </div>
        <div className='flex-grow overflow-y-auto mb-2'>
          {users.length > 0 && (
            <ListUsers
              users={users}
              hasMore={hasMore}
              loadMore={loadMore}
              addedUsers={addedUsers}
              onAdd={handleAddUser}
              onRemove={handleRemoveUser}
            />
          )}
        </div>
        <div className='flex items-center justify-end'>
          <div className='bg-[#3DB1FF] text-white py-2 px-4 md:px-6 rounded-full cursor-pointer'
            onClick={addedUsers.length > 0 ? handleSendInvitations : undefined}>
            Invite to space
          </div>
        </div>
      </div>
    </div>
  )
}
