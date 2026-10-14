import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { SEO } from "../components/SEO";
import { getTopicTags } from "../api/base.api";
import { AssessmentsList } from "../components/assessments/AssessmentsList";
import { AssessmentsFilterCol } from "../components/assessments/AssessmentsFilterCol";
import { AssessmentsFilterBar } from "../components/assessments/AssessmentsFilterBar";
import { ASSESSMENT_LANGUAGES } from "../globals";

const getLangLabel = (code) => ASSESSMENT_LANGUAGES.find(l => l.code === code)?.label ?? code;

export function AssessmentsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [topicNames, setTopicNames] = useState({});
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    getTopicTags()
      .then(res => setCategories(res.data.results))
      .catch(error => console.error('Error fetching categories:', error));
  }, []);

  // Topic lookup by id, so SEO works when the page is opened straight from a URL.
  const topicsById = useMemo(() => {
    const map = {};
    categories.forEach(category => category.topics.forEach(topic => {
      map[String(topic.id)] = { ...topic, categoryName: category.name };
    }));
    return map;
  }, [categories]);

  const filters = useMemo(() => ({
    name: searchParams.get('name') ?? '',
    topics: Object.fromEntries(
      searchParams.getAll('topic').map(id => [id, topicNames[id] ?? topicsById[id]?.title ?? ''])
    ),
    languages: Object.fromEntries(
      searchParams.getAll('lang').map(code => [code, getLangLabel(code)])
    ),
    ordering: searchParams.get('ordering') ?? '-attempts_count',
  }), [searchParams, topicNames, topicsById]);

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

  const handleClearFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('name');
      next.delete('topic');
      next.delete('lang');
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

  const pageTitle = useMemo(() => {
    const topicParts = Object.values(filters.topics).filter(Boolean);
    const langParts = Object.values(filters.languages).filter(Boolean);
    if (!topicParts.length && !langParts.length && !filters.name) return 'Online Tests & Quizzes';
    let title;
    if (topicParts.length) title = `${topicParts.join(' & ')} Tests & Quizzes`;
    else if (filters.name) title = `"${filters.name}" Assessments`;
    else title = 'Online Tests & Quizzes';
    if (langParts.length) title += ` in ${langParts.join(' & ')}`;
    return title;
  }, [filters]);

  // Same rule as /stories: only a view filtered by exactly one topic gets its own
  // canonical and meta; any other combination points to /assessments.
  const seo = useMemo(() => {
    const topicIds = Object.keys(filters.topics);
    const topic = topicIds.length === 1 && !filters.name && !Object.keys(filters.languages).length
      ? topicsById[topicIds[0]]
      : null;
    if (!topic) {
      return {
        title: pageTitle,
        description: "Take online tests, quizzes and assessments on Mixelo to check your knowledge and prepare for your exams. Filter by topic, language, and difficulty.",
        canonicalPath: '/assessments',
      };
    }
    return {
      title: pageTitle,
      description: topic.description || `Take online tests and quizzes about ${topic.title} in ${topic.categoryName} on Mixelo.`,
      image: topic.image || undefined,
      canonicalPath: `/assessments?topic=${topic.id}`,
    };
  }, [filters, topicsById, pageTitle]);

  const filterProps = {
    onNameFilterChange: handleNameFilterChange,
    onToggleTopic: handleToggleTopic,
    onToggleLanguage: handleToggleLanguage,
    onToggleOrderBy: handleToggleOrderBy,
    filters,
    categories,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-2 w-full p-4 pt-16 md:pt-24">
      <SEO {...seo} />
      <AssessmentsFilterBar {...filterProps} />
      <AssessmentsFilterCol {...filterProps} />
      <AssessmentsList
        filters={filters}
        onNameFilterChange={handleNameFilterChange}
        onToggleTopic={handleToggleTopic}
        onToggleLanguage={handleToggleLanguage}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
