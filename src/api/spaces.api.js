import axios from "axios";

const spacesApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}spaces/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getSpaces = (page, page_size = 20, searchText = '') => {
  const params = { page, page_size };
  if (searchText) {
    params.name__icontains = searchText;
  }
  return spacesApi.get('spaces/', {
    headers: getAuthHeaders(),
    params,
  });
};

export const getSpace = (spaceId) => spacesApi.get(`spaces/${spaceId}`, { headers: getAuthHeaders() })
export const getActiveSpace = (spaceId) => spacesApi.get(`spaces/${spaceId}/active-space/`, { headers: getAuthHeaders() })
export const getSpaceBySlug = (spaceSlug) => spacesApi.get(`spaces/find-by-slug/${spaceSlug}/`, { headers: getAuthHeaders() })
export const getMySpaces = (search) =>
  spacesApi.get(`spaces/my-spaces/`, {
    headers: getAuthHeaders(),
    params: search ? { search } : {},
  });
export const updateSpace = (spaceId, data) => {
  const headers = getAuthHeaders();
  delete headers['Content-Type'];
  return spacesApi.patch(`spaces/${spaceId}/`, data, { headers });
};

// Members
export const getSpaceMembers = (spaceSlug, search = '') => spacesApi.get(`spaces/${spaceSlug}/members/?search=${search}`, { headers: getAuthHeaders() })
export const getSpaceAdmins = (spaceSlug, search = '') => spacesApi.get(`spaces/${spaceSlug}/admins/?search=${search}`, { headers: getAuthHeaders() })
export const getSpacePendingRequests = (spaceSlug, search = '') => {
  return spacesApi.get(`spaces/${spaceSlug}/pending_requests/?search=${search}`, { headers: getAuthHeaders() })
}
export const makeAdmin = (spaceId, data) => spacesApi.post(`spaces/${spaceId}/make-admin/`, data, { headers: getAuthHeaders() })
export const makeMember = (spaceId, data) => spacesApi.post(`spaces/${spaceId}/make-member/`, data, { headers: getAuthHeaders() })

// Invitations
export const getSpaceInvitations = () => spacesApi.get(`space-invitations/my-invitations/`, { headers: getAuthHeaders() })
export const acceptInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/reject/`, {}, { headers: getAuthHeaders() })

// Requests
export const requestJoinSpace = (data) => spacesApi.post(`space-requests/`, data, { headers: getAuthHeaders() })
export const acceptRequestJoinSpace = (requestId) => spacesApi.post(`space-requests/${requestId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectRequestJoinSpace = (requestId) => spacesApi.post(`space-requests/${requestId}/reject/`, {}, { headers: getAuthHeaders() })



// Create
export const createSpace = (data) => spacesApi.post(`spaces/`, data, { headers: getAuthHeaders() })