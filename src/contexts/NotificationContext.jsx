import { createContext, useContext, useState, useCallback } from 'react';
import NotificationContainer from '../components/common/NotificationContainer';

const NotificationContext = createContext();

export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotification must be used within NotificationProvider');
  }
  return context;
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = {
      id,
      show: true,
      autoHide: true,
      duration: 5000,
      ...notification,
    };

    setNotifications(prev => [...prev, newNotification]);
    return id;
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, show: false }
          : notification
      )
    );
    
    // Remove from state after transition completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  }, []);

  const showSuccess = useCallback((title, message) => {
    return addNotification({
      type: 'success',
      title,
      message,
    });
  }, [addNotification]);

  const showError = useCallback((title, message) => {
    return addNotification({
      type: 'error',
      title,
      message,
      duration: 7000, // Show errors a bit longer
    });
  }, [addNotification]);

  const showWarning = useCallback((title, message) => {
    return addNotification({
      type: 'warning',
      title,
      message,
    });
  }, [addNotification]);

  const showInfo = useCallback((title, message) => {
    return addNotification({
      type: 'info',
      title,
      message,
    });
  }, [addNotification]);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    clearAll,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationContainer 
        notifications={notifications} 
        onClose={removeNotification} 
      />
    </NotificationContext.Provider>
  );
}
