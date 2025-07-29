import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { FaMinus, FaPlus, FaUser } from 'react-icons/fa';


export function ListUsers({ users, hasMore, loadMore, addedUsers, onAdd, onRemove }) {
  return (
    <div className='pb-3'>
      <InfiniteScroll
        dataLength={users.length}
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p>
            <b>You have seen it all...</b>
          </p>
        }
      >
        {users.map(user => {
          const isAdded = addedUsers.some((added) => added.id === user.id);
          return (
            <div key={user.id} className='border-b'>
              <div className={`flex justify-between items-center my-2 ps-1 pe-2
                        ${isAdded ? 'bg-[#ECF7FF] rounded-lg' : ''}`}>
                <div className='flex truncate items-center '>
                  <div className='rounded-full flex items-center justify-center h-14 w-14 flex-shrink-0'>
                    {user.profile_picture ? (
                      <img
                        src={user.profile_picture}
                        alt="Profile"
                        className="h-12 w-12 border-2 rounded-full cursor-pointer"
                      />
                    ) : user.id ? (
                      <div className='h-12 w-12 rounded-full cursor-pointer border-2 bg-gray-50 items-center flex justify-center'>
                        <FaUser className="h-6 w-6 text-gray-500" />
                      </div>
                    ) : (
                      <img src={logo} alt="" />
                    )}
                  </div>
                  <div className='truncate text-start ps-2 text-gray-500'>
                    <div className=''>{user.first_name} {user.last_name}</div>
                    <div className='truncate text-sm'>{user.email}</div>
                  </div>
                </div>
                <div className="">
                  {!isAdded ? (
                    <FaPlus
                      className="text-[#3DB1FF] cursor-pointer text-xl"
                      onClick={() => onAdd(user)}
                    />
                  ) : (
                    <FaMinus
                      className="text-[#3DB1FF] cursor-pointer text-xl"
                      onClick={() => onRemove(user.id)}
                    />
                  )}
                </div>
              </div>
            </div>
          );
        }

        )}
      </InfiniteScroll>
    </div>
  )
}
