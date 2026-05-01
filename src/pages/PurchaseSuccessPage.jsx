import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ReactGA from 'react-ga4';
import { useAppState } from '../context/ScrollContext';

export function PurchaseSuccessPage() {
  const navigate = useNavigate();
  const { refreshNavigation } = useAppState();

  useEffect(() => {
    refreshNavigation();
  }, []);

  return (
    <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32 flex flex-col items-center gap-6 py-16">
      <div className="text-4xl">⏳</div>
      <div className="text-2xl font-semibold text-gray-800">Payment received</div>
      <div className="text-gray-500 text-center max-w-sm">
        Your payment is being processed. Once confirmed, your coin balance will be updated automatically — this usually takes just a few seconds.
      </div>
      <div className="text-gray-400 text-sm text-center max-w-sm">
        You can close this page and check your balance in a moment.
      </div>
      <div
        onClick={() => navigate('/suitcase/')}
        className="mt-4 px-6 py-3 rounded-xl bg-[#FF822C] text-white font-semibold hover:bg-orange-500 transition-colors cursor-pointer">
        Go to suitcase
      </div>
    </div>
  );
}
