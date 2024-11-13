import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import {getToken} from "./services/auth";

// Disable Pusher logging in production
window.Pusher.logToConsole = process.env.NODE_ENV === 'development';

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'bd4abbf698ce0cde1ccc',
    cluster: 'ap2',
    forceTLS: true,
    encrypted: true,
    authEndpoint: '/broadcasting/auth',
    auth: {
        headers: {
            Authorization: `Bearer ${getToken()}`,
        },
    },
});

export default echo;