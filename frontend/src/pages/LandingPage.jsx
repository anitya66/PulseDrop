import { useState } from "react";
import { Link } from "react-router-dom";

import Register from "./Register";

const LandingPage = () => {
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  const openRegisterModal = () => {
    setShowRegisterModal(true);
  };

  const closeRegisterModal = () => {
    setShowRegisterModal(false);
  };

  const scrollToHowItWorks = () => {
    document.getElementById("how-it-works")?.scrollIntoView({
      behavior: "smooth",
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ==================== NAVIGATION ==================== */}
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          {/* Logo */}
          <Link
            to="/"
            className="text-2xl font-bold tracking-tight"
          >
            Pulse<span className="text-blue-500">Drop</span>
          </Link>

          {/* Navigation Actions */}
          <div className="flex items-center gap-3">
            <Link
              to="/login"
              className="rounded-lg px-4 py-2 text-sm text-slate-300 transition hover:bg-white/10 hover:text-white"
            >
              Login
            </Link>

            <button
              type="button"
              onClick={openRegisterModal}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium transition hover:bg-blue-500"
            >
              Get Started
            </button>
          </div>
        </nav>
      </header>

      {/* ==================== MAIN ==================== */}
      <main>
        {/* ==================== HERO ==================== */}
        <section className="mx-auto flex min-h-[calc(100vh-81px)] max-w-7xl items-center px-6 py-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-sm font-semibold uppercase tracking-[0.25em] text-blue-400">
              Real-Time Delivery Tracking
            </p>

            <h1 className="text-5xl font-bold leading-tight tracking-tight sm:text-6xl">
              Deliveries.
              <br />

              <span className="text-blue-500">
                Tracked in Real Time.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-400">
              PulseDrop connects customers with delivery drivers and
              provides real-time order status and live driver tracking
              from pickup to delivery.
            </p>

            {/* Hero Actions */}
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                type="button"
                onClick={openRegisterModal}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.99]"
              >
                Get Started
              </button>

              <button
                type="button"
                onClick={scrollToHowItWorks}
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white active:scale-[0.99]"
              >
                See How It Works
              </button>
            </div>
          </div>
        </section>

        {/* ==================== HOW IT WORKS ==================== */}
        <section
          id="how-it-works"
          className="border-t border-white/10 px-6 py-28 sm:py-32"
        >
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                How It Works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                From pickup to delivery.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-400">
                PulseDrop keeps every step of your delivery journey
                connected and visible in real time.
              </p>
            </div>

            {/* Steps */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {/* Step 1 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-400">
                    01
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    📦
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  Place Your Order
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Enter your pickup and drop locations and create your
                  delivery request.
                </p>
              </div>

              {/* Step 2 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-400">
                    02
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    🚗
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  Driver Assigned
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  PulseDrop finds a nearby available driver and assigns
                  the delivery automatically.
                </p>
              </div>

              {/* Step 3 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-400">
                    03
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    📍
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  Live Tracking
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Follow the driver's live location and receive real-time
                  order status updates.
                </p>
              </div>

              {/* Step 4 */}
              <div className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-blue-400">
                    04
                  </span>

                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/10 text-lg">
                    ✓
                  </div>
                </div>

                <h3 className="mt-8 text-lg font-semibold">
                  Delivered
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Track the delivery through its final status until the
                  order reaches its destination.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== KEY FEATURES ==================== */}
        <section className="border-t border-white/10 px-6 py-28 sm:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Key Features
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built for real-time delivery.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-400">
                PulseDrop combines event-driven services, live location
                tracking, and secure APIs to keep deliveries moving.
              </p>
            </div>

            {/* Feature Grid */}
            <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {/* Feature 1 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📍
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Real-Time Tracking
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Customers can follow the driver's live location while
                  the delivery is in progress.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  Redis + WebSocket
                </p>
              </div>

              {/* Feature 2 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🚗
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Smart Driver Assignment
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Available drivers are discovered using location-aware
                  assignment logic.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  Redis GEO
                </p>
              </div>

              {/* Feature 3 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  ⚡
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Event-Driven Updates
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Services communicate asynchronously through domain
                  events instead of tightly coupling every operation.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  Apache Kafka
                </p>
              </div>

              {/* Feature 4 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🔔
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Real-Time Notifications
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Important delivery events are pushed to connected
                  customers without requiring page refreshes.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  WebSocket + STOMP
                </p>
              </div>

              {/* Feature 5 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  🔐
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Secure Authentication
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Users authenticate securely and access resources based
                  on their assigned role.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  Spring Security + JWT
                </p>
              </div>

              {/* Feature 6 */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7 transition hover:-translate-y-1 hover:border-blue-500/30 hover:bg-white/[0.05]">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-xl">
                  📦
                </div>

                <h3 className="mt-6 text-lg font-semibold">
                  Order Lifecycle
                </h3>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Orders move through a controlled lifecycle from
                  creation to final delivery.
                </p>

                <p className="mt-5 text-xs font-medium uppercase tracking-wider text-blue-400">
                  Spring Boot + MySQL
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== TECHNOLOGY STACK ==================== */}
        <section className="border-t border-white/10 px-6 py-28 sm:py-32">
          <div className="mx-auto max-w-7xl">
            {/* Section Heading */}
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
                Technology Stack
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
                Built with modern technologies.
              </h2>

              <p className="mt-4 text-base leading-7 text-slate-400">
                A distributed architecture designed for secure APIs,
                asynchronous communication, and real-time delivery
                tracking.
              </p>
            </div>

            {/* Technology Groups */}
            <div className="mt-16 grid gap-6 md:grid-cols-3">
              {/* Backend */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-lg font-semibold">
                  Backend
                </h3>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Java 21
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Spring Boot
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Spring Security
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    JWT
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    MySQL
                  </span>
                </div>
              </div>

              {/* Distributed Systems */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-lg font-semibold">
                  Distributed Systems
                </h3>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Microservices
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Apache Kafka
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Redis
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    WebSocket
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    STOMP
                  </span>
                </div>
              </div>

              {/* Frontend */}
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-7">
                <h3 className="text-lg font-semibold">
                  Frontend
                </h3>

                <div className="mt-6 flex flex-wrap gap-3">
                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    React
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Vite
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Tailwind CSS
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Axios
                  </span>

                  <span className="rounded-lg border border-white/10 bg-white/[0.04] px-3 py-2 text-sm text-slate-300">
                    Leaflet
                  </span>
                </div>
              </div>
            </div>

            {/* Architecture Highlight */}
            <div className="mt-10 rounded-2xl border border-blue-500/20 bg-blue-500/[0.05] p-8 text-center">
              <p className="text-sm leading-6 text-slate-300">
                PulseDrop combines{" "}
                <span className="font-semibold text-white">
                  REST APIs
                </span>
                ,{" "}
                <span className="font-semibold text-white">
                  Kafka events
                </span>
                ,{" "}
                <span className="font-semibold text-white">
                  Redis GEO
                </span>
                , and{" "}
                <span className="font-semibold text-white">
                  WebSocket communication
                </span>{" "}
                to deliver a real-time tracking experience.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== FINAL CTA ==================== */}
        <section className="border-t border-white/10 px-6 py-28 sm:py-32">
          <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/[0.03] px-6 py-16 text-center sm:px-10">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-400">
              Get Started
            </p>

            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to track your delivery in real time?
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-slate-400">
              Create your PulseDrop account and experience a connected
              delivery journey from pickup to doorstep.
            </p>

            {/* CTA Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <button
                type="button"
                onClick={openRegisterModal}
                className="rounded-xl bg-blue-600 px-6 py-3 font-semibold transition hover:bg-blue-500 active:scale-[0.99]"
              >
                Get Started
              </button>

              <Link
                to="/login"
                className="rounded-xl border border-white/10 px-6 py-3 font-semibold text-slate-300 transition hover:bg-white/5 hover:text-white"
              >
                Login
              </Link>
            </div>
          </div>
        </section>
      </main>

      {/* ==================== FOOTER ==================== */}
      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Link
              to="/"
              className="text-lg font-bold tracking-tight"
            >
              Pulse<span className="text-blue-500">Drop</span>
            </Link>

            <p className="mt-1 text-sm text-slate-500">
              Real-time delivery tracking platform.
            </p>
          </div>

          <div className="text-sm text-slate-600">
            © 2026 PulseDrop. Built with Java, Spring Boot & React.
          </div>
        </div>
      </footer>

      {/* ==================== REGISTER MODAL ==================== */}
      {showRegisterModal && (
        <Register
          isModal={true}
          onClose={closeRegisterModal}
        />
      )}
    </div>
  );
};

export default LandingPage;