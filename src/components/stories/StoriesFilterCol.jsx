import { StoriesFilterPanel } from './StoriesFilterPanel';

export function StoriesFilterCol(props) {
  return (
    <div className="hidden lg:block lg:col-span-3 xl:col-span-2 border-r border-gray-300">
      <StoriesFilterPanel {...props} />
    </div>
  );
}
