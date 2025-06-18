import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { UserSpaceRow } from './UserSpaceRow'


export function ListSpaceMembers({ spaceId, members, hasMore, setCurrentPage, memberType, isOwner }) {
  return (
    <div className='pb-3'>
      <InfiniteScroll
        dataLength={members.length}
        next={() => setCurrentPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p>
            <b>You have seen it all...</b>
          </p>
        }
      >
        {members.map(member => (
          <UserSpaceRow
            key={member.id}
            member={member}
            memberType={memberType}
            isOwner={isOwner}
            spaceId={spaceId} />
        ))}
      </InfiniteScroll>
    </div>
  )
}
