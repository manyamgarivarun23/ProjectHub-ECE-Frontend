import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import {
  AuthProvider,
  useAuth
} from "./pages/AuthContext";

import Login from "./pages/Login";
import Register from "./pages/Register";

import Dashboard from "./pages/Dashboard";
import FacultyDashboard from "./pages/FacultyDashboard";

import Projects from "./pages/Projects";
import CreateProject from "./pages/CreateProject";
import ProjectDetails from "./pages/ProjectDetails";

import Team from "./pages/Team";
import Components from "./pages/Components";
import Technologies from "./pages/Technologies";
import Testing from "./pages/Testing";

import Feedback from "./pages/Feedback";

import {
  ComponentsCatalog,
  TechnologiesCatalog
} from "./pages/Catalog";

import "./App.css";


function Guard({ children, roles }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-card">
          <div className="loading-logo">P</div>
          <h2>ProjectHub ECE</h2>
          <p>Loading your workspace...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  if (
    roles &&
    !roles.includes(user.role)
  ) {
    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }

  return children;
}


function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />

      <Route
        path="/"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/dashboard"
        element={
          <Guard>
            <Dashboard />
          </Guard>
        }
      />

      <Route
        path="/student-dashboard"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

      <Route
        path="/faculty-dashboard"
        element={
          <Guard roles={["FACULTY"]}>
            <FacultyDashboard />
          </Guard>
        }
      />

      <Route
        path="/projects"
        element={
          <Guard>
            <Projects />
          </Guard>
        }
      />

      <Route
        path="/projects/new"
        element={
          <Guard roles={["STUDENT"]}>
            <CreateProject />
          </Guard>
        }
      />

      <Route
        path="/projects/:id"
        element={
          <Guard>
            <ProjectDetails />
          </Guard>
        }
      />

      <Route
        path="/projects/:id/team"
        element={
          <Guard>
            <Team />
          </Guard>
        }
      />

      <Route
        path="/projects/:id/components"
        element={
          <Guard>
            <Components />
          </Guard>
        }
      />

      <Route
        path="/projects/:id/technologies"
        element={
          <Guard>
            <Technologies />
          </Guard>
        }
      />

      <Route
        path="/projects/:id/testing"
        element={
          <Guard>
            <Testing />
          </Guard>
        }
      />

      <Route
        path="/components"
        element={
          <Guard>
            <ComponentsCatalog />
          </Guard>
        }
      />

      <Route
        path="/technologies"
        element={
          <Guard>
            <TechnologiesCatalog />
          </Guard>
        }
      />

      <Route
        path="/testing"
        element={
          <Guard>
            <Testing />
          </Guard>
        }
      />

      <Route
        path="/feedback"
        element={
          <Guard roles={["FACULTY"]}>
            <Feedback />
          </Guard>
        }
      />

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />

    </Routes>
  );
}


export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  );
}