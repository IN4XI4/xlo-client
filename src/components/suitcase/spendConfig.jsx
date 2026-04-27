import React from 'react';
import { FiArrowDownCircle } from 'react-icons/fi';
import { ItemIcon } from './ItemIcon';

function ColorCircle({ hex }) {
  return (
    <div
      className="w-7 h-7 rounded-full border border-gray-200 shrink-0"
      style={{ backgroundColor: hex }}
    />
  );
}

export const SPEND_RENDERERS = {
  buy_item: {
    icon: ({ item }) =>
      item ? <ItemIcon item={item} /> : <FiArrowDownCircle className="w-6 h-6 text-red-400" />,
    label: ({ item }) => item?.name ?? 'Item',
    sublabel: ({ item }) => item?.code ?? '',
  },
  buy_color: {
    icon: ({ color }) => {
      const hex = color?.hex ?? color?.main_color ?? '#ccc';
      return color ? <ColorCircle hex={hex} /> : <FiArrowDownCircle className="w-6 h-6 text-red-400" />;
    },
    label: ({ color }) => color?.name ?? 'Color',
    sublabel: ({ color }) => ('hex' in (color ?? {})) ? 'Item color' : 'Skin color',
  },
};

export const DEFAULT_SPEND_RENDERER = {
  icon: () => <FiArrowDownCircle className="w-6 h-6 text-red-400" />,
  label: ({ reason }) => reason ?? 'Spend',
  sublabel: () => 'Spend',
};
