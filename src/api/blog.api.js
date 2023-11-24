import axios from "axios";

const blogApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}blog/`
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

export const getStoriesByTopic = (topic_id, ordering = null) => {
    let url = `stories/?topic=${topic_id}`;
    if (ordering) {
        url += `&ordering=${ordering}`;
    }
    return blogApi.get(url, { headers: getAuthHeaders() });
};
export const getStory = (storyId) => blogApi.get(`stories/${storyId}/`, { headers: getAuthHeaders() })
export const getCardsByStory = (storyId) => blogApi.get(`cards/?story=${storyId}`, { headers: getAuthHeaders() })
export const getBlocksByCard = (cardId) => blogApi.get(`blocks/?card=${cardId}`, { headers: getAuthHeaders() })