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
export const getMySpaces = () => usersApi.get(`spaces/my-spaces/`, { headers: getAuthHeaders() })
export const updateSpace = (spaceId, data) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    return usersApi.patch(`space/${spaceId}/`, data, { headers });
};

// Invitations
export const getSpaceInvitations = () => usersApi.get(`space-invitations/my-invitations/`, { headers: getAuthHeaders() })
export const acceptInvitation = (invitationId) => usersApi.post(`space-invitations/${invitationId}/accept/`, {}, { headers: getAuthHeaders() })
export const rejectInvitation = (invitationId) => usersApi.post(`space-invitations/${invitationId}/reject/`, {}, { headers: getAuthHeaders() })
