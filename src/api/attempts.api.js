import axios from "axios";

const attemptsApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}attempts/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};


export const startAttempt = (data) => attemptsApi.post('attempts/', data, { headers: getAuthHeaders() })
export const getAttempt = (attempt_id) => attemptsApi.get(`attempts/${attempt_id}`, { headers: getAuthHeaders() })
export const listUserAttempts = (user_id) => attemptsApi.get(`attempts/?user=${user_id}&ordering=-start_time`, { headers: getAuthHeaders() })
export const finalizeAttempt = (attempt_id, data) => {
    const endpoint = `attempts/${attempt_id}/finalize_attempt/`;
    const config = { 
        headers: getAuthHeaders() 
    };
    
    return attemptsApi.post(endpoint, data, config);
}
export const globalStats = () => attemptsApi.get('global_stats/')


export const getUsersByRankingCategory = (rankingType, category_id) => {
    const orderBy = rankingType === '0' ? '-total_points' : '-average_score';
    return attemptsApi.get(`userpoints/?ordering=${orderBy}&category=${category_id}`, { headers: getAuthHeaders() });
}
