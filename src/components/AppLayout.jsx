import {
  NavLink,
  useNavigate
} from "react-router-dom";

import { useAuth } from "../pages/AuthContext";
import api from "../services/api";


const navItems = [
  ["Dashboard", "/dashboard", "⌂"],
  ["Projects", "/projects", "▦"],
  ["Components", "/components", "◈"],
  ["Technologies", "/technologies", "◆"],
  ["Testing", "/testing", "✓"]
];


export default function AppLayout({
  children
}) {

  const {
    user,
    setUser
  } = useAuth();

  const navigate =
    useNavigate();


  const logout = async () => {

    try {

      await api.logout();

    } catch (error) {

      console.warn(
        "Logout request failed:",
        error
      );

    } finally {

      setUser(null);

      navigate(
        "/login",
        {
          replace: true
        }
      );
    }
  };


  const items =
    user?.role === "FACULTY"
      ? [
          ...navItems,
          ["Feedback", "/feedback", "✦"]
        ]
      : navItems;


  return (
    <div className="app-shell">

      <aside className="sidebar">

        <div className="brand">

          <div className="brand-mark">
            P
          </div>

          <div>

            <strong>
              ProjectHub
            </strong>

            <span>
              ECE PORTAL
            </span>

          </div>

        </div>


        <nav className="side-nav">

          {items.map(
            ([label, path, icon]) => (

              <NavLink
                key={path}
                to={path}
                className={({ isActive }) =>
                  `nav-link ${
                    isActive
                      ? "active"
                      : ""
                  }`
                }
              >

                <span>
                  {icon}
                </span>

                {label}

              </NavLink>

            )
          )}

        </nav>


        <div className="sidebar-bottom">

          <div className="user-mini">

            <div className="avatar">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

            <div>

              <strong>
                {user?.name || "User"}
              </strong>

              <span>
                {user?.role || ""}
              </span>

            </div>

          </div>


          <button
            className="logout-btn"
            onClick={logout}
            type="button"
          >
            Sign out
          </button>

        </div>

      </aside>


      <main className="main-area">

        <header className="topbar">

          <div>

            <span className="eyebrow">
              ECE PROJECT MANAGEMENT
            </span>

            <h2>
              ProjectHub ECE
            </h2>

          </div>


          <div className="top-user">

            <span>
              {user?.email || ""}
            </span>

            <div className="avatar small">

              {user?.name
                ?.charAt(0)
                ?.toUpperCase() || "U"}

            </div>

          </div>

        </header>


        <section className="page-content">

          {children}

        </section>

      </main>

    </div>
  );
}