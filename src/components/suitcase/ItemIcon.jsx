import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { getComponent, TYPE_FOLDER } from '../profile/avatar/SelectItem';

function CenteredItemThumb({ Comp }) {
  const svgRef = useRef(null);

  useLayoutEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    const wrap = svg.querySelector('g');
    if (wrap?.getBBox) {
      const { x, y, width, height } = wrap.getBBox();
      if (width && height) svg.setAttribute('viewBox', `${x} ${y} ${width} ${height}`);
    }
  }, [Comp]);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="xMidYMid meet"
    >
      <g><Comp /></g>
    </svg>
  );
}

export function ItemIcon({ item }) {
  const [Comp, setComp] = useState(null);

  useEffect(() => {
    if (!item?.svg || !item?.item_type) return;
    const folder = TYPE_FOLDER[item.item_type] ?? item.item_type.toLowerCase();
    getComponent(`${folder}/${item.svg}`).then((LoadedComp) => setComp(() => LoadedComp));
  }, [item?.svg, item?.item_type]);

  if (!Comp) return null;

  return (
    <div className="w-8 h-8 shrink-0">
      <CenteredItemThumb Comp={Comp} />
    </div>
  );
}
