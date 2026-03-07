import React, { useState, useEffect } from "react";
import privateApi from "../api/axiosPrivate";
import { Link } from "react-router-dom";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const res = await privateApi.get("/api/notifications/");
      setNotifications(res.data);
    } catch (error) {
      console.error("Error fetching notifications", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markAsRead = async (id) => {
    try {
      await privateApi.post(`/api/notifications/${id}/read/`);
      // Update local state to reflect read status
      setNotifications(notifications.map(n =>
        n.id === id ? { ...n, is_read: true } : n
      ));
    } catch (error) {
      console.error("Error marking as read", error);
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case "approval": return <i className="bi bi-check-circle-fill text-success fs-4"></i>;
      case "rejection": return <i className="bi bi-x-circle-fill text-danger fs-4"></i>;
      case "deletion": return <i className="bi bi-trash-fill text-danger fs-4"></i>;
      default: return <i className="bi bi-info-circle-fill text-primary fs-4"></i>;
    }
  };

  return (
    <div className="container mt-5 pt-5" style={{ maxWidth: "800px" }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>🔔 Notifications</h2>
        <Link to="/" className="btn btn-outline-secondary btn-sm">Back to Home</Link>
      </div>

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
      ) : (
        <div className="list-group shadow-sm">
          {notifications.length === 0 ? (
            <div className="list-group-item text-center py-5 text-muted">
              <i className="bi bi-bell-slash fs-1 d-block mb-3"></i>
              No notifications yet.
            </div>
          ) : (
            notifications.map((notif) => (
              <div
                key={notif.id}
                className={`list-group-item list-group-item-action p-4 d-flex gap-3 align-items-start ${!notif.is_read ? 'bg-light border-start border-5 border-primary' : ''}`}
                onClick={() => !notif.is_read && markAsRead(notif.id)}
                style={{ cursor: "pointer", transition: "background 0.2s" }}
              >
                <div className="mt-1">
                  {getIcon(notif.type)}
                </div>
                <div className="flex-grow-1">
                  <div className="d-flex w-100 justify-content-between align-items-center mb-1">
                    <h5 className="mb-0 ${!notif.is_read ? 'fw-bold text-primary' : 'text-dark'}">
                      {notif.title}
                    </h5>
                    <small className="text-muted">
                      {new Date(notif.created_at).toLocaleDateString()}
                    </small>
                  </div>
                  <p className="mb-1 text-secondary">{notif.message}</p>
                  {!notif.is_read && (
                    <small className="text-primary fw-bold">Tap to mark as read</small>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      )
      }
    </div >
  );
};

export default Notifications;
