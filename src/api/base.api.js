import axios from "axios";

const baseApi = axios.create({
    baseURL: 'http://localhost:8000/'
})

export const login = (data) => baseApi.post('api-token-auth/', data)
export const getTopics = () => baseApi.get('base/topics/')
