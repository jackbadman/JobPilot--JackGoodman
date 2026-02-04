/**
 * Top-level route map for the SPA.
 */
import { Navigate, Route, Routes } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import CreateJobPage from "./pages/CreateJobPage";
import EditJobPage from "./pages/EditJobPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";

const hasToken = () => Boolean(localStorage.getItem("token"));

function RequireAuth({ children }) {
  return hasToken() ? children : <Navigate to="/" replace />;
}

function RedirectIfAuth({ children }) {
  return hasToken() ? <Navigate to="/dashboard" replace /> : children;
}

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <RedirectIfAuth>
            <HomePage />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/login"
        element={
          <RedirectIfAuth>
            <LoginPage />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/signup"
        element={
          <RedirectIfAuth>
            <SignupPage />
          </RedirectIfAuth>
        }
      />
      <Route
        path="/dashboard"
        element={
          <RequireAuth>
            <DashboardPage />
          </RequireAuth>
        }
      />
      <Route
        path="/jobs/new"
        element={
          <RequireAuth>
            <CreateJobPage />
          </RequireAuth>
        }
      />
      <Route
        path="/jobs/:id/edit"
        element={
          <RequireAuth>
            <EditJobPage />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
