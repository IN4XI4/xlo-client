import axios from "axios";

const blogApi = axios.create({
    baseURL: 'http://localhost:8000/blog/'
})


export const getTopics = () => blogApi.get('topics/')
