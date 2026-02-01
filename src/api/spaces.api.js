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
export const getSpaceMembers = (spaceSlug, search = '', page=1) => {
  return spacesApi.get(`spaces/${spaceSlug}/members/?search=${search}&page=${page}`, { headers: getAuthHeaders() })
}
export const getSpaceAdmins = (spaceSlug, search = '', page=1) => { 
  return spacesApi.get(`spaces/${spaceSlug}/admins/?search=${search}&page=${page}`, { headers: getAuthHeaders() })
 } 
export const getSpacePendingRequests = (spaceSlug, search = '', page = 1) => {
  return spacesApi.get(`spaces/${spaceSlug}/pending_requests/?search=${search}&page=${page}`, { headers: getAuthHeaders() })
}
export const makeAdmin = (spaceId, data) => spacesApi.post(`spaces/${spaceId}/make-admin/`, data, { headers: getAuthHeaders() })
export const makeMember = (spaceId, data) => spacesApi.post(`spaces/${spaceId}/make-member/`, data, { headers: getAuthHeaders() })
export const leaveSpace = (spaceId) => spacesApi.post(`spaces/${spaceId}/leave/`, {}, { headers: getAuthHeaders() })
export const removeUser = (spaceId, data) => spacesApi.post(`spaces/${spaceId}/remove-user/`, data, { headers: getAuthHeaders() })

// Invitations
export const getSpaceInvitations = () => spacesApi.get(`space-invitations/my-invitations/`, { headers: getAuthHeaders() })
export const acceptInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectInvitation = (invitationId) => spacesApi.post(`space-invitations/${invitationId}/reject/`, {}, { headers: getAuthHeaders() })
export const sendMultipleInvitations = (spaceId, data) => {
  return spacesApi.post(`spaces/${spaceId}/invite-multiple/`, data, { headers: getAuthHeaders() })
}
export const sendEmailInvitations = (spaceId, data) => {
  return spacesApi.post(`spaces/${spaceId}/invite-emails/`, data, { headers: getAuthHeaders() })
}



// Requests
export const requestJoinSpace = (data) => spacesApi.post(`space-requests/`, data, { headers: getAuthHeaders() })
export const acceptRequestJoinSpace = (requestId) => spacesApi.post(`space-requests/${requestId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectRequestJoinSpace = (requestId) => spacesApi.post(`space-requests/${requestId}/reject/`, {}, { headers: getAuthHeaders() })

// Delete
export const deleteSpace = (spaceId) => spacesApi.delete(`spaces/${spaceId}/`, { headers: getAuthHeaders() })

// Create
export const createSpace = (data) => spacesApi.post(`spaces/`, data, { headers: getAuthHeaders() })

export const listInviteUsers = (spaceId, page, page_size = 20, searchText = '') => {
  const params = { page, page_size };
  if (searchText) {
    params.search = searchText;
  }
  return spacesApi.get(`spaces/${spaceId}/users-to-invite/`, { headers: getAuthHeaders(), params });
};