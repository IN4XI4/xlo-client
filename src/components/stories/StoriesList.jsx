import { useEffect, useMemo, useRef, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { Link } from 'react-router-dom';
import { FaPlus, FaTimes } from 'react-icons/fa';
import { filterStories } from '../../api/blog.api';
import { useSpace } from '../../context/SpaceContext';
import { useUser } from '../../context/UserContext';
import { ASSESSMENT_LANGUAGES, STORY_DIFFICULTY_LEVELS } from '../../globals';
import { StoryCard } from './StoryCard';
import { StoryCardSkeleton } from './StoryCardSkeleton';

const SKELETON_COUNT = 5;

export function StoriesList({ filters, categories, onNameFilterChange, onToggleTopic, onToggleLanguage, onToggleDifficulty, onClearFilters }) {
  const [stories, setStories] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);
  const { activeSpace } = useSpace();
  const { user } = useUser();

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 1;
    setStories([]);
    setHasMore(true);
    setLoading(true);
    loadStories(1, true, controller.signal);
    return () => controller.abort();
  }, [filters, activeSpace?.id]);

  async function loadStories(page, replace, signal) {
    try {
      const params = {
        title: filters.name,
        topics: filters.topics,
        languages: filters.languages,
        difficulties: filters.difficulties,
        ordering: filters.ordering,
        spaceId: activeSpace?.id,
        page,
      };
      const res = await filterStories(params, signal);
      setTotalCount(res.data.count || 0);
      setStories(prev => replace ? res.data.results : [...prev, ...res.data.results]);
      setHasMore(Boolean(res.data.next));
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return;
      // An unknown topic id answers 400; treat any failure as an empty result.
      console.error('Failed to load stories:', error);
      if (replace) {
        setStories([]);
        setTotalCount(0);
      }
      setHasMore(false);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  const loadMore = () => {
    pageRef.current += 1;
    loadStories(pageRef.current, false);
  };

  const topicTitles = useMemo(() => {
    const titles = {};
    categories.forEach(category => category.topics.forEach(topic => {
      titles[String(topic.id)] = topic.title;
    }));
    return titles;
  }, [categories]);

  const getActiveFilterChips = () => {
    const chips = [];
    if (filters.name.trim() !== '') {
      chips.push({ key: 'name', label: `"${filters.name}"`, onRemove: () => onNameFilterChange('') });
    }
    filters.topics.forEach(id => {
      if (topicTitles[id]) {
        chips.push({ key: `topic-${id}`, label: topicTitles[id], onRemove: () => onToggleTopic(id) });
      }
    });
    filters.languages.forEach(code => {
      const label = ASSESSMENT_LANGUAGES.find(l => l.code === code)?.label ?? code;
      chips.push({ key: `lang-${code}`, label, onRemove: () => onToggleLanguage(code) });
    });
    filters.difficulties.forEach(level => {
      const label = STORY_DIFFICULTY_LEVELS.find(d => String(d.value) === level)?.label ?? level;
      chips.push({ key: `difficulty-${level}`, label, onRemove: () => onToggleDifficulty(level) });
    });
    return chips;
  };

  const chips = getActiveFilterChips();

  return (
    <div className="lg:col-span-8 p-2 lg:me-3">
      <div className='text-gray-600 font-bold md:text-xl xl:text-2xl border-b-2 border-gray-600'>
        Stories
      </div>
      <div className='text-end text-gray-600 text-sm pb-1'>
        [The Mixelo story collection]
      </div>
      {user?.is_creator && (
        <div className="flex justify-end pb-1">
          <Link
            to="/create-story"
            className="inline-flex items-center gap-2 bg-[#3DB1FF] rounded-full ps-1.5 pe-4 py-1.5 text-white font-bold text-xs tracking-wide"
          >
            <div className="bg-white rounded-full p-1 flex items-center justify-center">
              <FaPlus className="text-[#3DB1FF] text-[0.6rem]" />
            </div>
            CREATE NEW STORY
          </Link>
        </div>
      )}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 py-1">
          <span className="text-gray-500 text-sm">Filtering by:</span>
          {chips.map(chip => (
            <div key={chip.key} className="flex items-center gap-1.5 bg-gray-100 text-gray-600 text-sm rounded-full pl-3 pr-2 py-1">
              {chip.label}
              <button
                type="button"
                onClick={chip.onRemove}
                aria-label={`Remove ${chip.label} filter`}
                className="text-gray-400 hover:text-gray-600"
              >
                <FaTimes className="text-xs" />
              </button>
            </div>
          ))}
          {chips.length > 1 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[#3DB1FF] text-sm hover:underline"
            >
              Clear all
            </button>
          )}
        </div>
      )}
      {loading ? (
        <div className="h-4 w-40 rounded-full bg-gray-200 animate-pulse my-1" />
      ) : (
        <div className="text-[#3DB1FF]">
          Found <span className="font-semibold">{totalCount}</span> stories
        </div>
      )}
      {loading ? (
        <div>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <StoryCardSkeleton key={i} />
          ))}
        </div>
      ) : stories.length === 0 ? (
        <div className="py-10 text-center text-gray-500">
          <div>No stories match these filters.</div>
          {chips.length > 0 && (
            <button
              type="button"
              onClick={onClearFilters}
              className="text-[#3DB1FF] text-sm hover:underline pt-2"
            >
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={stories.length}
          scrollThreshold="95%"
          next={loadMore}
          hasMore={hasMore}
          loader={<StoryCardSkeleton />}
          endMessage={
            <div className="pt-3 font-bold">
              You have seen it all!
            </div>
          }
        >
          {stories.map(story => (
            <StoryCard key={story.id} story={story} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}
