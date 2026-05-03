import React from 'react';
import { CURRENCY_SYMBOLS } from '../../globals';

export function PackageCard({ pkg, onSelect }) {
  return (
    <div
      onClick={() => onSelect(pkg)}
      className="border-2 border-[#FF822C] rounded-2xl p-4 flex flex-col bg-white
      items-center w-[145px] md:w-[170px] shrink-0 cursor-pointer hover:bg-orange-50 transition-colors">
      <div className="text-3xl md:text-4xl font-semibold text-[#FF822C]">
        {CURRENCY_SYMBOLS[pkg.currency] ?? pkg.currency}{pkg.price_display.split(' ')[0]}
      </div>
      <div className="text-sm text-gray-500 pb-2">{pkg.currency}</div>
      <div className="py-2 text-sm text-center">{pkg.name}</div>
      <div className="font-semibold text-md md:text-lg text-gray-500 py-2 md:py-3">
        {pkg.coins.toLocaleString()} coins
      </div>
    </div>
  );
}
