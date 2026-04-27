import React, { useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { getCoinLedgerHistory } from '../../api/wallet.api';
import { EntryRow } from './EntryRow';

export function CoinHistory() {
  const [entries, setEntries] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [nextPage, setNextPage] = useState(1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (ready) fetchPage(1);
  }, [ready]);

  async function fetchPage(page) {
    try {
      const res = await getCoinLedgerHistory(page);
      setEntries((prev) => page === 1 ? res.data.results : [...prev, ...res.data.results]);
      setHasMore(res.data.next !== null);
      setNextPage(page + 1);
    } catch (err) {
      console.error('Error loading coin history:', err);
    }
  }

  return (
    <div className="mt-6">
      <div className="font-semibold mb-3">Transaction history</div>
      <div
        id="coin-history-scroll"
        className="bg-white border border-gray-100 rounded-2xl px-4 max-h-[600px] overflow-y-auto"
      >
        {!ready && (
          <div className="py-8 text-center text-sm text-gray-400">Loading...</div>
        )}
        {ready && (
          <InfiniteScroll
            dataLength={entries.length}
            next={() => fetchPage(nextPage)}
            hasMore={hasMore}
            scrollThreshold="90%"
            scrollableTarget="coin-history-scroll"
            loader={<div className="py-3 text-center text-xs text-gray-400">Loading more...</div>}
            endMessage={
              entries.length > 0
                ? <div className="py-3 text-center text-xs text-gray-300">No more transactions</div>
                : <div className="py-8 text-center text-sm text-gray-400">No transactions yet.</div>
            }
          >
            {entries.map((entry) => (
              <EntryRow key={entry.id} entry={entry} />
            ))}
          </InfiniteScroll>
        )}
      </div>
    </div>
  );
}
