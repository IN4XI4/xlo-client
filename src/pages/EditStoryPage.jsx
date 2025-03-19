import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';

import { getUser } from '../api/users.api';
import { getStoryFull, updateStoryFull } from '../api/blog.api';
import { StoryForm } from '../components/create_stories/StoryForm';
import { BuildFormData } from '../components/create_stories/BuildFormData';


export function EditStoryPage() {
  const { id: storyId } = useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [userLevel, setUserLevel] = useState(0);
  const [userPicture, setUserPicture] = useState(0);
  const [userColor, setUserColor] = useState(0);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isSubmitError, setIsSubmitError] = useState(false);

  useEffect(() => {
    const loadUserMe = async () => {
      try {
        const response = await getUser();
        const user_level = response.data.user_level
        const user_image = response.data.picture
        const user_color = response.data.profile_color
        setUserLevel(user_level)
        setUserPicture(user_image)
        setUserColor(user_color)

      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
      }
    };
    loadUserMe();
  }, []);

  useEffect(() => {
    const loadStoryData = async (storyId) => {
      try {
        setIsLoading(true);
        const response = await getStoryFull(storyId);
        setInitialData(response.data)
        setIsLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
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
    return <div className="pt-24 px-4 md:px-12 lg:px-24 xl:px-28 3xl:px-32">Loading...</div>;
  }

  return (
    <StoryForm
      initialData={initialData}
      onSubmit={onSubmit}
      submitMessage={submitMessage}
      isSubmitError={isSubmitError}
      userLevel={userLevel}
      userColor={userColor}
      userPicture={userPicture}
      storyId={storyId} />
  )
}
