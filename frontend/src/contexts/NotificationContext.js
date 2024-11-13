import React, { createContext, useContext, useState } from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const NotificationContext = createContext();

export const useNotifications = () => {
    return useContext(NotificationContext);
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = (notification) => {
        setNotifications((prevNotifications) => [...prevNotifications, notification]);

        // Automatically remove the notification after 5 seconds
        setTimeout(() => {
            setNotifications((prevNotifications) => prevNotifications.filter(notif => notif.id !== notification.id));
        }, 5000);
    };

    const removeNotification = (id) => {
        setNotifications((prevNotifications) => prevNotifications.filter(notif => notif.id !== id));
    };

    return (
        <NotificationContext.Provider value={{ addNotification, notifications }}>
            {children}
            <ToastContainer position="top-end" className="p-3">
                {notifications.map((notification) => (
                    <Toast key={notification.id} onClose={() => removeNotification(notification.id)} delay={5000} autohide>
                        <Toast.Header>
                            <strong className="me-auto">Notification</strong>
                        </Toast.Header>
                        <Toast.Body>{notification.message}</Toast.Body>
                    </Toast>
                ))}
            </ToastContainer>
        </NotificationContext.Provider>
    );
};