import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../services/authService";
import { useAuth } from "../context/AuthContext";

function Login() {

    const { login } = useAuth();
    const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.email || !formData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      setError("");
      setIsLoading(true);

      const result = await loginUser({
        email: formData.email,
        password: formData.password,
      });

      const { token, user } = result.data;

      login(token, user);

if (user.role === "CUSTOMER") {
  navigate("/customer/dashboard");
} else if (user.role === "DRIVER") {
  navigate("/driver/dashboard");
}
    } catch (error) {
      console.error("Login failed:", error);

      setError(
        error.response?.data?.message ||
          "Login failed. Please check your credentials."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    console.log("Google login clicked");
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-950 px-6 py-12">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl items-center justify-center">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] shadow-2xl shadow-black/30 lg:grid-cols-2">

          {/* Left - Branding */}
          <div className="hidden flex-col justify-between bg-white/[0.03] p-10 lg:flex">
            <div>
              <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-2xl bg-white text-lg font-bold text-slate-950">
                P
              </div>

              <p className="mb-3 text-sm font-medium uppercase tracking-[0.2em] text-slate-400">
                PulseDrop
              </p>

              <h2 className="max-w-md text-4xl font-semibold leading-tight tracking-tight text-white">
                Track every delivery.
                <span className="block text-slate-400">
                  In real time.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                A real-time delivery platform connecting customers,
                drivers, and intelligent tracking.
              </p>
            </div>

            <div className="flex items-center gap-3 text-sm text-slate-500">
              <span className="h-2 w-2 rounded-full bg-emerald-400" />
              Real-time delivery intelligence
            </div>
          </div>

          {/* Right - Login */}
          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">

              {/* Heading */}
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-slate-400">
                  Welcome back
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Sign in to PulseDrop
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Enter your credentials to continue.
                </p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Email
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>

                {/* Password */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium text-slate-300"
                    >
                      Password
                    </label>

                    <button
                      type="button"
                      className="text-xs font-medium text-slate-400 transition hover:text-white"
                    >
                      Forgot password?
                    </button>
                  </div>

                  <input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>

                {/* Error */}
                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                    {error}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4">
                <div className="h-px flex-1 bg-white/10" />

                <span className="text-xs text-slate-500">
                  OR
                </span>

                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Google Login */}
              <button
                type="button"
                onClick={handleGoogleLogin}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.99]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
                  G
                </span>

                Continue with Google
              </button>

              {/* Register */}
              <p className="mt-8 text-center text-sm text-slate-500">
                Don't have an account?{" "}

                <Link
                  to="/register"
                  className="font-medium text-white transition hover:text-slate-300"
                >
                  Create account
                </Link>
              </p>

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Login;