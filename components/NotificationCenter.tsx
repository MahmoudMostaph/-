import React from 'react';
import { Notification as NotificationType } from '../types';
import Notification from './Notification';

interface NotificationCenterProps {
    notifications: NotificationType[];
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ notifications }) => {
    return (
        <div className="fixed top-20 right-4 z-[100] w-full max-w-sm space-y-3">
            {notifications.map(notification => (
                <Notification key={notification.id} notification={notification} />
            ))}
        </div>
    );
};

export default NotificationCenter;
