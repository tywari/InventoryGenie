import Pusher from 'pusher-js';

export const pusher = new Pusher(process.env.REACT_APP_PUSHER_APP_KEY, {
    cluster: process.env.REACT_APP_PUSHER_APP_CLUSTER,
    authEndpoint: `${process.env.REACT_APP_INVENTORY_API_URL}/broadcasting/auth`,
    auth: {
        headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`
        }
    }
});