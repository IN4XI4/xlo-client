import axios from "axios";

const usersApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}spaces/`
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

export const getSpace = (spaceId) => usersApi.get(`spaces/${spaceId}`, { headers: getAuthHeaders() })
export const getActiveSpace = (spaceId) => usersApi.get(`spaces/${spaceId}/active-space/`, { headers: getAuthHeaders() })
export const getSpaceBySlug = (spaceSlug) => usersApi.get(`spaces/find-by-slug/${spaceSlug}/`, { headers: getAuthHeaders() })
export const updateSpace = (spaceId, data) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    return usersApi.patch(`space/${spaceId}/`, data, { headers });
  };