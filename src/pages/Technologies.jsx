import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

export default function Technologies() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [all, setAll] = useState([]);
    const [items, setItems] = useState([]);

    const [technologyId, setTechnologyId] = useState("");

    const [showNew, setShowNew] = useState(false);

    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const catalog = await api.technologies();
            const projectItems = await api.projectTechnologies(id);

            setAll(Array.isArray(catalog) ? catalog : []);
            setItems(Array.isArray(projectItems) ? projectItems : []);
        } catch (err) {
            setError(
                err.message || "Unable to load technologies."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const addTechnology = async (event) => {
        event.preventDefault();

        if (!technologyId) {
            setError("Please select a technology.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await api.addTechnology(
                id,
                Number(technologyId)
            );

            setTechnologyId("");

            const updated =
                await api.projectTechnologies(id);

            setItems(
                Array.isArray(updated)
                    ? updated
                    : []
            );

            setMessage(
                "Technology added to the project."
            );
        } catch (err) {
            setError(
                err.message ||
                "This technology may already be assigned to the project."
            );
        } finally {
            setSaving(false);
        }
    };

    const createTechnology = async (event) => {
        event.preventDefault();

        if (!newName.trim()) {
            setError("Technology name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const updatedCatalog =
                await api.createTechnology({
                    name: newName.trim(),
                    category: newCategory.trim(),
                });

            const catalog =
                Array.isArray(updatedCatalog)
                    ? updatedCatalog
                    : [];

            setAll(catalog);

            const created = catalog.find(
                (technology) =>
                    technology.name?.toLowerCase() ===
                    newName.trim().toLowerCase()
            );

            if (created) {
                setTechnologyId(
                    String(created.id)
                );
            }

            setNewName("");
            setNewCategory("");

            setShowNew(false);

            setMessage(
                "New technology created. Select it and add it to the project."
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to create the technology."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>

            {/* PAGE HEADER */}

            <div className="form-heading">

                <div>
                    <span className="eyebrow">
                        SOFTWARE STACK
                    </span>

                    <h1>
                        Project technologies
                    </h1>

                    <p>
                        Track the technologies and
                        protocols used in this project.
                    </p>
                </div>

                <button
                    className="ghost-btn"
                    onClick={() =>
                        navigate(`/projects/${id}`)
                    }
                >
                    ← Project
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

            {/* ADD EXISTING TECHNOLOGY */}

            <div className="glass-card">

                <div className="section-header">

                    <div>
                        <h3>
                            Add technology
                        </h3>

                        <p>
                            Select a technology already
                            available in the catalog.
                        </p>
                    </div>

                    <button
                        type="button"
                        className="ghost-btn"
                        onClick={() => {
                            setShowNew(!showNew);
                            setError("");
                            setMessage("");
                        }}
                    >
                        {showNew
                            ? "✕ Close"
                            : "+ Add new technology"}
                    </button>

                </div>

                <form
                    className="inline-form"
                    onSubmit={addTechnology}
                >

                    <select
                        value={technologyId}
                        onChange={(event) =>
                            setTechnologyId(
                                event.target.value
                            )
                        }
                        required
                    >

                        <option value="">
                            Select technology
                        </option>

                        {all.map((technology) => (
                            <option
                                key={technology.id}
                                value={technology.id}
                            >
                                {technology.name}
                                {technology.category
                                    ? ` · ${technology.category}`
                                    : ""}
                            </option>
                        ))}

                    </select>

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Add technology"}
                    </button>

                </form>

            </div>

            {/* CREATE NEW TECHNOLOGY */}

            {showNew && (
                <div className="glass-card">

                    <div className="section-header">

                        <div>
                            <span className="eyebrow">
                                NEW TECHNOLOGY
                            </span>

                            <h3>
                                Create technology
                            </h3>

                            <p>
                                Add a technology or protocol
                                to the ProjectHub catalog.
                            </p>
                        </div>

                    </div>

                    <form
                        className="form-grid"
                        onSubmit={createTechnology}
                    >

                        <div className="field">

                            <label>
                                Technology name
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. MQTT"
                                value={newName}
                                onChange={(event) =>
                                    setNewName(
                                        event.target.value
                                    )
                                }
                                required
                            />

                        </div>

                        <div className="field">

                            <label>
                                Category
                            </label>

                            <input
                                type="text"
                                placeholder="e.g. Communication Protocol"
                                value={newCategory}
                                onChange={(event) =>
                                    setNewCategory(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        <div className="form-actions">

                            <button
                                type="button"
                                className="ghost-btn"
                                onClick={() =>
                                    setShowNew(false)
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="primary-btn"
                                disabled={saving}
                            >
                                {saving
                                    ? "Creating..."
                                    : "Create technology"}
                            </button>

                        </div>

                    </form>

                </div>
            )}

            {/* PROJECT TECHNOLOGIES */}

            <div className="glass-card table-card">

                <div className="section-header">

                    <div>
                        <h3>
                            Technologies in project
                        </h3>

                        <p>
                            Software, frameworks and
                            protocols currently assigned
                            to this project.
                        </p>
                    </div>

                </div>

                {loading ? (

                    <div className="empty-inline">
                        Loading technologies...
                    </div>

                ) : items.length === 0 ? (

                    <div className="empty-inline">
                        No technologies added to this
                        project yet.
                    </div>

                ) : (

                    <div className="tag-grid">

                        {items.map((technology) => (

                            <div
                                className="tech-card"
                                key={technology.id}
                            >

                                <strong>
                                    {technology.technologyName ||
                                        technology.name ||
                                        "Unknown technology"}
                                </strong>

                                <span>
                                    {technology.category ||
                                        "Uncategorized"}
                                </span>

                            </div>

                        ))}

                    </div>

                )}

            </div>

        </AppLayout>
    );
}