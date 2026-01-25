import { useState, useEffect } from "react";
import InfiniteScroll from 'react-infinite-scroll-component';
import { filterAssessments } from "../../api/assessments.api";
import { AssessmentCard } from "./AssessmentCard";


export function AssessmentsList({ filters }) {
  const [assessments, setAssessments] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    setAssessments([]);
    setCurrentPage(1);
    setHasMore(true);
  }, [filters]);

  useEffect(() => {
    loadAssessments();
  }, [currentPage, filters]);

  async function loadAssessments() {
    try {
      const topicIds = filters.topics ? Object.keys(filters.topics) : [];
      const languageCodes = filters.languages ? Object.keys(filters.languages) : [];
      const params = {
        ...(filters.name && { name: filters.name }),
        ...(topicIds.length && { topic: topicIds.join(',') }),
        ...(languageCodes.length && { languages: languageCodes }),
        ...(filters.ordering && { ordering: filters.ordering }),
        page: currentPage
      };
      const res = await filterAssessments(params);
      if (currentPage === 1) {
        setAssessments(res.data.results);
      } else {
        setAssessments([...assessments].concat(res.data.results));
      }
      if (!res.data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Failed to load assessments:', error);
    }
  }

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
    <div className="md:col-span-8 p-4">
      <div id="filters-summary">
        {generateFilterSummary()}
      </div>
      <div className="text-xl text-gray-500">
        Found <span className="font-semibold">{assessments.length}</span>  assessments
      </div>
      <InfiniteScroll
        dataLength={assessments.length}
        scrollThreshold="95%"
        next={() => setCurrentPage(prevPage => prevPage + 1)}
        hasMore={hasMore}
        loader={<h4>Loading...</h4>}
        endMessage={
          <p>
            <b>Yay! You have seen it all</b>
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