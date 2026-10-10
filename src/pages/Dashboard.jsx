import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import { useAuth } from "./AuthContext";
import api from "../services/api";

export default function Dashboard() {
  const { user } = useAuth();

  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadProjects() {
      try {
        setLoading(true);
        setError("");

        const response = await api.projects();

        console.log("Projects API response:", response);

        /*
         * The API should normally return:
         *
         * [
         *   { id: 1, title: "...", ... },
         *   { id: 2, title: "...", ... }
         * ]
         *
         * This also protects the UI if the API returns an object.
         */

        let projectList = [];

        if (Array.isArray(response)) {
          projectList = response;
        } else if (Array.isArray(response?.data)) {
          projectList = response.data;
        } else if (Array.isArray(response?.projects)) {
          projectList = response.projects;
        } else if (Array.isArray(response?.content)) {
          projectList = response.content;
        }

        if (mounted) {
          setProjects(projectList);

          if (
            !Array.isArray(response) &&
            !Array.isArray(response?.data) &&
            !Array.isArray(response?.projects) &&
            !Array.isArray(response?.content)
          ) {
            console.warn(
              "Projects API did not return an array:",
              response
            );
          }
        }
      } catch (err) {
        console.error("Failed to load projects:", err);

        if (mounted) {
          setProjects([]);
          setError("Unable to load projects right now.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadProjects();

    return () => {
      mounted = false;
    };
  }, []);

  const completed = projects.filter(
    (project) => project.status === "COMPLETED"
  ).length;

  const inProgress = projects.filter(
    (project) => project.status === "IN_PROGRESS"
  ).length;

  const avg =
    projects.length > 0
      ? Math.round(
          projects.reduce(
            (total, project) =>
              total + Number(project.progress || 0),
            0
          ) / projects.length
        )
      : 0;

  return (
    <AppLayout>
      {/* HERO */}
      <div className="hero-row">
        <div>
          <span className="eyebrow">DASHBOARD</span>

          <h1>
            Welcome back,{" "}
            {user?.name?.split(" ")[0] || "Engineer"}.
          </h1>

          <p>
            Track your ECE projects and keep every milestone
            in one place.
          </p>
        </div>

        {user?.role === "STUDENT" && (
          <Link
            className="primary-btn"
            to="/projects/new"
          >
            ＋ New Project
          </Link>
        )}
      </div>

      {/* STATS */}
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-icon purple">▦</span>

          <div>
            <span>Projects</span>
            <strong>{projects.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon blue">↗</span>

          <div>
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon green">✓</span>

          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon orange">◔</span>

          <div>
            <span>Avg. Progress</span>
            <strong>{avg}%</strong>
          </div>
        </div>
      </div>

      {/* RECENT PROJECTS */}
      <div className="section-heading">
        <div>
          <span className="eyebrow">WORKSPACE</span>
          <h3>Recent projects</h3>
        </div>

        <Link
          to="/projects"
          className="ghost-btn"
        >
          View all →
        </Link>
      </div>

      {/* LOADING */}
      {loading && (
        <div className="empty-state">
          <h3>Loading projects...</h3>
          <p>Please wait while we load your workspace.</p>
        </div>
      )}

      {/* ERROR */}
      {!loading && error && (
        <div className="empty-state">
          <h3>Projects could not be loaded</h3>

          <p>{error}</p>

          <button
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>
        </div>
      )}

      {/* NO PROJECTS */}
      {!loading &&
        !error &&
        projects.length === 0 && (
          <div className="empty-state">
            <h3>No projects yet</h3>

            <p>
              Create your first ECE project to get started.
            </p>

            {user?.role === "STUDENT" && (
              <Link
                to="/projects/new"
                className="primary-btn"
              >
                Create Project
              </Link>
            )}
          </div>
        )}

      {/* PROJECT LIST */}
      {!loading &&
        !error &&
        projects.length > 0 && (
          <div className="project-grid">
            {projects
              .slice(0, 6)
              .map((project) => (
                <ProjectCard
                  key={project.id}
                  project={project}
                />
              ))}
          </div>
        )}
    </AppLayout>
  );
}

export function ProjectCard({ project }) {
  const progress = Number(project.progress || 0);

  const statusClass = (project.status || "")
    .toLowerCase()
    .replace(/_/g, "-");

  return (
    <Link
      className="project-card"
      to={`/projects/${project.id}`}
    >
      <div className="card-top">
        <span className={`status ${statusClass}`}>
          {(project.status || "DRAFT").replace(
            /_/g,
            " "
          )}
        </span>

        <span>#{project.id}</span>
      </div>

      <h3>{project.title || "Untitled Project"}</h3>

      <span className="domain">
        {project.domain || "ECE Project"}
      </span>

      <p>
        {project.description ||
          "No description provided."}
      </p>

      <div className="progress-row">
        <span>Progress</span>
        <strong>{progress}%</strong>
      </div>

      <div className="progress-track">
        <div
          style={{
            width: `${Math.max(
              0,
              Math.min(100, progress)
            )}%`,
          }}
        />
      </div>

      <div className="card-arrow">
        Open project →
      </div>
    </Link>
  );
}