import { RankingUserView } from './views/RankingUserView';
import { CreatorIcon } from '../illustrations/icons/CreatorIcon';

export const SIDEBAR_VIEWS = {
  user: {
    label: 'User info',
    Icon: CreatorIcon,
    Content: ({ userId }) => <RankingUserView userId={userId} />,
  },
};

export const DEFAULT_VIEW = 'user';
