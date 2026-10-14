import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { getUser } from '../api/users.api';
import { createStoryFull } from '../api/blog.api';
import { BuildFormData } from '../components/create_stories/BuildFormData';

// Shared logic for the create story pages: loads the user (creator check + level)
// and submits the story. Each page decides the topic and where to go afterwards.
export function useCreateStory() {
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  // Kept apart from isLoading so the form stays mounted (and keeps its data) while submitting.
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);

  useEffect(() => {
    const loadUserMe = async () => {
      try {
        setIsLoading(true);
        const response = await getUser();
        setUserLevel(response.data.user_level_display.level_value);
        if (response.data.is_creator) {
          setIsCreator(true);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadUserMe();
  }, []);

  const submitStory = async (data, topicId, redirectTo) => {
    const formData = BuildFormData(data, setSubmitMessage, setIsSubmitError, setIsSubmitting, topicId);
    if (!formData) {
      return;
    }
    try {
      await createStoryFull(formData);
      setIsSubmitError(false);
      navigate(redirectTo, { state: { storyCreated: true } });
    } catch (error) {
      console.error("Error creating story:", error.response?.data || error.message);
      setSubmitMessage('Failed to create story. Please try again.');
      setIsSubmitError(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isLoading, isSubmitting, isCreator, userLevel, submitMessage, isSubmitError, submitStory };
}
