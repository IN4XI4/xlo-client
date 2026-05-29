import { CreatorInfoView } from './views/CreatorInfoView';
import { AttemptsView } from './views/AttemptsView';
import { CategoryView } from './views/CategoryView';
import { TopicsView } from './views/TopicsView';
import { CreatorIcon } from '../../illustrations/icons/CreatorIcon';
import { RemainAttemptsIcon } from '../../illustrations/icons/RemainAttemptsIcon';
import { CategoryIcon } from '../../illustrations/icons/CategoryIcon';
import { TopicIcon } from '../../illustrations/icons/TopicIcon';
import { StoryIcon } from '../../illustrations/icons/StoryIcon';
import { DifficultyLevelIcon } from '../../illustrations/icons/DifficultyLevelIcon';

export const SIDEBAR_VIEWS = {
  creator: {
    label: 'Creator info',
    Icon: CreatorIcon,
    Content: ({ assessment }) => <CreatorInfoView assessment={assessment} />,
  },
  attempts: {
    label: 'Available attempts',
    Icon: RemainAttemptsIcon,
    Content: ({ assessment }) => <AttemptsView assessment={assessment} />,
  },
  category: {
    label: 'Related category',
    Icon: CategoryIcon,
    Content: ({ assessment }) => <CategoryView assessment={assessment} />,
  },
  topics: {
    label: 'Related topic',
    Icon: TopicIcon,
    Content: ({ assessment }) => <TopicsView assessment={assessment} />,
  },
  stories: {
    label: 'Stories',
    Icon: StoryIcon,
    Content: () => null,
  },
  difficulty: {
    label: 'Difficulty',
    Icon: DifficultyLevelIcon,
    Content: () => null,
  },
};

export const DEFAULT_VIEW = 'creator';
