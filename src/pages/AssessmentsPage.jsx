import { useState } from "react";
import { AssessmentsList } from "../components/assessments/AssessmentsList";
import { AssessmentsFilterCol } from "../components/assessments/AssessmentsFilterCol";
import { useSearchParams } from "react-router-dom";


export function AssessmentsPage() {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || '';
  const searchTopicId = searchParams.get("topic") || '';
  const searchTopicName = searchParams.get("topicName") ? decodeURIComponent(searchParams.get("topicName")) : '';
  const [filters, setFilters] = useState({
    name: searchQuery,
    topics: searchTopicId ? { [searchTopicId]: searchTopicName } : {},
    languages: {}
  });
  const handleNameFilterChange = (name) => {
    setFilters(prevFilters => ({ ...prevFilters, name }));
  };

  const handleToggleTopic = (topicId, topicName) => {
    setFilters(prevFilters => {
      const { topics } = prevFilters;
      let newTopics = { ...topics };

      if (topicId in topics) {
        delete newTopics[topicId];
      } else {
        newTopics[topicId] = topicName;
      }
      return { ...prevFilters, topics: newTopics };
    });
  };

  const handleToggleLanguage = (langCode, langLabel) => {
    setFilters((prev) => {
      const newLanguages = { ...prev.languages };
      if (langCode in newLanguages) delete newLanguages[langCode];
      else newLanguages[langCode] = langLabel;
      return { ...prev, languages: newLanguages };
    });
  };


  const handleToggleOrderBy = (orderByValue) => {
    setFilters(prevFilters => {
      return {
        ...prevFilters,
        ordering: orderByValue
      };
    });
  };


  return (
    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 w-full p-4 pt-16 md:pt-24">
      <AssessmentsFilterCol
        onNameFilterChange={handleNameFilterChange}
        onToggleTopic={handleToggleTopic}
        onToggleLanguage={handleToggleLanguage}
        onToggleOrderBy={handleToggleOrderBy}
        filters={filters}
      />
      <AssessmentsList filters={filters} />
    </div>
  );
}