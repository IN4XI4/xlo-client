import axios from "axios";

const usersApi = axios.create({
    baseURL: `${import.meta.env.VITE_API_BASE_URL}users/`
})

const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Token ${token}` } : {};
};

export const getUser = () => usersApi.get(`users/me/`, { headers: getAuthHeaders() })
export const getUserProfile = () => usersApi.get(`users/profile/`, { headers: getAuthHeaders() })
export const getUserModal = (userId) => usersApi.get(`users/${userId}/`, { headers: getAuthHeaders() })
export const getUserProfileColors = () => usersApi.get(`profile_colors/`, { headers: getAuthHeaders() })
export const getUserExperience = () => usersApi.get(`experience/`, { headers: getAuthHeaders() })
export const getUserGenders = () => usersApi.get(`genders/`, { headers: getAuthHeaders() })
export const getCountries = () => usersApi.get(`countries/`, { headers: getAuthHeaders() })
export const registerUser = (data) => usersApi.post('users/', data)

export const updatePassword = (data) => usersApi.put(`users/update_password/`, data, { headers: getAuthHeaders() })
export const updateUser = (userId, data) => {
    const headers = getAuthHeaders();
    delete headers['Content-Type'];
    return usersApi.patch(`users/${userId}/`, data, { headers });
  };
export const lostPassword = (data) => usersApi.post('users/send_reset_code/', data)
export const resetPassword = (data) => usersApi.post('users/reset_password/', data)