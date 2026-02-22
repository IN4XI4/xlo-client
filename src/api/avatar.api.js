import axios from "axios";

const avatarApi = axios.create({
  baseURL: `${import.meta.env.VITE_API_BASE_URL}avatar/`
})

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Token ${token}` } : {};
};

export const getMyAvatar = () => avatarApi.get(`avatars/my-avatar/`, { headers: getAuthHeaders() })
export const getMyItems = () => avatarApi.get(`user-items/grouped/`, { headers: getAuthHeaders() })
export const getMyColors = () => avatarApi.get(`user-items/colors/`, { headers: getAuthHeaders() })
export const getColorCatalog = (page = 1, pageSize = 100) => {
  return avatarApi.get('color-catalog/', { headers: getAuthHeaders(), params: { page, page_size: pageSize } });
}
export const getSkinColorCatalog = (page = 1, pageSize = 100) => {
  return avatarApi.get('skin-color-catalog/', { headers: getAuthHeaders(), params: { page, page_size: pageSize } });
}
export const getItemCatalog = (itemType = null, avatarType = null, page = 1, pageSize = 20) => {
  const params = { page, page_size: pageSize };
  if (itemType) {
    params.item_type = itemType;
  }
  if (avatarType) {
    params.avatar_type = avatarType;
  }
  return avatarApi.get('item-catalog/', { headers: getAuthHeaders(), params });
}
export const getItemDefaults = (avatarType) => {
  return avatarApi.get('user-items/defaults/', {
    headers: getAuthHeaders(),
    params: { avatar_type: avatarType }
  });
}

export const updateAvatar = (avatarId, data) => avatarApi.put(`avatars/${avatarId}/`, data, { headers: getAuthHeaders() })

export const buyItem = (catalogItemId) => {
  return avatarApi.post(`user-items/buy-item/`, { catalog_item_id: catalogItemId }, { headers: getAuthHeaders() });
}
export const buyColor = (catalogItemId) => {
  return avatarApi.post(`user-colors/buy-color/`, { catalog_item_id: catalogItemId }, { headers: getAuthHeaders() });
}
export const buySkinColor = (catalogItemId) => {
  return avatarApi.post(`user-skin-colors/buy-color/`, { catalog_item_id: catalogItemId }, { headers: getAuthHeaders() });
}

