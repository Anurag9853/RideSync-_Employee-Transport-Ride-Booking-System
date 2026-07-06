import React, { useState } from 'react';
import { Bell, Check, Trash2, Calendar, UserCheck, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useToast } from '../hooks/useToast.js';

export default function NotificationsPage() {
  const { showToast } = useToast();
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Ride Confirmed & Driver Assigned',
      message: 'Your ride from Office A to Residential Area 1 has been assigned to Scarlett Johansson in a Tata Winger (KA-51-WW-4321).',
      time: '10 mins ago',
      type: 'assigned',
      read: false
    },
    {
      id: 2,
      title: 'Shuttle Arrived at Pickup Point',
      message: 'Toyota Innova (KA-03-MM-1234) has arrived at the Main Lobby Gate. Please board within 5 minutes.',
      time: '1 hour ago',
      type: 'arrived',
      read: false
    },
    {
      id: 3,
      title: 'Ride Scheduled Successfully',
      message: 'You have booked a seat for tomorrow morning commute (09:00 AM).',
      time: '4 hours ago',
      type: 'scheduled',
      read: true
    },
    {
      id: 4,
      title: 'System Maintenance Notice',
      message: 'The RideSync console will undergo database optimization tonight between 02:00 AM and 03:00 AM UTC.',
      time: '1 day ago',
      type: 'system',
      read: true
    },
    {
      id: 5,
      title: 'Ride Request Cancelled',
      message: 'The evening shuttle for route Sector 5 → Headquarters has been cancelled by the dispatcher due to route consolidation.',
      time: '2 days ago',
      type: 'cancelled',
      read: true
    }
  ]);

  function markAllRead() {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('All notifications marked as read', 'success');
  }

  function toggleRead(id) {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n))
    );
  }

  function deleteNotification(id) {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    showToast('Notification cleared', 'info');
  }

  function getNotificationIcon(type) {
    switch (type) {
      case 'assigned':
        return <UserCheck size={16} className="text-success" />;
      case 'arrived':
        return <CheckCircle size={16} style={{ color: 'var(--color-info)' }} />;
      case 'cancelled':
        return <AlertTriangle size={16} className="text-error" />;
      case 'scheduled':
        return <Calendar size={16} style={{ color: 'var(--color-warning)' }} />;
      default:
        return <Info size={16} className="text-muted" />;
    }
  }

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="notifications-page animate-slide-up">
      <div className="page-header">
        <div className="page-title-group">
          <h1 className="page-title">Notification Center</h1>
          <p className="page-subtitle">
            You have {unreadCount} unread alert{unreadCount === 1 ? '' : 's'}
          </p>
        </div>

        {unreadCount > 0 && (
          <button className="btn secondary" onClick={markAllRead}>
            <Check size={14} style={{ marginRight: '6px' }} />
            Mark all read
          </button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="card text-center text-muted" style={{ padding: '60px 20px' }}>
          <Bell size={32} style={{ marginBottom: '12px', opacity: 0.5 }} />
          <h3>No notifications yet</h3>
          <p style={{ fontSize: '0.8125rem', marginTop: '4px' }}>
            We'll notify you here about your upcoming rides, driver arrivals, and route updates.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {notifications.map((notif) => (
            <div
              key={notif.id}
              className={`card animate-fade ${!notif.read ? 'unread-glow' : ''}`}
              style={{
                padding: '16px 20px',
                display: 'flex',
                gap: '16px',
                alignItems: 'start',
                transition: 'all var(--transition-fast)',
                borderLeft: !notif.read ? '3px solid var(--primary)' : '1px solid var(--border-color)',
                backgroundColor: !notif.read ? 'var(--bg-card-hover)' : 'var(--bg-card)'
              }}
            >
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-md)',
                  backgroundColor: 'var(--bg-sidebar)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}
              >
                {getNotificationIcon(notif.type)}
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '12px' }}>
                  <h3
                    style={{
                      fontSize: '0.875rem',
                      fontWeight: notif.read ? 500 : 600,
                      color: 'var(--text-main)'
                    }}
                  >
                    {notif.title}
                  </h3>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                    {notif.time}
                  </span>
                </div>
                <p style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '4px', lineHeight: '1.4' }}>
                  {notif.message}
                </p>
              </div>

              <div style={{ display: 'flex', gap: '4px', alignSelf: 'center' }}>
                <button
                  className="icon-btn"
                  onClick={() => toggleRead(notif.id)}
                  title={notif.read ? 'Mark as unread' : 'Mark as read'}
                >
                  <Check size={14} className={notif.read ? 'text-muted' : 'text-success'} />
                </button>
                <button
                  className="icon-btn"
                  onClick={() => deleteNotification(notif.id)}
                  title="Clear notification"
                >
                  <Trash2 size={14} className="text-error" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
