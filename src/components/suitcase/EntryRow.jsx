import React from 'react';
import { FiArrowDownCircle, FiArrowUpCircle, FiGift, FiAward } from 'react-icons/fi';
import { SPEND_RENDERERS, DEFAULT_SPEND_RENDERER } from './spendConfig';

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function RowIcon({ entry }) {
  const { entry_type, detail } = entry;
  const type = detail?.type;
  const isCredit = entry_type === 'credit';

  if (type === 'welcome_bonus') return <FiGift className="w-6 h-6 text-[#3DB1FF]" />;
  if (type === 'level_up') return <FiAward className="w-6 h-6 text-amber-400" />;
  if (type === 'spend') {
    const renderer = SPEND_RENDERERS[detail.reason] ?? DEFAULT_SPEND_RENDERER;
    return renderer.icon(detail);
  }
  return isCredit
    ? <FiArrowUpCircle className="w-6 h-6 text-green-500" />
    : <FiArrowDownCircle className="w-6 h-6 text-red-400" />;
}

const CREDIT_CONTENT = {
  purchase: ({ detail }) => (
    <>
      <div className="text-sm font-medium text-gray-800 truncate">{detail.package_name}</div>
      <div className="text-xs text-gray-400">{detail.price_display}</div>
    </>
  ),
  welcome_bonus: () => (
    <>
      <div className="text-sm font-medium text-gray-800">Welcome coins gift</div>
      <div className="text-xs text-gray-400">Sign-up reward</div>
    </>
  ),
  level_up: () => (
    <>
      <div className="text-sm font-medium text-gray-800">Level up reward</div>
      <div className="text-xs text-gray-400">Coins gift for reaching a new level</div>
    </>
  ),
};

function RowContent({ entry }) {
  const { detail } = entry;
  const type = detail?.type;

  if (type === 'spend') {
    const renderer = SPEND_RENDERERS[detail.reason] ?? DEFAULT_SPEND_RENDERER;
    return (
      <>
        <div className="text-sm font-medium text-gray-800 truncate">{renderer.label(detail)}</div>
        <div className="text-xs text-gray-400">{renderer.sublabel(detail)}</div>
      </>
    );
  }

  const ContentFn = CREDIT_CONTENT[type];
  if (ContentFn) return <ContentFn detail={detail} />;

  return <div className="text-sm text-gray-500 truncate">{type ?? '—'}</div>;
}

export function EntryRow({ entry }) {
  const isCredit = entry.entry_type === 'credit';

  return (
    <div className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
      <div className="shrink-0 flex items-center justify-center w-8 h-8">
        <RowIcon entry={entry} />
      </div>
      <div className="flex-1 min-w-0">
        <RowContent entry={entry} />
      </div>
      <div className="flex flex-col items-end shrink-0">
        <div className={`text-sm font-semibold ${isCredit ? 'text-green-600' : 'text-red-500'}`}>
          {isCredit ? '+' : '-'}{entry.amount.toLocaleString()} coins
        </div>
        <div className="text-xs text-gray-400">{formatDate(entry.created_at)}</div>
      </div>
    </div>
  );
}
