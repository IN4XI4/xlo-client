import axios from "axios";

const avatarApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}avatar/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getMyAvatar = () => avatarApi.get(`avatars/my-avatar/`, { headers: getAuthHeaders() })
export const getMyItems = () => avatarApi.get(`user-items/grouped/`, { headers: getAuthHeaders() })
export const getMyColors = () => avatarApi.get(`user-items/colors/`, { headers: getAuthHeaders() })

export const updateAvatar = (avatarId, data) => avatarApi.put(`avatars/${avatarId}/`, data, { headers: getAuthHeaders() })
