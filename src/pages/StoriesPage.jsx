import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { Alert } from "flowbite-react";
import { HiInformationCircle } from "react-icons/hi2";
import { SEO } from "../components/SEO";
import { getTopicTags } from "../api/base.api";
import { StoriesList } from "../components/stories/StoriesList";
import { StoriesFilterCol } from "../components/stories/StoriesFilterCol";
import { StoriesFilterBar } from "../components/stories/StoriesFilterBar";

const DEFAULT_ORDERING = '-created_time';
const DEFAULT_SEO = {
  title: 'Stories',
  description: 'Browse learning stories on Mixelo. Filter by topic, language, and difficulty to find the right story for you.',
  canonicalPath: '/stories',
};

export function StoriesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [showSignInAlert, setShowSignInAlert] = useState(() => !localStorage.getItem('token'));
  const [showCreatedAlert, setShowCreatedAlert] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    if (!location.state?.storyCreated) return;
    setShowCreatedAlert(true);
    // Drop the state (keeping the filters) so a refresh doesn't show the alert again.
    navigate({ pathname: location.pathname, search: location.search }, { replace: true, state: {} });
  }, [location.state]);

  useEffect(() => {
    if (!showCreatedAlert) return;
    const timer = setTimeout(() => setShowCreatedAlert(false), 5000);
    return () => clearTimeout(timer);
  }, [showCreatedAlert]);

  async function loadCategories() {
    try {
      const res = await getTopicTags();
      setCategories(res.data.results);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }

  const filters = useMemo(() => ({
    name: searchParams.get('name') ?? '',
    topics: searchParams.getAll('topic'),
    languages: searchParams.getAll('lang'),
    difficulties: searchParams.getAll('difficulty'),
    ordering: searchParams.get('ordering') ?? DEFAULT_ORDERING,
  }), [searchParams]);

  // Only a view filtered by exactly one topic gets its own canonical and meta;
  // any other combination points to /stories so filter variants aren't indexed.
  const seo = useMemo(() => {
    const onlyOneTopic = filters.topics.length === 1 && !filters.name
      && !filters.languages.length && !filters.difficulties.length;
    if (!onlyOneTopic) return DEFAULT_SEO;
    const topicId = filters.topics[0];
    for (const category of categories) {
      const topic = category.topics.find(t => String(t.id) === topicId);
      if (topic) {
        return {
          title: `${topic.title} Stories`,
          description: topic.description || `Explore stories about ${topic.title} in ${category.name} on Mixelo.`,
          image: topic.image || undefined,
          canonicalPath: `/stories?topic=${topicId}`,
        };
      }
    }
    return DEFAULT_SEO;
  }, [filters, categories]);

  const toggleMultiParam = (key, value) => {
    const val = String(value);
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      const existing = next.getAll(key);
      if (existing.includes(val)) {
        next.delete(key);
        existing.filter(v => v !== val).forEach(v => next.append(key, v));
      } else {
        next.append(key, val);
      }
      return next;
    });
  };

  const handleNameFilterChange = (name) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (name) next.set('name', name);
      else next.delete('name');
      return next;
    }, { replace: true });
  };

  const handleToggleTopic = (topicId) => toggleMultiParam('topic', topicId);
  const handleToggleLanguage = (langCode) => toggleMultiParam('lang', langCode);
  const handleToggleDifficulty = (level) => toggleMultiParam('difficulty', level);

  const handleToggleOrderBy = (orderByValue) => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      if (orderByValue) next.set('ordering', orderByValue);
      else next.delete('ordering');
      return next;
    });
  };

  const handleClearFilters = () => {
    setSearchParams(prev => {
      const next = new URLSearchParams(prev);
      next.delete('name');
      next.delete('topic');
      next.delete('lang');
      next.delete('difficulty');
      return next;
    });
  };

  const filterProps = {
    onNameFilterChange: handleNameFilterChange,
    onToggleTopic: handleToggleTopic,
    onToggleLanguage: handleToggleLanguage,
    onToggleDifficulty: handleToggleDifficulty,
    onToggleOrderBy: handleToggleOrderBy,
    filters,
    categories,
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 xl:grid-cols-10 gap-2 w-full p-4 pt-16 md:pt-24">
      <SEO {...seo} />
      {showCreatedAlert && (
        <div className="col-span-full">
          <Alert color="success" icon={HiInformationCircle} onDismiss={() => setShowCreatedAlert(false)}>
            <span className="font-medium">Story created successfully!</span>
          </Alert>
        </div>
      )}
      {showSignInAlert && (
        <div className="col-span-full">
          <Alert
            color="info"
            icon={HiInformationCircle}
            onDismiss={() => setShowSignInAlert(false)}
          >
            <span className="font-medium">Sign in to unlock all features and see every story available!</span>
          </Alert>
        </div>
      )}
      <StoriesFilterBar {...filterProps} />
      <StoriesFilterCol {...filterProps} />
      <StoriesList
        filters={filters}
        categories={categories}
        onNameFilterChange={handleNameFilterChange}
        onToggleTopic={handleToggleTopic}
        onToggleLanguage={handleToggleLanguage}
        onToggleDifficulty={handleToggleDifficulty}
        onClearFilters={handleClearFilters}
      />
    </div>
  );
}
