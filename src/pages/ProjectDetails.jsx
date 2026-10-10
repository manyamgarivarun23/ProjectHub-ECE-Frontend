import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

export default function ProjectDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [project, setProject] = useState(null);

    const [status, setStatus] = useState("");
    const [progress, setProgress] = useState(0);

    const [loading, setLoading] = useState(true);
    const [savingStatus, setSavingStatus] = useState(false);
    const [savingProgress, setSavingProgress] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =========================================================
    // LOAD PROJECT
    // =========================================================

    const loadProject = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await api.project(id);

            const p = data.project;

            setProject({
                ...p,
                feedback: data.feedback || [],
            });

            setStatus(p.status || "DRAFT");
            setProgress(
                p.progress === null ||
                p.progress === undefined
                    ? 0
                    : Number(p.progress)
            );

        } catch (err) {
            setError(
                err.message ||
                "Unable to load project."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadProject();
    }, [id]);

    // =========================================================
    // UPDATE STATUS
    // =========================================================

    const updateStatus = async () => {
        try {
            setSavingStatus(true);
            setError("");
            setMessage("");

            const updatedProject =
                await api.updateStatus(
                    Number(id),
                    status
                );

            setProject((previous) => ({
                ...previous,
                ...updatedProject,
            }));

            setStatus(
                updatedProject.status || status
            );

            setProgress(
                updatedProject.progress === null ||
                updatedProject.progress === undefined
                    ? 0
                    : Number(updatedProject.progress)
            );

            setMessage(
                "Project status updated successfully."
            );

        } catch (err) {
            setError(
                err.message ||
                "Unable to update project status."
            );
        } finally {
            setSavingStatus(false);
        }
    };

    // =========================================================
    // UPDATE PROGRESS
    // =========================================================

    const updateProgress = async () => {
        const numericProgress =
            Number(progress);

        if (
            Number.isNaN(numericProgress) ||
            numericProgress < 0 ||
            numericProgress > 100
        ) {
            setError(
                "Progress must be between 0 and 100."
            );
            return;
        }

        try {
            setSavingProgress(true);
            setError("");
            setMessage("");

            const updatedProject =
                await api.updateProgress(
                    Number(id),
                    numericProgress
                );

            setProject((previous) => ({
                ...previous,
                ...updatedProject,
            }));

            setProgress(
                updatedProject.progress === null ||
                updatedProject.progress === undefined
                    ? numericProgress
                    : Number(updatedProject.progress)
            );

            setStatus(
                updatedProject.status ||
                status
            );

            setMessage(
                "Project progress updated successfully."
            );

        } catch (err) {
            setError(
                err.message ||
                "Unable to update project progress."
            );
        } finally {
            setSavingProgress(false);
        }
    };

    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {
        return (
            <AppLayout>
                <div className="empty-state">
                    Loading project...
                </div>
            </AppLayout>
        );
    }

    // =========================================================
    // ERROR
    // =========================================================

    if (error && !project) {
        return (
            <AppLayout>
                <div className="alert error">
                    {error}
                </div>
            </AppLayout>
        );
    }

    if (!project) {
        return (
            <AppLayout>
                <div className="empty-state">
                    Project not found.
                </div>
            </AppLayout>
        );
    }

    // =========================================================
    // PAGE
    // =========================================================

    return (
        <AppLayout>

            {/* HEADER */}

            <div className="detail-head">

                <div>

                    <span className="eyebrow">
                        PROJECT #{project.id}
                    </span>

                    <h1>
                        {project.title}
                    </h1>

                    <span className="domain">
                        {project.domain}
                    </span>

                </div>

                <button
                    className="ghost-btn"
                    onClick={() =>
                        navigate("/projects")
                    }
                >
                    ← Projects
                </button>

            </div>

            {/* MESSAGES */}

            {message && (
                <div className="alert success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            <div className="detail-grid">

                <div className="detail-main">

                    {/* PROJECT PROGRESS */}

                    <div className="glass-card">

                        <div className="card-top">

                            <span
                                className={`status ${
                                    (project.status || "")
                                        .toLowerCase()
                                        .replace("_", "-")
                                }`}
                            >
                                {(project.status || "")
                                    .replace("_", " ")}
                            </span>

                            <strong>
                                {Number(
                                    project.progress || 0
                                )}
                                %
                            </strong>

                        </div>

                        <h3>
                            Project progress
                        </h3>

                        <div className="big-progress">

                            <div
                                style={{
                                    width: `${Math.max(
                                        0,
                                        Math.min(
                                            100,
                                            Number(
                                                project.progress || 0
                                            )
                                        )
                                    )}%`,
                                }}
                            />

                        </div>

                        <p className="muted">
                            Current completion
                        </p>

                        {/* CONTROLS */}

                        <div className="control-grid">

                            {/* STATUS */}

                            <div>

                                <label>
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="DRAFT">
                                        DRAFT
                                    </option>

                                    <option value="IN_PROGRESS">
                                        IN PROGRESS
                                    </option>

                                    <option value="COMPLETED">
                                        COMPLETED
                                    </option>

                                    <option value="ON_HOLD">
                                        ON HOLD
                                    </option>

                                </select>

                                <button
                                    className="secondary-btn"
                                    onClick={updateStatus}
                                    disabled={savingStatus}
                                >
                                    {savingStatus
                                        ? "Updating..."
                                        : "Update status"}
                                </button>

                            </div>

                            {/* PROGRESS */}

                            <div>

                                <label>
                                    Progress %
                                </label>

                                <input
                                    type="number"
                                    min="0"
                                    max="100"
                                    value={progress}
                                    onChange={(event) =>
                                        setProgress(
                                            event.target.value
                                        )
                                    }
                                />

                                <button
                                    className="secondary-btn"
                                    onClick={updateProgress}
                                    disabled={savingProgress}
                                >
                                    {savingProgress
                                        ? "Updating..."
                                        : "Update progress"}
                                </button>

                            </div>

                        </div>

                    </div>

                    {/* ABSTRACT / DESCRIPTION */}

                    <div className="glass-card">

                        <span className="eyebrow">
                            ABSTRACT
                        </span>

                        <h3>
                            About the project
                        </h3>

                        <p className="long-text">
                            {project.projectAbstract ||
                                "No abstract provided."}
                        </p>

                        <span className="eyebrow">
                            DESCRIPTION
                        </span>

                        <p className="long-text">
                            {project.description ||
                                "No description provided."}
                        </p>

                    </div>

                </div>

                {/* RIGHT SIDE */}

                <div className="detail-side">

                    {/* MANAGE */}

                    <div className="glass-card">

                        <span className="eyebrow">
                            MANAGE
                        </span>

                        <div className="action-list">

                            <Link
                                to={`/projects/${id}/team`}
                            >
                                Team
                                <span>→</span>
                            </Link>

                            <Link
                                to={`/projects/${id}/components`}
                            >
                                Components
                                <span>→</span>
                            </Link>

                            <Link
                                to={`/projects/${id}/technologies`}
                            >
                                Technologies
                                <span>→</span>
                            </Link>

                            <Link
                                to={`/projects/${id}/testing`}
                            >
                                Testing results
                                <span>→</span>
                            </Link>

                        </div>

                    </div>

                    {/* FEEDBACK */}

                    <div className="glass-card">

                        <span className="eyebrow">
                            FEEDBACK
                        </span>

                        {project.feedback?.length ? (

                            project.feedback.map(
                                (feedback) => (

                                    <div
                                        className="feedback-mini"
                                        key={feedback.id}
                                    >

                                        <div>

                                            <strong>
                                                Faculty #
                                                {feedback.facultyId}
                                            </strong>

                                            <span
                                                className={`status ${
                                                    (
                                                        feedback.status ||
                                                        ""
                                                    ).toLowerCase()
                                                }`}
                                            >
                                                {feedback.status}
                                            </span>

                                        </div>

                                        <p>
                                            {feedback.comments}
                                        </p>

                                    </div>

                                )
                            )

                        ) : (

                            <p className="muted">
                                No faculty feedback has
                                been added yet.
                            </p>

                        )}

                        <Link
                            className="ghost-btn full"
                            to="/feedback"
                        >
                            Open feedback →
                        </Link>

                    </div>

                </div>

            </div>

        </AppLayout>
    );
}