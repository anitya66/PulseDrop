import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <header className="border-b border-white/10 bg-slate-950/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-sm font-bold text-slate-950">
              P
            </div>

            <span className="text-lg font-semibold tracking-tight">
              PulseDrop
            </span>
          </div>

          <div className="text-sm text-slate-400">
            Delivery Intelligence
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>
    </div>
  );
}

export default Layout;