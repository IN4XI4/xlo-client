import { useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { AssessmentsList } from "../components/assessments/AssessmentsList";
import { AssessmentsFilterCol } from "../components/assessments/AssessmentsFilterCol";
import { AssessmentsFilterBar } from "../components/assessments/AssessmentsFilterBar";
import { ASSESSMENT_LANGUAGES } from "../globals";

const getLangLabel = (code) => ASSESSMENT_LANGUAGES.find(l => l.code === code)?.label ?? code;

export function AssessmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicNames, setTopicNames] = useState({});

  const filters = useMemo(() => ({
    name: searchParams.get('name') ?? '',
    topics: Object.fromEntries(
      searchParams.getAll('topic').map(id => [id, topicNames[id] ?? ''])
    ),
    languages: Object.fromEntries(
      searchParams.getAll('lang').map(code => [code, getLangLabel(code)])
    ),
    ordering: searchParams.get('ordering') ?? undefined,
  }), [searchParams, topicNames]);

  const handleNameFilterChange = (name) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (name) next.set('name', name);
      else next.delete('name');
      return next;
    }, { replace: true });
  };

  const handleToggleTopic = (topicId, topicName) => {
    const id = String(topicId);
    setTopicNames(prev => ({ ...prev, [id]: topicName }));
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const existing = next.getAll('topic');
      if (existing.includes(id)) {
        next.delete('topic');
        existing.filter(t => t !== id).forEach(t => next.append('topic', t));
      } else {
        next.append('topic', id);
      }
      return next;
    });
  };

  const handleToggleLanguage = (langCode) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const existing = next.getAll('lang');
      if (existing.includes(langCode)) {
        next.delete('lang');
        existing.filter(l => l !== langCode).forEach(l => next.append('lang', l));
      } else {
        next.append('lang', langCode);
      }
      return next;
    });
  };

  const handleToggleOrderBy = (orderByValue) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (orderByValue) next.set('ordering', orderByValue);
      else next.delete('ordering');
      return next;
    });
  };

  const filterProps = {
    onNameFilterChange: handleNameFilterChange,
    onToggleTopic: handleToggleTopic,
    onToggleLanguage: handleToggleLanguage,
    onToggleOrderBy: handleToggleOrderBy,
    filters,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-2 w-full p-4 pt-16 md:pt-24">
      <SEO
        title="Assessments"
        description="Browse and take knowledge assessments on Mixelo. Filter by topic, language, and difficulty to find the right challenge for you."
      />
      <AssessmentsFilterBar {...filterProps} />
      <AssessmentsFilterCol {...filterProps} />
      <AssessmentsList filters={filters} />
    </div>
  );
}
