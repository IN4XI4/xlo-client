import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { getUserById } from '../api/users.api';
import { SEO } from '../components/SEO';
import { ProfileHeader } from '../components/user-profile/ProfileHeader';
import { ProfileHeaderSkeleton } from '../components/user-profile/ProfileHeaderSkeleton';
import { DEFAULT_TAB, ProfileTabs } from '../components/user-profile/ProfileTabs';
import { ProfileTabContent } from '../components/user-profile/ProfileTabContent';

// Public user profile at /profile/:id.
// Not to be confused with /profile/ (ProfilePage), which is the logged-in user's settings.
//
// Same page for everyone; users/{id}/ returns more fields the more access the viewer has:
//  - guests:  very limited info
//  - logged-in users: more info
//  - the profile's owner: most complete info
export function UserProfilePage() {
  const { id } = useParams();
  const { user } = useUser();
  const [isAuthenticated] = useState(() => !!localStorage.getItem('token'));
  const isOwner = isAuthenticated && String(user?.id) === id;
  const [profile, setProfile] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [activeTab, setActiveTab] = useState(DEFAULT_TAB);

  useEffect(() => {
    let ignore = false;
    setProfile(null);
    setNotFound(false);
    setActiveTab(DEFAULT_TAB);
    getUserById(id)
      .then((res) => { if (!ignore) setProfile(res.data); })
      .catch(() => { if (!ignore) setNotFound(true); });
    return () => { ignore = true; };
  }, [id]);

  const fullName = profile ? `${profile.first_name ?? ''} ${profile.last_name ?? ''}`.trim() : '';

  return (
    <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32 pb-12">
      <SEO title={fullName || 'Profile'} canonicalPath={`/profile/${id}`} />
      {notFound && (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 text-center text-gray-500">
          User not found
        </div>
      )}
      {!notFound && !profile && <ProfileHeaderSkeleton />}
      {profile && (
        <>
          <ProfileHeader profile={profile} isAuthenticated={isAuthenticated} isOwner={isOwner} />
          <ProfileTabs profile={profile} isAuthenticated={isAuthenticated} isOwner={isOwner}
            activeTab={activeTab} onChange={setActiveTab} />
          <ProfileTabContent key={id} activeTab={activeTab} userId={id} isAuthenticated={isAuthenticated} isOwner={isOwner} />
        </>
      )}
    </div>
  );
}
