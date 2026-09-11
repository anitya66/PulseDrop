import { useState } from "react";
import { Link } from "react-router-dom";
import { registerUser } from "../services/authService";

function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "CUSTOMER",
  });

  const [error, setError] = useState("");

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

  if (
    !formData.name ||
    !formData.email ||
    !formData.password ||
    !formData.role
  ) {
    setError("Please complete all required fields.");
    return;
  }

  try {
    const result = await registerUser(formData);

    console.log("Registration successful:", result);
  } catch (error) {
    console.error("Registration failed:", error);

    setError(
      error.response?.data?.message ||
        "Registration failed. Please try again."
    );
  }
};

  const handleGoogleRegister = () => {
    console.log("Google registration clicked");
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
                One platform.
                <span className="block text-slate-400">
                  Every delivery.
                </span>
              </h2>

              <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
                Join PulseDrop and experience seamless delivery tracking
                from pickup to doorstep.
              </p>
            </div>

            <div className="space-y-3 text-sm text-slate-500">
              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-emerald-400" />
                Real-time tracking
              </div>

              <div className="flex items-center gap-3">
                <span className="h-2 w-2 rounded-full bg-sky-400" />
                Intelligent driver assignment
              </div>
            </div>
          </div>

          {/* Right - Register */}
          <div className="p-8 sm:p-10">
            <div className="mx-auto max-w-md">
              <div className="mb-8">
                <p className="mb-2 text-sm font-medium text-slate-400">
                  Get started
                </p>

                <h1 className="text-3xl font-semibold tracking-tight text-white">
                  Create your account
                </h1>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  Create your PulseDrop account in a few seconds.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Full name
                  </label>

                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                    className="w-full rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-white/30 focus:bg-white/[0.06]"
                  />
                </div>

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
                  <label
                    htmlFor="password"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

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

                {/* Role */}
                <div>
                  <label
                    htmlFor="role"
                    className="mb-2 block text-sm font-medium text-slate-300"
                  >
                    Account type
                  </label>

                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-white/30"
                  >
                    <option value="CUSTOMER">Customer</option>
                    <option value="DRIVER">Driver</option>
                  </select>
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
                  className="w-full rounded-xl bg-white px-4 py-3 text-sm font-semibold text-slate-950 transition hover:bg-slate-200 active:scale-[0.99]"
                >
                  Create account
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

              {/* Google */}
              <button
                type="button"
                onClick={handleGoogleRegister}
                className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3 text-sm font-medium text-white transition hover:border-white/20 hover:bg-white/[0.08] active:scale-[0.99]"
              >
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-xs font-bold text-slate-900">
                  G
                </span>

                Continue with Google
              </button>

              {/* Login */}
              <p className="mt-8 text-center text-sm text-slate-500">
                Already have an account?{" "}
                <Link
  to="/login"
  className="font-medium text-white transition hover:text-slate-300"
>
  Sign in
</Link>
              </p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Register;