import axios from "axios";

const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

export const login = (data) => baseApi.post('api-token-auth/', data)
export const getTopic = (topic_id) => baseApi.get(`base/topics/${topic_id}`, { headers: getAuthHeaders() })
export const getTopics = () => baseApi.get('base/topics/', { headers: getAuthHeaders() })
export const getTopicsByCategory = (categoryId) => baseApi.get(`base/topics/?tag=${categoryId}`, { headers: getAuthHeaders() })
export const getTopicsByTopicTag = (tagId) => baseApi.get(`base/topics/?tag=${tagId}`, { headers: getAuthHeaders() })
export const getTopicTags = () => baseApi.get('base/topictags/', { headers: getAuthHeaders() })
