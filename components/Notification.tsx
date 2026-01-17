import React, { useState, useEffect } from 'react';
import { Notification as NotificationType } from '../types';

interface NotificationProps {
  notification: NotificationType;
}

const Notification: React.FC<NotificationProps> = ({ notification }) => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Animate in
    setVisible(true);
  }, []);

  const baseStyle = "w-full flex items-center space-x-3 rtl:space-x-reverse rounded-lg shadow-lg p-4 transition-all duration-300 ease-in-out transform";
  const typeStyles = {
    success: 'bg-green-500/10 border border-green-400/30 text-white',
    info: 'bg-blue-500/10 border border-blue-400/30 text-white',
  };
  
  const visibilityStyle = visible 
    ? 'opacity-100 translate-x-0' 
    : 'opacity-0 translate-x-full rtl:-translate-x-full';


  return (
    <div className={`${baseStyle} ${typeStyles[notification.type]} ${visibilityStyle}`} role="alert">
      <div>
        {notification.icon}
      </div>
      <p className="font-semibold">{notification.message}</p>
    </div>
  );
};

export default Notification;
