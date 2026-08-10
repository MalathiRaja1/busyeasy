import { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { getNotifications, markNotificationRead, markAllNotificationsRead } from '../services/api';

function NotificationBell() {
  const { token } = useSelector(state => state.auth);
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const loadNotifications = () => {
    if (token) {
      getNotifications().then(res => setNotifications(res.data)).catch(() => {});
    }
  };

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [token]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleBellClick = () => {
    setOpen(!open);
  };

  const handleMarkAllRead = async () => {
    await markAllNotificationsRead();
    loadNotifications();
  };

  const handleNotificationClick = async (id) => {
    await markNotificationRead(id);
    loadNotifications();
  };

  if (!token) return null;

  return (
    <div className="notification-bell" ref={dropdownRef}>
      <button className="bell-btn" onClick={handleBellClick}>
        🔔
        {unreadCount > 0 && <span className="bell-badge">{unreadCount}</span>}
      </button>

      {open && (
        <div className="notification-dropdown">
          <div className="notification-header">
            <span>Notifications</span>
            {unreadCount > 0 && (
              <button className="mark-all-btn" onClick={handleMarkAllRead}>Mark all read</button>
            )}
          </div>
          {notifications.length === 0 ? (
            <p className="no-notifications">No notifications yet</p>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                className={`notification-item ${!n.isRead ? 'unread' : ''}`}
                onClick={() => handleNotificationClick(n.id)}
              >
                <p>{n.message}</p>
                <span className="notification-time">{new Date(n.createdAt).toLocaleString()}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default NotificationBell;