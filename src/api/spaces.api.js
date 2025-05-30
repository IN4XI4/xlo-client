import axios from "axios";

const spacesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}spaces/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getSpaces = (page, page_size = 20, searchText = '') => {
  let url = `spaces/?page=${page}&page_size=${page_size}`;
  if (searchText) {
    url += `&name__icontains=${encodeURIComponent(searchText)}`;
  }
  return spacesApi.get(url, { headers: getAuthHeaders() });
};

export const getSpace = (spaceId) => spacesApi.get(`spaces/${spaceId}`, { headers: getAuthHeaders() })
export const getActiveSpace = (spaceId) => spacesApi.get(`spaces/${spaceId}/active-space/`, { headers: getAuthHeaders() })
export const getSpaceBySlug = (spaceSlug) => spacesApi.get(`spaces/find-by-slug/${spaceSlug}/`, { headers: getAuthHeaders() })
export const getMySpaces = () => spacesApi.get(`spaces/my-spaces/`, { headers: getAuthHeaders() })
export const updateSpace = (spaceId, data) => {
  const headers = getAuthHeaders();
  delete headers['Content-Type'];
  return spacesApi.patch(`spaces/${spaceId}/`, data, { headers });
};

// Invitations
export const getSpaceInvitations = () => spacesApi.get(`space-invitations/my-invitations/`, { headers: getAuthHeaders() })
export const acceptInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/reject/`, {}, { headers: getAuthHeaders() })

// Requests
export const requestJoinSpace = (data) => spacesApi.post(`space-requests/`, data, { headers: getAuthHeaders() })



// Create
export const createSpace = (data) => spacesApi.post(`spaces/`, data, { headers: getAuthHeaders() })