import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getDriverOrders } from "../services/orderService";
import {
  updateDriverAvailability,
  getDriverAvailability,
} from "../services/driverService";
import { updateDriverLocation } from "../services/locationService";

function DriverDashboard() {
  const { user } = useAuth();

  const [isAvailable, setIsAvailable] = useState(false);
  const [isUpdatingAvailability, setIsUpdatingAvailability] = useState(false);

  const [location, setLocation] = useState(null);
  const [locationError, setLocationError] = useState("");

  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState("");

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Fetch driver's assigned orders
  const fetchDriverOrders = async () => {
    try {
      setIsLoadingOrders(true);
      setOrdersError("");

      const result = await getDriverOrders();

      setOrders(result.data || []);
    } catch (error) {
      console.error("Failed to fetch driver orders:", error);

      setOrdersError(
        error.response?.data?.message ||
          "Failed to load assigned deliveries."
      );
    } finally {
      setIsLoadingOrders(false);
    }
  };

  useEffect(() => {
  const loadAvailability = async () => {
    try {
      const availability = await getDriverAvailability(user.id);

      setIsAvailable(availability === "AVAILABLE");
    } catch (error) {
      console.error("Failed to load driver availability:", error);
    }
  };

  if (user?.id) {
    loadAvailability();
  }
}, [user?.id]);

  useEffect(() => {
  if (!isAvailable) {
    return;
  }

  if (!navigator.geolocation) {
    setLocationError("Geolocation is not supported by this browser.");
    return;
  }

  setLocationError("");

  const watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { latitude, longitude } = position.coords;

      setLocation({
        latitude,
        longitude,
      });

      console.log("Driver location:", {
        latitude,
        longitude,
      });

      updateDriverLocation(user.id, latitude, longitude)
        .then(() => {
          console.log("Driver location sent to backend successfully.");
        })
        .catch((error) => {
          console.error("Failed to send driver location:", error);
        });
    },
    (error) => {
      console.error("Failed to watch driver location:", error);

      setLocationError(
        "Unable to access your location. Please allow location permission."
      );
    },
    {
      enableHighAccuracy: true,
      maximumAge: 5000,
      timeout: 10000,
    }
  );

  return () => {
    navigator.geolocation.clearWatch(watchId);
    console.log("Driver location tracking stopped.");
  };
}, [isAvailable, user.id]);

  useEffect(() => {
    fetchDriverOrders();
  }, []);

  const handleAvailabilityToggle = async () => {
    const nextAvailability = isAvailable
      ? "OFFLINE"
      : "AVAILABLE";

    try {
      setIsUpdatingAvailability(true);
      setError("");
      setSuccessMessage("");

      const result = await updateDriverAvailability(
        user.id,
        nextAvailability
      );

      console.log("Availability updated:", result);

      setIsAvailable(nextAvailability === "AVAILABLE");

      setSuccessMessage(
        nextAvailability === "AVAILABLE"
          ? "You are now available for deliveries."
          : "You are now offline."
      );
    } catch (error) {
      console.error(
        "Failed to update driver availability:",
        error
      );

      setError(
        error.response?.data?.message ||
          "Failed to update availability."
      );
    } finally {
      setIsUpdatingAvailability(false);
    }
  };

  const assignedCount = orders.filter(
    (order) =>
      order.status !== "DELIVERED" &&
      order.status !== "CANCELLED"
  ).length;

  const activeCount = orders.filter(
    (order) =>
      order.status === "PICKED_UP" ||
      order.status === "IN_TRANSIT"
  ).length;

  const completedCount = orders.filter(
    (order) => order.status === "DELIVERED"
  ).length;

  const getStatusLabel = (status) => {
    switch (status) {
      case "DRIVER_ASSIGNED":
        return "Assigned";
      case "PICKED_UP":
        return "Picked Up";
      case "IN_TRANSIT":
        return "In Transit";
      case "DELIVERED":
        return "Delivered";
      case "CANCELLED":
        return "Cancelled";
      case "PENDING":
        return "Pending";
      default:
        return status;
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "DRIVER_ASSIGNED":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";

      case "PICKED_UP":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";

      case "IN_TRANSIT":
        return "border-violet-400/20 bg-violet-400/10 text-violet-300";

      case "DELIVERED":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "CANCELLED":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      default:
        return "border-white/10 bg-white/[0.04] text-slate-400";
    }
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-8 sm:py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
              Driver workspace
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Driver Dashboard
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your availability, deliveries, and active assignments
              from one place.
            </p>
          </div>

          {/* Availability */}
          <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Availability
              </p>

              <p
                className={`mt-1 text-sm font-medium ${
                  isAvailable
                    ? "text-emerald-300"
                    : "text-slate-300"
                }`}
              >
                {isAvailable ? "Available" : "Offline"}
              </p>
            </div>

            <button
              type="button"
              onClick={handleAvailabilityToggle}
              disabled={isUpdatingAvailability}
              className={`relative h-7 w-12 rounded-full transition ${
                isAvailable
                  ? "bg-emerald-400/80"
                  : "bg-white/10"
              } ${
                isUpdatingAvailability
                  ? "cursor-not-allowed opacity-50"
                  : ""
              }`}
              aria-label="Toggle driver availability"
            >
              <span
                className={`absolute top-1 h-5 w-5 rounded-full bg-white shadow transition ${
                  isAvailable ? "left-6" : "left-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Messages */}
        {successMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
            <p className="text-sm text-emerald-300">
              {successMessage}
            </p>
          </div>
        )}

        {error && (
          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        )}

        {/* Stats */}
        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {/* Assigned */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Assigned
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {isLoadingOrders ? "—" : assignedCount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Current deliveries
            </p>
          </div>

          {/* Active */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Active
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {isLoadingOrders ? "—" : activeCount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Deliveries in progress
            </p>
          </div>

          {/* Completed */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Completed
            </p>

            <p className="mt-3 text-3xl font-semibold text-white">
              {isLoadingOrders ? "—" : completedCount}
            </p>

            <p className="mt-2 text-sm text-slate-500">
              Delivered successfully
            </p>
          </div>

          {/* Status */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
              Driver Status
            </p>

            <div className="mt-4 flex items-center gap-2">
              <span
                className={`h-2.5 w-2.5 rounded-full ${
                  isAvailable
                    ? "bg-emerald-400"
                    : "bg-slate-500"
                }`}
              />

              <span className="text-sm font-medium text-white">
                {isAvailable
                  ? "Ready for delivery"
                  : "Currently offline"}
              </span>
            </div>

            <p className="mt-2 text-sm text-slate-500">
              Availability controls assignments
            </p>
          </div>
        </div>

        {/* Main content */}
        <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_320px]">

          {/* Deliveries */}
          <section className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
                  Delivery queue
                </p>

                <h2 className="mt-2 text-xl font-semibold text-white">
                  Assigned Deliveries
                </h2>
              </div>

              <span className="w-fit rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-slate-400">
                {isLoadingOrders ? "Loading..." : `${assignedCount} assignments`}
              </span>
            </div>

            {/* Loading state */}
            {isLoadingOrders && (
              <div className="mt-8 space-y-3">
                {[1, 2].map((item) => (
                  <div
                    key={item}
                    className="animate-pulse rounded-2xl border border-white/10 bg-white/[0.02] p-5"
                  >
                    <div className="h-4 w-32 rounded bg-white/10" />
                    <div className="mt-4 h-3 w-64 rounded bg-white/10" />
                    <div className="mt-3 h-3 w-52 rounded bg-white/10" />
                  </div>
                ))}
              </div>
            )}

            {/* Error state */}
            {!isLoadingOrders && ordersError && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
                <p className="text-sm text-red-300">
                  {ordersError}
                </p>

                <button
                  type="button"
                  onClick={fetchDriverOrders}
                  className="mt-4 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200"
                >
                  Try again
                </button>
              </div>
            )}

            {/* Empty state */}
            {!isLoadingOrders &&
              !ordersError &&
              orders.filter(
                (order) =>
                  order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED"
              ).length === 0 && (
                <div className="mt-8 flex min-h-64 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.05] text-lg font-semibold text-slate-300">
                    P
                  </div>

                  <h3 className="mt-4 text-base font-medium text-white">
                    No deliveries assigned
                  </h3>

                  <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
                    When a delivery is assigned to you, it will appear here
                    with its pickup, drop-off, and current status.
                  </p>

                  {!isAvailable && (
                    <button
                      type="button"
                      onClick={handleAvailabilityToggle}
                      disabled={isUpdatingAvailability}
                      className="mt-5 rounded-xl bg-white px-4 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isUpdatingAvailability
                        ? "Updating..."
                        : "Go available"}
                    </button>
                  )}
                </div>
              )}

            {/* Delivery cards */}
            {!isLoadingOrders &&
              !ordersError &&
              orders.filter(
                (order) =>
                  order.status !== "DELIVERED" &&
                  order.status !== "CANCELLED"
              ).length > 0 && (
                <div className="mt-8 space-y-4">
                  {orders
                    .filter(
                      (order) =>
                        order.status !== "DELIVERED" &&
                        order.status !== "CANCELLED"
                    )
                    .map((order) => (
                      <Link
                        key={order.id}
                        to={`/orders/${order.id}`}
                        className="block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition hover:border-white/20 hover:bg-white/[0.05]"
                      >
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">

                          <div>
                            <div className="flex items-center gap-3">
                              <p className="text-sm font-semibold text-white">
                                Delivery #{order.id}
                              </p>

                              <span
                                className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                                  order.status
                                )}`}
                              >
                                {getStatusLabel(order.status)}
                              </span>
                            </div>

                            <div className="mt-5 space-y-4">

                              {/* Pickup */}
                              <div className="flex gap-3">
                                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-emerald-400" />

                                <div>
                                  <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Pickup
                                  </p>

                                  <p className="mt-1 text-sm text-slate-300">
                                    {order.pickupAddress}
                                  </p>
                                </div>
                              </div>

                              {/* Drop */}
                              <div className="flex gap-3">
                                <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-red-400" />

                                <div>
                                  <p className="text-xs uppercase tracking-wider text-slate-500">
                                    Drop-off
                                  </p>

                                  <p className="mt-1 text-sm text-slate-300">
                                    {order.dropAddress}
                                  </p>
                                </div>
                              </div>

                            </div>
                          </div>

                          <div className="shrink-0 text-sm font-medium text-slate-500">
                            View →
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              )}
          </section>

          {/* Driver panel */}
          <aside className="rounded-3xl border border-white/10 bg-white/[0.04] p-6">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Driver profile
            </p>

            <div className="mt-6 flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950">
                {user?.name?.charAt(0)?.toUpperCase() || "D"}
              </div>

              <div>
                <p className="font-medium text-white">
                  {user?.name || "Driver"}
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  Delivery partner
                </p>
              </div>
            </div>

            <div className="mt-6 border-t border-white/10 pt-6">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-500">
                  Current status
                </span>

                <span
                  className={`rounded-full border px-3 py-1 text-xs font-medium ${
                    isAvailable
                      ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                      : "border-white/10 bg-white/[0.04] text-slate-400"
                  }`}
                >
                  {isAvailable ? "Available" : "Offline"}
                </span>
              </div>
            </div>

            <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
              <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                Next step
              </p>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Stay available to receive nearby delivery assignments.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export default DriverDashboard;