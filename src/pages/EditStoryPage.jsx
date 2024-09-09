import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { StoryForm } from '../components/create_stories/StoryForm';
import { getStoryFull, updateStoryFull } from '../api/blog.api';
import { BuildFormData } from '../components/create_stories/BuildFormData';


export function EditStoryPage() {
  const { id: storyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);

  useEffect(() => {
    const loadStoryData = async (storyId) => {
      try {
        setIsLoading(true);
        const response = await getStoryFull(storyId);
        setInitialData(response.data)
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadStoryData(storyId);
  }, [storyId]);

  const onSubmit = async (data) => {
    const formData = BuildFormData(data, setSubmitMessage, setIsSubmitError, setIsLoading)
    try {
      const response = await updateStoryFull(storyId, formData);
      setIsSubmitError(false);
      navigate(`/story/${initialData.slug}`, { state: { storyUpdated: true } });
    } catch (error) {
      console.error("Error creating story:", error.response?.data || error.message);
      setSubmitMessage('Failed to create story. Please try again.');
      setIsSubmitError(true);
    } finally {
      setIsLoading(false);
    }
  }

  if (isLoading || !initialData) {
    return <div className="pt-24 px-4 md:px-16 lg:px-32 xl:px-44">Loading...</div>;
  }

  return (
    <StoryForm
      initialData={initialData}
      onSubmit={onSubmit}
      submitMessage={submitMessage}
      isSubmitError={isSubmitError}
      storyId={storyId} />
  )
}
