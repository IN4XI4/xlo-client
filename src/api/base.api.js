import axios from "axios";

const usersApi = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const login = (data) => usersApi.post('api-token-auth/', data)
