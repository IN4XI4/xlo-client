import axios from "axios";

const walletApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}wallet/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getCoinPackages = () => walletApi.get('packages/', { headers: getAuthHeaders() });

export const createCheckoutSession = (package_id, data) =>
  walletApi.post(`checkout/${package_id}/`, data, { headers: getAuthHeaders() });

export const getCoinLedgerHistory = (page = 1) =>
  walletApi.get('history/', { params: { page }, headers: getAuthHeaders() });
