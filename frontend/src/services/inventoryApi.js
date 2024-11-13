import api from './api';

export const fetchItems = () => api.get(`${process.env.REACT_APP_INVENTORY_API_URL}/items`);

export const updateItemQuantity = (id, quantity) =>
    api.post(`${process.env.REACT_APP_INVENTORY_API_URL}/items/${id}/update-quantity`, { quantity });