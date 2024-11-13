import React, { useState } from 'react';
import { useNotifications } from '../contexts/NotificationContext';
import './NotificationBell.css';

function NotificationBell() {
    const { notifications } = useNotifications();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="notification-bell">
            <button className="bell-icon" onClick={() => setIsOpen(!isOpen)}>
                🔔
                {notifications.length > 0 && (
                    <span className="notification-count">{notifications.length}</span>
                )}
            </button>
            {isOpen && (
                <div className="notification-dropdown">
                    {notifications.length > 0 ? (
                        <ul>
                            {notifications.map((notification, index) => (
                                <li key={index}>{notification}</li>
                            ))}
                        </ul>
                    ) : (
                        <p>No notifications</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default NotificationBell;
