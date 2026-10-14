import { Navigate, useParams } from 'react-router-dom';

import { NewStoryForm } from '../components/new_create_stories/NewStoryForm';
import { useCreateStory } from '../hooks/UseCreateStory';


// Story creation with the topic fixed by the URL (/create-story/:id/:slug).
export function CreateTopicStoryPage() {
  const { id: topicId, slug } = useParams();
  const { isLoading, isSubmitting, isCreator, userLevel, submitMessage, isSubmitError, submitStory } = useCreateStory();

  const onSubmit = (data) => submitStory(data, topicId, `/topic/${slug}`);

  if (isLoading) {
    return <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">Loading...</div>;
  }

  if (!isCreator) {
    return <Navigate to="/" />;
  }
  return <NewStoryForm
    initialData={null}
    userLevel={userLevel}
    isCreator={isCreator}
    submitMessage={submitMessage}
    isSubmitError={isSubmitError}
    onSubmit={onSubmit}
    isSubmitting={isSubmitting} />
}
