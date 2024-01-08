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
export const registerUser = (data) => usersApi.post('users/', data)
export const lostPassword = (data) => usersApi.post('users/send_reset_code/', data)
export const resetPassword = (data) => usersApi.post('users/reset_password/', data)