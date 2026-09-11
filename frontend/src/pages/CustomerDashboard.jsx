import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyOrders } from "../services/orderService";

function CustomerDashboard() {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadOrders = async () => {
      try {
        setIsLoading(true);
        setError("");

        const result = await getMyOrders();

        console.log("My orders:", result);

        setOrders(result.data || []);
      } catch (error) {
        console.error("Failed to load orders:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load your orders."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadOrders();
  }, []);

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
    return status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (letter) => letter.toUpperCase());
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-10">
      <div className="mx-auto max-w-7xl">

        {/* Header */}
        <div className="mb-10">
          <p className="mb-2 text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            Customer dashboard
          </p>

          <h1 className="text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your deliveries
          </h1>

          <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">
            Track your active deliveries and review your delivery history.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-3">

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-500">
              Total deliveries
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {orders.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-500">
              Active
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {
                orders.filter(
                  (order) =>
                    !["DELIVERED", "CANCELLED"].includes(order.status)
                ).length
              }
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
            <p className="text-sm text-slate-500">
              Delivered
            </p>

            <p className="mt-2 text-3xl font-semibold text-white">
              {
                orders.filter(
                  (order) => order.status === "DELIVERED"
                ).length
              }
            </p>
          </div>

        </div>

        {/* Orders */}
        <div>
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Recent deliveries
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Your latest delivery requests
              </p>
            </div>
          </div>

          {/* Loading */}
          {isLoading && (
            <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-8 text-center">
              <p className="text-sm text-slate-400">
                Loading your deliveries...
              </p>
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="rounded-2xl border border-red-400/20 bg-red-400/10 p-6">
              <p className="text-sm text-red-300">
                {error}
              </p>
            </div>
          )}

          {/* Empty state */}
          {!isLoading && !error && orders.length === 0 && (
            <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-12 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04] text-lg">
                +
              </div>

              <h3 className="mt-4 text-lg font-semibold text-white">
                No deliveries yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Create your first delivery request to start tracking it
                through PulseDrop.
              </p>
            </div>
          )}

          {/* Order list */}
          {!isLoading && !error && orders.length > 0 && (
            <div className="space-y-3">
              {orders.map((order) => (
                <Link
                  key={order.id}
                  to={`/orders/${order.id}`}
                  className="group block rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-white/20 hover:bg-white/[0.06]"
                >
                  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">

                    <div className="min-w-0 flex-1">

                      <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-white">
                          Order #{order.id}
                        </span>

                        <span
                          className={`rounded-full border px-2.5 py-1 text-xs font-medium ${getStatusClasses(
                            order.status
                          )}`}
                        >
                          {formatStatus(order.status)}
                        </span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">

                        <div>
                          <p className="mb-1 text-xs uppercase tracking-wider text-slate-600">
                            Pickup
                          </p>

                          <p className="truncate text-sm text-slate-300">
                            {order.pickupAddress}
                          </p>
                        </div>

                        <div>
                          <p className="mb-1 text-xs uppercase tracking-wider text-slate-600">
                            Drop
                          </p>

                          <p className="truncate text-sm text-slate-300">
                            {order.dropAddress}
                          </p>
                        </div>

                      </div>

                    </div>

                    <div className="flex items-center justify-between gap-6 border-t border-white/10 pt-4 lg:border-l lg:border-t-0 lg:pl-6 lg:pt-0">

                      <div>
                        <p className="text-xs text-slate-600">
                          Created
                        </p>

                        <p className="mt-1 text-sm text-slate-400">
                          {formatDate(order.createdAt)}
                        </p>
                      </div>

                      <span className="text-sm font-medium text-slate-400 transition group-hover:text-white">
                        View →
                      </span>

                    </div>

                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default CustomerDashboard;