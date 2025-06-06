import React, { useEffect, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom';

import { StoryForm } from '../components/create_stories/StoryForm';
import { getUser } from '../api/users.api';
import { createStoryFull } from '../api/blog.api';
import { BuildFormData } from '../components/create_stories/BuildFormData';
import { CREATOR_LEVEL_1 } from '../globals';


export function CreateStoryPage() {
  const { id: topicId, slug } = useParams();
  const navigate = useNavigate();
  const [isCreator, setIsCreator] = useState(false);
  const [userLevel, setUserLevel] = useState(0);
  const [userPicture, setUserPicture] = useState(0);
  const [userColor, setUserColor] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);

  useEffect(() => {
    const loadUserMe = async () => {
      try {
        setIsLoading(true);
        const response = await getUser();
        const user_level = response.data.user_level_display.level_value
        const user_image = response.data.picture
        const user_color = response.data.profile_color
        setUserLevel(user_level)
        setUserPicture(user_image)
        setUserColor(user_color)

        if (user_level >= CREATOR_LEVEL_1) {
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

  const onSubmit = async (data) => {
    const formData = BuildFormData(data, setSubmitMessage, setIsSubmitError, setIsLoading, topicId)
    if (!formData) {
      return;
    }
    try {
      const response = await createStoryFull(formData);
      setIsSubmitError(false);
      navigate(`/topic/${slug}`, { state: { storyCreated: true } });
    } catch (error) {
      console.error("Error creating story:", error.response?.data || error.message);
      setSubmitMessage('Failed to create story. Please try again.');
      setIsSubmitError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">Loading...</div>;
  }

  if (!isCreator) {
    return <Navigate to="/" />;
  }
  return <StoryForm
    initialData={null}
    onSubmit={onSubmit}
    submitMessage={submitMessage}
    isSubmitError={isSubmitError}
    userPicture={userPicture}
    userColor={userColor}
    userLevel={userLevel} />
}
