import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleRoute from "./components/RoleRoute";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CustomerDashboard from "./pages/CustomerDashboard";
import DriverDashboard from "./pages/DriverDashboard";
import OrderDetails from "./pages/OrderDetails";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<Layout />}>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Protected Routes */}
            <Route element={<ProtectedRoute />}>

              {/* Customer Routes */}
              <Route element={<RoleRoute allowedRoles={["CUSTOMER"]} />}>
                <Route
                  path="/customer/dashboard"
                  element={<CustomerDashboard />}
                />
              </Route>

              {/* Driver Routes */}
              <Route element={<RoleRoute allowedRoles={["DRIVER"]} />}>
                <Route
                  path="/driver/dashboard"
                  element={<DriverDashboard />}
                />
              </Route>

              {/* Common Authenticated Routes */}
              <Route
                path="/orders/:orderId"
                element={<OrderDetails />}
              />

            </Route>
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;