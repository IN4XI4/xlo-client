import { useState, useEffect, useRef } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { FaTimes } from "react-icons/fa";
import { filterAssessments } from "../../api/assessments.api";
import { AssessmentCard } from "./AssessmentCard";
import { AssessmentCardSkeleton } from "./AssessmentCardSkeleton";

const SKELETON_COUNT = 5;

export function AssessmentsList({ filters, onNameFilterChange, onToggleTopic, onToggleLanguage, onClearFilters }) {
  const [assessments, setAssessments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const pageRef = useRef(1);

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 1;
    setAssessments([]);
    setHasMore(true);
    setLoading(true);
    loadAssessments(1, true, controller.signal);
    return () => controller.abort();
  }, [filters]);

  async function loadAssessments(page, replace, signal) {
    try {
      const topicIds = filters.topics ? Object.keys(filters.topics) : [];
      const languageCodes = filters.languages ? Object.keys(filters.languages) : [];
      const params = {
        ...(filters.name && { name: filters.name }),
        ...(topicIds.length && { topic: topicIds.join(',') }),
        ...(languageCodes.length && { languages: languageCodes }),
        ...(filters.ordering && { ordering: filters.ordering }),
        page
      };
      const res = await filterAssessments(params, signal);
      setTotalCount(res.data.count || 0);
      setAssessments(prev => replace ? res.data.results : [...prev, ...res.data.results]);
      setHasMore(Boolean(res.data.next));
    } catch (error) {
      if (error.code === 'ERR_CANCELED') return;
      console.error('Failed to load assessments:', error);
    } finally {
      if (!signal?.aborted) setLoading(false);
    }
  }

  const loadMore = () => {
    pageRef.current += 1;
    loadAssessments(pageRef.current, false);
  };

  const getActiveFilterChips = () => {
    const chips = [];
    if (filters.name && filters.name.trim() !== "") {
      chips.push({ key: 'name', label: filters.name, onRemove: () => onNameFilterChange('') });
    }
    Object.entries(filters.topics).forEach(([id, name]) => {
      if (name.trim() !== "") {
        chips.push({ key: `topic-${id}`, label: name, onRemove: () => onToggleTopic(id, name) });
      }
    });
    Object.entries(filters.languages).forEach(([code, label]) => {
      chips.push({ key: `lang-${code}`, label, onRemove: () => onToggleLanguage(code) });
    });
    return chips;
  };


  return (
    <div className="lg:col-span-8 p-2 lg:me-3">
      <div className=''>
          <div className='text-gray-600 font-bold md:text-xl xl:text-2xl border-b-2 border-gray-600'>
            Assessments
          </div>
          <div className='text-end text-gray-600 text-sm pb-1'>
            [The Mixelo assessments collection]
          </div>
        </div>
      {(() => {
        const chips = getActiveFilterChips();
        if (!chips.length) return null;
        return (
          <div id="filters-summary" className="flex flex-wrap items-center gap-2 py-1">
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
        );
      })()}
      {loading ? (
        <div className="h-4 w-40 rounded-full bg-gray-200 animate-pulse my-1" />
      ) : (
        <div className="text-[#3DB1FF]">
          Found <span className="font-semibold">{totalCount}</span>  assessments
        </div>
      )}
      {loading ? (
        <div>
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <AssessmentCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <InfiniteScroll
          dataLength={assessments.length}
          scrollThreshold="95%"
          next={loadMore}
          hasMore={hasMore}
          loader={<AssessmentCardSkeleton />}
          endMessage={
            <p className="pt-3">
              <b>You have seen it all!</b>
            </p>
          }
        >
          {assessments.map(assessment => (
            <AssessmentCard key={assessment.id} assessment={assessment} />
          ))}
        </InfiniteScroll>
      )}
    </div>
  );
}