import { CategoriesRead } from './CategoriesRead';
import { LearningActivity } from './LearningActivity';
import { OverviewStats } from './OverviewStats';
import { ProfileBadges } from './ProfileBadges';

export function OverviewTab({ userId, isAuthenticated, isOwner }) {
  return (
    <div className="flex flex-col gap-4">
      {isOwner && <OverviewStats />}
      {isAuthenticated && <ProfileBadges userId={userId} isOwner={isOwner} />}
      <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-4">
        <LearningActivity userId={userId} />
        <CategoriesRead userId={userId} />
      </div>
    </div>
  );
}
