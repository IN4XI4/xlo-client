import axios from "axios";

const blogApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}blog/`
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

export const getStoriesByTopic = (topic_id, page, ordering = null, searchText = '') => {
    let url = `stories/?topic=${topic_id}&page=${page}`;
    if (ordering) {
        url += `&ordering=${ordering}`;
    }
    if (searchText) {
        url += `&title__icontains=${encodeURIComponent(searchText)}`;
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
export const getStory = (storyId) => blogApi.get(`stories/${storyId}/`, { headers: getAuthHeaders() })
export const getCardsByStory = (storyId) => blogApi.get(`cards/?story=${storyId}`, { headers: getAuthHeaders() })
export const getBlocksByCard = (cardId) => blogApi.get(`blocks/?card=${cardId}`, { headers: getAuthHeaders() })
export const getCommentsByStory = (storyId, page, newest = false) => {
    let url = `comments/?story=${storyId}&parent__isnull=true&page=${page}`;
    if (newest) {
        url += '&ordering=-created_time';
    }
    return blogApi.get(url, { headers: getAuthHeaders() });
};
export const userViewStory = (data) => blogApi.post(`user-view-story/`, data, { headers: getAuthHeaders() })
export const getReplies = (commentId, page) => blogApi.get(`comments/?parent=${commentId}&page=${page}`, { headers: getAuthHeaders() })
export const createComment = (data) => blogApi.post(`comments/`, data, { headers: getAuthHeaders() })
export const likeSomething = (data) => blogApi.post(`likes/`, data, { headers: getAuthHeaders() })
export const deleteLike = (likeId) => blogApi.delete(`likes/${likeId}/`, { headers: getAuthHeaders() })
export const updateLike = (likeId, data) => blogApi.patch(`likes/${likeId}/`, data, { headers: getAuthHeaders() })