import { useEffect, useState, useRef } from "react";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { fetchNotifications, markNotificationAsRead } from "../lib/api";
import { AlertTriangle, Bell, CheckCircle, Info } from "lucide-react";

interface Notification {
  id: string;
  type: "WARNING" | "INFO " | "SUCCESS";
  message: string;
  read: boolean;
  createAt: string;
}

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadNotifications();

    // Handle clicks outside the notification center
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function loadNotifications() {
    try {
      setLoading(true);
      const data = (await fetchNotifications()) as Notification[];
      setNotifications(data);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  }

  async function handleMarkAsRead(id: string) {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch {
      toast.error("Failed to mark notification as read");
    }
  }

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "WARNING":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      case "SUCCESS":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const displayedNotifications = showAll
    ? notifications
    : notifications.filter((notif) => !notif.read);

  return (
    <div className="relative" ref={containerRef}>
      <button
        className="relative p-2 text-gray-600 hover:text-gray-900"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Bell className="h-6 w-6" />
        {notifications.some((n) => !n.read) && (
          <span className="absolute top-0 right-0 block h-2 w-2 rounded-full bg-red-500" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Notifications
              </h3>
              <button
                onClick={() => setShowAll(!showAll)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                {showAll ? "Show Unread" : "Show All"}
              </button>
            </div>
          </div>

          {loading ? (
            <div className="p-4 text-center text-gray-500">
              Loading notifications...
            </div>
          ) : displayedNotifications.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No notifications
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {displayedNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-200 hover:bg-gray-50 ${
                    notification.read ? "bg-gray-50" : "bg-white"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-900">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {format(
                          new Date(notification.createAt),
                          "MMM d, yyyy h:mm a"
                        )}
                      </p>
                    </div>
                    {!notification.read && (
                      <button
                        onClick={() => handleMarkAsRead(notification.id)}
                        className="text-xs text-indigo-600 hover:text-indigo-800"
                      >
                        Mark as read
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
