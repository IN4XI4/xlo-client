import React from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { JoinSpaceCard } from './JoinSpaceCard'


export function ListSpaces({ spaces, setSpaces, setCurrentPage, hasMore }) {

  const handleRequestSent = (spaceId) => {
    setSpaces(prev =>
      prev.map(s =>
        s.id === spaceId ? { ...s, has_membership_request: true } : s
      )
    );
  };

  return (
    <div className='pb-3'>
      <InfiniteScroll
        dataLength={spaces.length}
        next={() => setCurrentPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p>
            <b>You have seen it all...</b>
          </p>
        }
      >
        {spaces.map(space => (
          <JoinSpaceCard
            key={space.id}
            space={space}
            onRequestSent={handleRequestSent} />
        ))}
      </InfiniteScroll>
    </div>
  )
}
