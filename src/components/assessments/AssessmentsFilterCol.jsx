import React from 'react';
import { FilterPanel } from './AssessmentsFilterPanel';

export function AssessmentsFilterCol(props) {
  return (
    <div className="hidden lg:block lg:col-span-3 xl:col-span-2 border-r border-gray-300">
      <FilterPanel {...props} />
    </div>
  );
}
