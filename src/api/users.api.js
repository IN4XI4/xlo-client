import axios from "axios";

const usersApi = axios.create({
    baseURL: 'http://localhost:8000/users/'
})

export const registerUser = (data) => usersApi.post('users/', data)
