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
export const getTopicBySlug = (slug) => baseApi.get(`base/topics/find-by-slug/${slug}/`, { headers: getAuthHeaders() })
export const getTopics = () => baseApi.get('base/topics/', { headers: getAuthHeaders() })
export const getTopicsByCategory = (categoryId) => baseApi.get(`base/topics/?tag=${categoryId}`, { headers: getAuthHeaders() })
export const getTopicsByTopicTag = (tagId) => baseApi.get(`base/topics/?tag=${tagId}`, { headers: getAuthHeaders() })
export const getTopicTags = () => baseApi.get('base/topictags/', { headers: getAuthHeaders() })

export const getContentTypes = () => baseApi.get('base/contenttypes/', { headers: getAuthHeaders() })

export const getSoftSkill = (id) => baseApi.get(`base/softskills/${id}/`, { headers: getAuthHeaders() })
export const getSoftSkills = () => baseApi.get('base/softskills/', { headers: getAuthHeaders() })
export const listSoftSkillsDetailed = () => baseApi.get('base/softskills/detailed_list/', { headers: getAuthHeaders() })

export const getMentor = (id) => baseApi.get(`base/mentors/${id}/`, { headers: getAuthHeaders() })
export const getMentors = () => baseApi.get('base/mentors/', { headers: getAuthHeaders() })
export const createMentor = (data) => baseApi.post(`base/mentors/`, data, { headers: getAuthHeaders() })
