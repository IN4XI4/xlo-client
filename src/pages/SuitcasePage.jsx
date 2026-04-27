import React from 'react';
import { BsInfoCircleFill } from 'react-icons/bs';
import { BuyCoins } from '../components/suitcase/BuyCoins';
import { CoinHistory } from '../components/suitcase/CoinHistory';
import { useUser } from '../context/UserContext';

export function SuitcasePage() {
  const { user } = useUser();

  return (
    <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32 pb-4">
      <div className="flex items-center gap-2 pb-3">
        <div className="text-2xl font-semibold">My suitcase</div>
        <BsInfoCircleFill
          onClick={() => { }}
          className="w-3 h-3 text-[#1C64F2] cursor-pointer"
        />
        {user?.coin_balance != null && (
          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-sm text-gray-500">Balance:</span>
            <span className="text-sm font-semibold text-[#3DB1FF]">
              {user.coin_balance.toLocaleString()} $MXC
            </span>
          </div>
        )}
      </div>
      <BuyCoins />
      <CoinHistory />
    </div>
  );
}
