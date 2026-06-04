import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getStoriesByTopic } from '../../../../api/blog.api';
import { TopicIcon } from '../../../illustrations/icons/TopicIcon';
import { SearchIcon } from '../../../illustrations/icons/SearchIcon';

export function TopicsView({ assessment }) {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getStoriesByTopic(assessment.topic, 1, null, '', null, 5)
      .then(r => setStories(r.data.results ?? r.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [assessment.topic]);

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SearchIcon color="#846EFF" className="w-6 h-6 flex-shrink-0" />
        <div className="bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-600 flex-1">
          {assessment.topic_name}
        </div>
      </div>

      {loading && (
        <div className="flex justify-center py-4">
          <div className="w-6 h-6 border-2 border-[#846EFF] border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {!loading && stories.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-gray-700">Available Topic Stories</div>
          <div className="text-sm text-gray-500">
            Below you will find stories related to this topic.
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {stories.map(story => (
              <div
                key={story.id}
                className="flex items-center gap-1.5 bg-[#E6E2FF] text-[#846EFF] rounded-full px-3 py-1 text-sm font-medium cursor-pointer"
                onClick={() => navigate(`/story/${story.slug}`)}
              >
                <SearchIcon color="#846EFF" className="w-3.5 h-3.5 flex-shrink-0" />
                {story.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
