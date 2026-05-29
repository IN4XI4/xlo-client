import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getTopic, getTopicsByCategory } from '../../../../api/base.api';
import { CategoryIcon } from '../../../illustrations/icons/CategoryIcon';
import { SearchIcon } from '../../../illustrations/icons/SearchIcon';

export function CategoryView({ assessment }) {
  const [topics, setTopics] = useState([]);
  const navigate = useNavigate();
  const currentTopicId = assessment.topic;

  useEffect(() => {
    getTopic(currentTopicId)
      .then(r => {
        const tagId = typeof r.data.tag === 'object' ? r.data.tag?.id : r.data.tag;
        if (!tagId) return;
        return getTopicsByCategory(tagId);
      })
      .then(r => r && setTopics(r.data.results ?? r.data))
      .catch(() => {});
  }, [currentTopicId]);

  const otherTopics = topics.filter(t => t.id !== currentTopicId);

  return (
    <div className="py-4 flex flex-col gap-4">
      <div className="flex items-center gap-2">
        <SearchIcon color="#846EFF" className="w-6 h-6 flex-shrink-0" />
        <div className="bg-gray-50 rounded-full px-4 py-2 text-sm text-gray-600 flex-1">
          {assessment.category_name}
        </div>
      </div>

      {otherTopics.length > 0 && (
        <div className="flex flex-col gap-2">
          <div className="font-semibold text-gray-700">Other available topics</div>
          <div className="text-sm text-gray-500">
            Below you will find all the topics related to this category.
          </div>
          <div className="flex flex-wrap gap-2 mt-1">
            {otherTopics.map(topic => (
              <div
                key={topic.id}
                className="flex items-center gap-1.5 bg-[#E6E2FF] text-[#846EFF] rounded-full px-3 py-1 text-sm font-medium cursor-pointer"
                onClick={() => navigate(`/topic/${topic.slug}`)}
              >
                <SearchIcon color="#846EFF" className="w-3.5 h-3.5 flex-shrink-0" />
                {topic.title}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
