import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import {
  connectToNotifications,
  disconnectNotifications,
} from "../services/notificationService";

import { useAuth } from "../context/AuthContext";

function Layout() {
  const [notification, setNotification] = useState(null);
  const [notificationCount, setNotificationCount] = useState(0);

  const { logout } = useAuth();

  useEffect(() => {
    connectToNotifications((newNotification) => {
      setNotification(newNotification);
      setNotificationCount((count) => count + 1);
    });

    return () => {
      disconnectNotifications();
    };
  }, []);

  const handleLogout = () => {
    logout();
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
              P
            </div>

            <span className="text-lg font-semibold tracking-tight">
              PulseDrop
            </span>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-6">
            {/* Notification */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setNotificationCount(0)}
                className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
                title="Notifications"
              >
                🔔

                {notificationCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white">
                    {notificationCount > 9
                      ? "9+"
                      : notificationCount}
                  </span>
                )}
              </button>
            </div>

            {/* Existing text */}
            <div className="text-sm text-slate-400">
              Delivery Intelligence
            </div>

            {/* Logout */}
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-medium text-slate-300 transition hover:bg-white/[0.08] hover:text-white"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Latest notification */}
      {notification && (
        <div className="fixed right-6 top-20 z-50 w-80 rounded-2xl border border-white/10 bg-slate-900 p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/[0.08]">
              🔔
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-white">
                Notification
              </p>

              <p className="mt-1 text-sm leading-5 text-slate-400">
                {notification.message ||
                  "You have a new notification."}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setNotification(null)}
              className="text-slate-500 transition hover:text-white"
            >
              ×
            </button>
          </div>
        </div>
      )}

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;