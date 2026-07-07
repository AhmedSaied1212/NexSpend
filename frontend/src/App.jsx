import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";

import DashboardLayout from "./layouts/DashboardLayout";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Categories from "./pages/Categories";
import Settings from "./pages/Settings";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import VerifyEmail from "./pages/auth/VerifyEmail";
import ProtectedRoute from "./components/ProtectedRoute";
import TransactionDetails from "./pages/TransactionDetails";
import Charts from "./pages/Charts";
import VerificationSend from "./pages/auth/VerificationSend";
import ForgotPassword from "./pages/auth/ForgotPassword";
import ResetPassword from "./pages/auth/ResetPassword";

// Redirect authenticated users away from the landing page to the dashboard
const PublicLanding = () => {
  const { user, isLoading } = useContext(AuthContext);
  if (isLoading || user === undefined) return null;
  if (user) return <Navigate to="/dashboard" replace />;
  return <Landing />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing */}
        <Route path="/" element={<PublicLanding />} />

        {/* Auth */}
        <Route path="/login"             element={<Login />} />
        <Route path="/register"          element={<Register />} />
        <Route path="/verify-email"      element={<VerifyEmail />} />
        <Route path="/verification-send" element={<VerificationSend />} />
        <Route path="/forgot-password"   element={<ForgotPassword />} />
        <Route path="/reset-password"    element={<ResetPassword />} />

        {/* Protected dashboard shell */}
        <Route element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }>
          <Route path="/dashboard"            element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/charts"               element={<ProtectedRoute><Charts /></ProtectedRoute>} />
          <Route path="/transaction/:id"      element={<ProtectedRoute><TransactionDetails /></ProtectedRoute>} />
          <Route path="/expenses"             element={<ProtectedRoute><Expenses /></ProtectedRoute>} />
          <Route path="/income"               element={<ProtectedRoute><Income /></ProtectedRoute>} />
          <Route path="/categories"           element={<ProtectedRoute><Categories /></ProtectedRoute>} />
          <Route path="/settings"             element={<ProtectedRoute><Settings /></ProtectedRoute>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;