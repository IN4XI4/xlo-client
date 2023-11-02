import axios from "axios";

const usersApi = axios.create({
    baseURL: 'http://localhost:8000/users/'
})

export const registerUser = (data) => usersApi.post('users/', data)
export const lostPassword = (data) => usersApi.post('users/send_reset_code/', data)
export const resetPassword = (data) => usersApi.post('users/reset_password/', data)