import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getOrderById,
  getOrderHistory,
  updateOrderStatus,
} from "../services/orderService";

function OrderDetails() {
  const { orderId } = useParams();

  const [order, setOrder] = useState(null);
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [error, setError] = useState("");
  const [actionMessage, setActionMessage] = useState("");

  const loadOrder = async () => {
    try {
      setIsLoading(true);
      setError("");

      const [orderResult, historyResult] = await Promise.all([
        getOrderById(orderId),
        getOrderHistory(orderId),
      ]);

      console.log("Order details:", orderResult);
      console.log("Order history:", historyResult);

      setOrder(orderResult.data);
      setHistory(historyResult.data || []);
    } catch (error) {
      console.error("Failed to load order:", error);

      setError(
        error.response?.data?.message ||
          "Failed to load order details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOrder();
  }, [orderId]);

  const handleCancelOrder = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to cancel this delivery?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setIsCancelling(true);
      setError("");
      setActionMessage("");

      const result = await updateOrderStatus(orderId, "CANCELLED");

      console.log("Order cancelled:", result);

      setActionMessage("Delivery cancelled successfully.");

      // Refresh order details and timeline
      const [orderResult, historyResult] = await Promise.all([
        getOrderById(orderId),
        getOrderHistory(orderId),
      ]);

      setOrder(orderResult.data);
      setHistory(historyResult.data || []);
    } catch (error) {
      console.error("Failed to cancel order:", error);

      setError(
        error.response?.data?.message ||
          "Failed to cancel the delivery."
      );
    } finally {
      setIsCancelling(false);
    }
  };

  const getStatusClasses = (status) => {
    switch (status) {
      case "PENDING":
        return "border-amber-400/20 bg-amber-400/10 text-amber-300";

      case "DRIVER_ASSIGNED":
        return "border-blue-400/20 bg-blue-400/10 text-blue-300";

      case "PICKED_UP":
        return "border-violet-400/20 bg-violet-400/10 text-violet-300";

      case "IN_TRANSIT":
        return "border-cyan-400/20 bg-cyan-400/10 text-cyan-300";

      case "DELIVERED":
        return "border-emerald-400/20 bg-emerald-400/10 text-emerald-300";

      case "CANCELLED":
        return "border-red-400/20 bg-red-400/10 text-red-300";

      default:
        return "border-white/10 bg-white/[0.04] text-slate-300";
    }
  };

  const formatStatus = (status) => {
    if (!status) {
      return "";
    }

    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    if (!date) {
      return "—";
    }

    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-10 text-center">
            <p className="text-sm text-slate-400">
              Loading order details...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-10">
        <div className="mx-auto max-w-5xl">
          <Link
            to="/customer/dashboard"
            className="text-sm text-slate-400 transition hover:text-white"
          >
            ← Back to deliveries
          </Link>

          <div className="mt-6 rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
            <p className="text-sm text-red-300">
              {error}
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-5xl">

        {/* Back */}
        <Link
          to="/customer/dashboard"
          className="text-sm text-slate-400 transition hover:text-white"
        >
          ← Back to deliveries
        </Link>

        {/* Header */}
        <div className="mt-8 flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.16em] text-slate-500">
              Delivery
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              Order #{order.id}
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              Created {formatDate(order.createdAt)}
            </p>
          </div>

          <span
            className={`w-fit rounded-full border px-3 py-1.5 text-xs font-medium ${getStatusClasses(
              order.status
            )}`}
          >
            {formatStatus(order.status)}
          </span>
        </div>

        {/* Action messages */}
        {actionMessage && (
          <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/10 px-5 py-4">
            <p className="text-sm text-emerald-300">
              {actionMessage}
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

        {/* Route */}
        <div className="mt-8 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="grid gap-8">

            {/* Pickup */}
            <div className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-white">
                  A
                </div>

                <div className="mt-2 h-full w-px bg-white/10" />
              </div>

              <div className="pb-4">
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Pickup
                </p>

                <p className="mt-2 text-base font-medium text-white">
                  {order.pickupAddress}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {order.pickupLatitude}, {order.pickupLongitude}
                </p>
              </div>
            </div>

            {/* Drop */}
            <div className="flex gap-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-xs font-semibold text-white">
                B
              </div>

              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
                  Drop
                </p>

                <p className="mt-2 text-base font-medium text-white">
                  {order.dropAddress}
                </p>

                <p className="mt-2 text-xs text-slate-500">
                  {order.dropLatitude}, {order.dropLongitude}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* Driver */}
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">
            Driver
          </p>

          <div className="mt-3 flex items-center justify-between">
            <div>
              <p className="text-base font-medium text-white">
                {order.driverId
                  ? `Driver #${order.driverId}`
                  : "Waiting for driver assignment"}
              </p>

              <p className="mt-1 text-sm text-slate-500">
                {order.driverId
                  ? "Assigned to this delivery"
                  : "A nearby driver will be assigned"}
              </p>
            </div>

            <div
              className={`h-2.5 w-2.5 rounded-full ${
                order.driverId
                  ? "bg-emerald-400"
                  : "bg-amber-400"
              }`}
            />
          </div>
        </div>

        {/* Cancel Delivery */}
        {order.status === "PENDING" && (
          <div className="mt-4 rounded-2xl border border-red-400/10 bg-red-400/[0.03] p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">
                  Need to cancel this delivery?
                </p>

                <p className="mt-1 text-sm text-slate-500">
                  You can cancel while a driver has not yet been assigned.
                </p>
              </div>

              <button
                type="button"
                onClick={handleCancelOrder}
                disabled={isCancelling}
                className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-2.5 text-sm font-medium text-red-300 transition hover:bg-red-400/20 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isCancelling
                  ? "Cancelling..."
                  : "Cancel Delivery"}
              </button>
            </div>
          </div>
        )}

        {/* Order Timeline */}
        <section className="mt-4 rounded-3xl border border-white/10 bg-white/[0.04] p-6 sm:p-8">
          <div className="mb-7">
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
              Order Activity
            </p>

            <h2 className="mt-2 text-xl font-semibold text-white">
              Delivery Timeline
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Track how your order has progressed.
            </p>
          </div>

          {history.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
              <p className="text-sm text-slate-400">
                No order activity available yet.
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              {history.map((item, index) => (
                <div
                  key={item.id}
                  className="relative flex gap-4"
                >
                  {/* Timeline line */}
                  {index < history.length - 1 && (
                    <div className="absolute left-[7px] top-4 h-full w-px bg-white/10" />
                  )}

                  {/* Timeline dot */}
                  <div className="relative z-10 mt-1 h-4 w-4 shrink-0 rounded-full border-4 border-slate-950 bg-white" />

                  {/* Timeline content */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-medium ${getStatusClasses(
                          item.status
                        )}`}
                      >
                        {formatStatus(item.status)}
                      </span>

                      <p className="text-xs text-slate-500">
                        {formatDate(item.changedAt)}
                      </p>
                    </div>

                    <p className="mt-3 text-sm text-slate-400">
                      Order status changed to{" "}
                      <span className="font-medium text-slate-300">
                        {formatStatus(item.status)}
                      </span>
                      .
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}

export default OrderDetails;