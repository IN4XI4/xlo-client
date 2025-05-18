import axios from "axios";

const blogApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}blog/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

// Stories
export const getStories = (page, page_size = 10, ordering = null, searchText = '', spaceId = null) => {
  let url = `stories/?page=${page}&page_size=${page_size}`;
  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  if (searchText) {
    url += `&title__icontains=${encodeURIComponent(searchText)}`;
  }
  if (spaceId) {
    url += `&spaces=${spaceId}`;
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};
export const getStoriesByTopic = (topic_id, page, ordering = null, searchText = '', spaceId = null) => {
  let url = `stories/?topic=${topic_id}&page=${page}`;
  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  if (searchText) {
    url += `&title__icontains=${encodeURIComponent(searchText)}`;
  }
  if (spaceId) {
    url += `&spaces=${spaceId}`;
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};


export const getLikedStories = (page, page_size = 10, ordering = null, spaceId = null) => {
  let url = `stories/liked_stories/?page=${page}&page_size=${page_size}`;
  if (ordering) {
    url += `&order=${ordering}`;
  }
  if (spaceId) {
    url += `&spaces=${spaceId}`;
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};

export const getLikedTopicStories = (page, ordering = null, searchText = '') => {
  let url = `stories/liked_topics_stories/?page=${page}`;
  if (ordering) {
    url += `&order=${ordering}`;
  }
  if (searchText) {
    url += `&search=${encodeURIComponent(searchText)}`;
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};
export const getMyCreatedStories = (page, ordering = null, searchText = '', user_owned = null) => {

  let url = `stories/?page=${page}`;

  if (ordering) {
    url += `&ordering=${ordering}`;
  }
  if (searchText) {
    url += `&title__icontains=${encodeURIComponent(searchText)}`;
  }
  if (user_owned) {
    url += '&user_owned=true';
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};
export const getStory = (storyId) => blogApi.get(`stories/${storyId}/`, { headers: getAuthHeaders() })
export const getStoryBySlug = (slug) => blogApi.get(`stories/find-by-slug/${slug}/`, { headers: getAuthHeaders() })
export const getStoryFull = (storyId) => blogApi.get(`stories/${storyId}/get-story-full/`, { headers: getAuthHeaders() })
export const createStoryFull = (data) => blogApi.post(`stories/create-story-full/`, data, { headers: getAuthHeaders() })
export const updateStoryFull = (storyId, data) => blogApi.put(`stories/${storyId}/update-story-full/`, data, { headers: getAuthHeaders() })
export const deleteStory = (storyId) => blogApi.delete(`stories/${storyId}/`, { headers: getAuthHeaders() })

export const userViewStory = (data) => blogApi.post(`user-view-story/`, data, { headers: getAuthHeaders() })

// Cards
export const getCardsByStory = (storyId) => blogApi.get(`cards/?story=${storyId}`, { headers: getAuthHeaders() })
export const getCardsBySoftSkill = (data, page) => blogApi.post(`cards/random-by-softskill/?page=${page}`, data, { headers: getAuthHeaders() })

// Blocks
export const getBlock = (blockId) => blogApi.get(`blocks/${blockId}/`, { headers: getAuthHeaders() })
export const getBlocksByCard = (cardId) => blogApi.get(`blocks/?card=${cardId}`, { headers: getAuthHeaders() })

// Comments
export const getCommentsByStory = (storyId, page, newest = false) => {
  let url = `comments/?story=${storyId}&parent__isnull=true&page=${page}`;
  if (newest) {
    url += '&ordering=-created_time';
  }
  return blogApi.get(url, { headers: getAuthHeaders() });
};
export const getReplies = (commentId, page) => blogApi.get(`comments/?parent=${commentId}&page=${page}`, { headers: getAuthHeaders() })
export const createComment = (data) => blogApi.post(`comments/`, data, { headers: getAuthHeaders() })
// Likes
export const likeSomething = (data) => blogApi.post(`likes/`, data, { headers: getAuthHeaders() })
export const deleteLike = (likeId) => blogApi.delete(`likes/${likeId}/`, { headers: getAuthHeaders() })
export const updateLike = (likeId, data) => blogApi.patch(`likes/${likeId}/`, data, { headers: getAuthHeaders() })


// Recalls
export const recallCard = (data) => blogApi.post(`recalls/`, data, { headers: getAuthHeaders() })
export const recallBlock = (data) => blogApi.post(`recall-blocks/`, data, { headers: getAuthHeaders() })
export const recallComment = (data) => blogApi.post(`recall-comments/`, data, { headers: getAuthHeaders() })
export const deleteRecallCard = (recallId) => blogApi.delete(`recalls/${recallId}/`, { headers: getAuthHeaders() })
export const deleteRecallBlock = (recallId) => blogApi.delete(`recall-blocks/${recallId}/`, { headers: getAuthHeaders() })
export const deleteRecallComment = (recallId) => blogApi.delete(`recall-comments/${recallId}/`, { headers: getAuthHeaders() })
export const getMyRecallCards = () => blogApi.get(`recalls/user-recall-cards`, { headers: getAuthHeaders() })
// TODO: dynamic ordering and filtering for recallBlocks
export const getMyRecallBlocksFocused = () => blogApi.get(`recall-blocks/random-recalled-block-ids`, { headers: getAuthHeaders() })
export const getMyRecallBlocksSparked = (page, importanceOrder = '-importance_level', createdTimeOrder = '-created_time') => {
  const ordering = `${importanceOrder},${createdTimeOrder}`;
  return blogApi.get(`recall-blocks/?ordering=${ordering}&page=${page}`, { headers: getAuthHeaders() });
};

// Notifications
export const listLikeNotifications = (page) => blogApi.get(`notifications/?notification_type=like&page=${page}`, { headers: getAuthHeaders() })
export const listReplyNotifications = (page) => blogApi.get(`notifications/?notification_type=reply&page=${page}`, { headers: getAuthHeaders() })
export const updateNotification = (id, data) => blogApi.patch(`notifications/${id}/`, data, { headers: getAuthHeaders() })
