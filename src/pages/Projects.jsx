import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useAuth } from "./AuthContext";
import api from "../services/api";

export default function Projects() {
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

        console.log("Projects page API response:", response);

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

  return (
    <AppLayout>
      <div className="hero-row">
        <div>
          <span className="eyebrow">PROJECTS</span>

          <h1>
            Your Projects
          </h1>

          <p>
            Manage and track your ECE projects from one workspace.
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

      {/* Statistics */}

      <div className="stats-grid">

        <div className="stat-card">
          <span className="stat-icon purple">
            ▦
          </span>

          <div>
            <span>Total Projects</span>
            <strong>{projects.length}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon blue">
            ↗
          </span>

          <div>
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>
        </div>

        <div className="stat-card">
          <span className="stat-icon green">
            ✓
          </span>

          <div>
            <span>Completed</span>
            <strong>{completed}</strong>
          </div>
        </div>

      </div>

      {/* Section */}

      <div className="section-heading">

        <div>
          <span className="eyebrow">
            WORKSPACE
          </span>

          <h3>
            All Projects
          </h3>
        </div>

      </div>

      {/* Loading */}

      {loading && (
        <div className="empty-state">
          <h3>
            Loading projects...
          </h3>

          <p>
            Please wait while we load your projects.
          </p>
        </div>
      )}

      {/* Error */}

      {!loading && error && (
        <div className="empty-state">

          <h3>
            Projects could not be loaded
          </h3>

          <p>
            {error}
          </p>

          <button
            className="primary-btn"
            onClick={() => window.location.reload()}
          >
            Try Again
          </button>

        </div>
      )}

      {/* No projects */}

      {!loading &&
        !error &&
        projects.length === 0 && (
          <div className="empty-state">

            <h3>
              No projects yet
            </h3>

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

      {/* Project cards */}

      {!loading &&
        !error &&
        projects.length > 0 && (
          <div className="project-grid">

            {projects.map((project) => (
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


/* =========================================================
   PROJECT CARD
   ========================================================= */

function ProjectCard({ project }) {

  const progress = Number(
    project.progress || 0
  );

  const statusClass =
    (project.status || "")
      .toLowerCase()
      .replace(/_/g, "-");

  return (
    <Link
      className="project-card"
      to={`/projects/${project.id}`}
    >

      <div className="card-top">

        <span
          className={`status ${statusClass}`}
        >
          {(project.status || "DRAFT")
            .replace(/_/g, " ")}
        </span>

        <span>
          #{project.id}
        </span>

      </div>

      <h3>
        {project.title || "Untitled Project"}
      </h3>

      <span className="domain">
        {project.domain || "ECE Project"}
      </span>

      <p>
        {project.description ||
          "No description provided."}
      </p>

      <div className="progress-row">

        <span>
          Progress
        </span>

        <strong>
          {progress}%
        </strong>

      </div>

      <div className="progress-track">

        <div
          style={{
            width: `${Math.max(
              0,
              Math.min(100, progress)
            )}%`
          }}
        />

      </div>

      <div className="card-arrow">
        Open project →
      </div>

    </Link>
  );
}