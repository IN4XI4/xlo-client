import { useState, useEffect, useRef } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { filterAssessments } from "../../api/assessments.api";
import { AssessmentCard } from "./AssessmentCard";


export function AssessmentsList({ filters }) {
  const [assessments, setAssessments] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const pageRef = useRef(1);

  useEffect(() => {
    const controller = new AbortController();
    pageRef.current = 1;
    setAssessments([]);
    setHasMore(true);
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
    }
  }

  const loadMore = () => {
    pageRef.current += 1;
    loadAssessments(pageRef.current, false);
  };

  const generateFilterSummary = () => {
    const filterEntries = [
      filters.name && filters.name.trim() !== "" && `name ${filters.name}`,
      Object.values(filters.topics).some(topic => topic.trim() !== "") && `categories ${Object.values(filters.topics).filter(topic => topic.trim() !== "").join(", ")}`,
      Object.values(filters.languages).length > 0 && `languages ${Object.values(filters.languages).join(", ")}`
    ].filter(Boolean);

    if (!filterEntries.length) {
      return "";
    }

    return `Filtering by ${filterEntries.join(" and ")}`;
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
      <div id="filters-summary" className="text-gray-500">
        {generateFilterSummary()}
      </div>
      <div className="text-[#3DB1FF]">
        Found <span className="font-semibold">{totalCount}</span>  assessments
      </div>
      <InfiniteScroll
        dataLength={assessments.length}
        scrollThreshold="95%"
        next={loadMore}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
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
    </div>
  );
}