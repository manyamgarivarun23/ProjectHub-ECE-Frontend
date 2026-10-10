import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

export default function Components() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [all, setAll] = useState([]);
    const [items, setItems] = useState([]);

    const [componentId, setComponentId] = useState("");
    const [quantity, setQuantity] = useState(1);

    const [showNew, setShowNew] = useState(false);

    const [newName, setNewName] = useState("");
    const [newCategory, setNewCategory] = useState("");
    const [newDescription, setNewDescription] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const loadData = async () => {
        try {
            setLoading(true);
            setError("");

            const catalog = await api.components();
            const projectItems = await api.projectComponents(id);

            setAll(Array.isArray(catalog) ? catalog : []);
            setItems(Array.isArray(projectItems) ? projectItems : []);
        } catch (err) {
            setError(err.message || "Unable to load components.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadData();
    }, [id]);

    const addComponent = async (event) => {
        event.preventDefault();

        if (!componentId) {
            setError("Please select a component.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            await api.addComponent(
                id,
                Number(componentId),
                Number(quantity)
            );

            setComponentId("");
            setQuantity(1);

            const updated = await api.projectComponents(id);
            setItems(Array.isArray(updated) ? updated : []);

            setMessage("Component added to the project.");
        } catch (err) {
            setError(err.message || "Unable to add component.");
        } finally {
            setSaving(false);
        }
    };

    const createComponent = async (event) => {
        event.preventDefault();

        if (!newName.trim()) {
            setError("Component name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const updatedCatalog = await api.createComponent({
                name: newName.trim(),
                category: newCategory.trim(),
                description: newDescription.trim(),
            });

            const catalog = Array.isArray(updatedCatalog)
                ? updatedCatalog
                : [];

            setAll(catalog);

            const created = catalog.find(
                (component) =>
                    component.name?.toLowerCase() ===
                    newName.trim().toLowerCase()
            );

            if (created) {
                setComponentId(String(created.id));
            }

            setNewName("");
            setNewCategory("");
            setNewDescription("");

            setShowNew(false);

            setMessage(
                "New component created. Select the quantity and add it to the project."
            );
        } catch (err) {
            setError(
                err.message || "Unable to create the component."
            );
        } finally {
            setSaving(false);
        }
    };

    return (
        <AppLayout>

            <div className="form-heading">
                <div>
                    <span className="eyebrow">HARDWARE</span>

                    <h1>Project components</h1>

                    <p>
                        Track the hardware used in this project.
                    </p>
                </div>

                <button
                    className="ghost-btn"
                    onClick={() => navigate(`/projects/${id}`)}
                >
                    ← Project
                </button>
            </div>

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

            {/* ADD EXISTING COMPONENT */}

            <div className="glass-card">

                <div className="section-header">
                    <div>
                        <h3>Add component</h3>

                        <p>
                            Select a component already available in the catalog.
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
                            : "+ Add new component"}
                    </button>
                </div>

                <form
                    className="inline-form"
                    onSubmit={addComponent}
                >

                    <select
                        value={componentId}
                        onChange={(event) =>
                            setComponentId(event.target.value)
                        }
                        required
                    >
                        <option value="">
                            Select component
                        </option>

                        {all.map((component) => (
                            <option
                                key={component.id}
                                value={component.id}
                            >
                                {component.name}
                                {component.category
                                    ? ` · ${component.category}`
                                    : ""}
                            </option>
                        ))}
                    </select>

                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(event) =>
                            setQuantity(event.target.value)
                        }
                        required
                    />

                    <button
                        className="primary-btn"
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Add component"}
                    </button>

                </form>
            </div>

            {/* CREATE NEW COMPONENT */}

            {showNew && (
                <div className="glass-card">

                    <div className="section-header">
                        <div>
                            <span className="eyebrow">
                                NEW HARDWARE
                            </span>

                            <h3>Create component</h3>

                            <p>
                                Add a component to the ProjectHub catalog.
                            </p>
                        </div>
                    </div>

                    <form
                        className="form-grid"
                        onSubmit={createComponent}
                    >

                        <div className="field">
                            <label>Component name</label>

                            <input
                                type="text"
                                placeholder="e.g. ESP32-C3"
                                value={newName}
                                onChange={(event) =>
                                    setNewName(event.target.value)
                                }
                                required
                            />
                        </div>

                        <div className="field">
                            <label>Category</label>

                            <input
                                type="text"
                                placeholder="e.g. Microcontroller"
                                value={newCategory}
                                onChange={(event) =>
                                    setNewCategory(event.target.value)
                                }
                            />
                        </div>

                        <div className="field full-width">
                            <label>Description</label>

                            <textarea
                                placeholder="Brief description of the component"
                                value={newDescription}
                                onChange={(event) =>
                                    setNewDescription(event.target.value)
                                }
                                rows="4"
                            />
                        </div>

                        <div className="form-actions">
                            <button
                                type="button"
                                className="ghost-btn"
                                onClick={() => setShowNew(false)}
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
                                    : "Create component"}
                            </button>
                        </div>

                    </form>
                </div>
            )}

            {/* PROJECT COMPONENTS */}

            <div className="glass-card table-card">

                <div className="section-header">
                    <div>
                        <h3>Components in project</h3>

                        <p>
                            Hardware currently assigned to this project.
                        </p>
                    </div>
                </div>

                {loading ? (
                    <div className="empty-inline">
                        Loading components...
                    </div>
                ) : items.length === 0 ? (
                    <div className="empty-inline">
                        No components added to this project yet.
                    </div>
                ) : (
                    <table>
                        <thead>
                            <tr>
                                <th>Component</th>
                                <th>Category</th>
                                <th>Quantity</th>
                            </tr>
                        </thead>

                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        {item.componentName ||
                                            item.name ||
                                            "Unknown component"}
                                    </td>

                                    <td>
                                        {item.category || "—"}
                                    </td>

                                    <td>
                                        {item.quantity}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>

        </AppLayout>
    );
}