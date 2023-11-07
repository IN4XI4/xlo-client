import axios from "axios";

const baseApi = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL
})

export const login = (data) => baseApi.post('api-token-auth/', data)
export const getTopics = () => baseApi.get('base/topics/')
