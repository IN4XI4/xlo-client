import { useEffect, useLayoutEffect, useRef, useState } from 'react';

// Space reserved for the fixed navigation bar (matches the pages' pt-24).
const NAVBAR_OFFSET = 96;
const GAP = 4;
const EDGE = 8;

// Fixed-position tooltip: escapes scroll containers and stays above the navbar.
// Opens above the trigger, or below it when there is no room under the navbar.
export function HoverTooltip({ content, children, className = '', maxWidthClassName = 'max-w-xs' }) {
  const triggerRef = useRef(null);
  const tooltipRef = useRef(null);
  const [anchor, setAnchor] = useState(null);
  const [coords, setCoords] = useState(null);

  const show = () => setAnchor(triggerRef.current.getBoundingClientRect());
  const hide = () => {
    setAnchor(null);
    setCoords(null);
  };

  useLayoutEffect(() => {
    if (!anchor || !tooltipRef.current) return;
    const { width, height } = tooltipRef.current.getBoundingClientRect();
    const fitsAbove = anchor.top - GAP - height >= NAVBAR_OFFSET;
    const top = fitsAbove ? anchor.top - GAP - height : anchor.bottom + GAP;
    const centered = anchor.left + anchor.width / 2 - width / 2;
    const left = Math.min(Math.max(centered, EDGE), window.innerWidth - width - EDGE);
    setCoords({ top, left });
  }, [anchor]);

  useEffect(() => {
    if (!anchor) return;
    window.addEventListener('scroll', hide, true);
    return () => window.removeEventListener('scroll', hide, true);
  }, [anchor]);

  return (
    <div ref={triggerRef} onMouseEnter={show} onMouseLeave={hide} className={className}>
      {children}
      {anchor && (
        <div
          ref={tooltipRef}
          className={`fixed z-40 ${maxWidthClassName} pointer-events-none rounded-lg bg-gray-50 text-gray-500 border text-xs py-1.5 px-2.5 shadow-sm ${coords ? '' : 'invisible'}`}
          style={coords ?? { top: 0, left: 0 }}
        >
          {content}
        </div>
      )}
    </div>
  );
}
