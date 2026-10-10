import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

export default function Testing() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [projects, setProjects] = useState([]);
    const [tests, setTests] = useState([]);

    const [testName, setTestName] = useState("");
    const [testDate, setTestDate] = useState("");
    const [result, setResult] = useState("PASS");
    const [remarks, setRemarks] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    // =========================================================
    // GLOBAL TESTING PAGE
    // =========================================================

    const loadProjects = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await api.projects();

            setProjects(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            setError(
                err.message || "Unable to load projects."
            );
        } finally {
            setLoading(false);
        }
    };

    // =========================================================
    // PROJECT TESTING
    // =========================================================

    const loadTests = async () => {
        if (!id) return;

        try {
            setLoading(true);
            setError("");

            const data =
                await api.projectTesting(id);

            setTests(
                Array.isArray(data) ? data : []
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to load testing records."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) {
            loadTests();
        } else {
            loadProjects();
        }
    }, [id]);

    // =========================================================
    // ADD TEST
    // =========================================================

    const addTest = async (event) => {
        event.preventDefault();

        if (!testName.trim()) {
            setError("Test name is required.");
            return;
        }

        try {
            setSaving(true);
            setError("");
            setMessage("");

            const updated =
                await api.addTesting(id, {
                    testName: testName.trim(),
                    testDate: testDate || null,
                    result,
                    remarks: remarks.trim(),
                });

            setTests(
                Array.isArray(updated)
                    ? updated
                    : []
            );

            setTestName("");
            setTestDate("");
            setResult("PASS");
            setRemarks("");

            setMessage(
                "Testing result added successfully."
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to add testing result."
            );
        } finally {
            setSaving(false);
        }
    };

    // =========================================================
    // DELETE TEST
    // =========================================================

    const deleteTest = async (testId) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this testing record?"
        );

        if (!confirmed) return;

        try {
            setError("");
            setMessage("");

            await api.deleteTesting(testId);

            await loadTests();

            setMessage(
                "Testing record deleted."
            );
        } catch (err) {
            setError(
                err.message ||
                "Unable to delete testing record."
            );
        }
    };

    // =========================================================
    // GLOBAL TESTING WINDOW
    // =========================================================

    if (!id) {
        return (
            <AppLayout>

                <div className="form-heading">

                    <div>
                        <span className="eyebrow">
                            QUALITY CONTROL
                        </span>

                        <h1>
                            Testing
                        </h1>

                        <p>
                            Select a project to view and
                            manage its testing results.
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                <div className="glass-card">

                    <div className="section-header">

                        <div>
                            <h3>
                                Your projects
                            </h3>

                            <p>
                                Choose a project to manage
                                its testing records.
                            </p>
                        </div>

                    </div>

                    {loading ? (

                        <div className="empty-inline">
                            Loading projects...
                        </div>

                    ) : projects.length === 0 ? (

                        <div className="empty-inline">
                            No projects available.
                        </div>

                    ) : (

                        <div className="project-grid">

                            {projects.map((project) => (

                                <div
                                    className="project-card"
                                    key={project.id}
                                >

                                    <div>
                                        <span className="eyebrow">
                                            PROJECT
                                        </span>

                                        <h3>
                                            {project.title}
                                        </h3>

                                        <p>
                                            {project.domain ||
                                                "ECE Project"}
                                        </p>
                                    </div>

                                    <button
                                        className="primary-btn"
                                        onClick={() =>
                                            navigate(
                                                `/projects/${project.id}/testing`
                                            )
                                        }
                                    >
                                        Open testing →
                                    </button>

                                </div>

                            ))}

                        </div>
                    )}

                </div>

            </AppLayout>
        );
    }

    // =========================================================
    // PROJECT TESTING WINDOW
    // =========================================================

    return (
        <AppLayout>

            <div className="form-heading">

                <div>
                    <span className="eyebrow">
                        QUALITY CONTROL
                    </span>

                    <h1>
                        Project testing
                    </h1>

                    <p>
                        Record and track testing results
                        for this project.
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

            {/* ADD TEST */}

            <div className="glass-card">

                <div className="section-header">

                    <div>
                        <h3>
                            Add testing result
                        </h3>

                        <p>
                            Record a test performed on
                            this project.
                        </p>
                    </div>

                </div>

                <form
                    className="form-grid"
                    onSubmit={addTest}
                >

                    <div className="field">

                        <label>
                            Test name
                        </label>

                        <input
                            type="text"
                            placeholder="e.g. Sensor accuracy test"
                            value={testName}
                            onChange={(event) =>
                                setTestName(
                                    event.target.value
                                )
                            }
                            required
                        />

                    </div>

                    <div className="field">

                        <label>
                            Test date
                        </label>

                        <input
                            type="date"
                            value={testDate}
                            onChange={(event) =>
                                setTestDate(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="field">

                        <label>
                            Result
                        </label>

                        <select
                            value={result}
                            onChange={(event) =>
                                setResult(
                                    event.target.value
                                )
                            }
                        >
                            <option value="PASS">
                                PASS
                            </option>

                            <option value="FAIL">
                                FAIL
                            </option>

                            <option value="PARTIAL">
                                PARTIAL
                            </option>

                            <option value="PENDING">
                                PENDING
                            </option>
                        </select>

                    </div>

                    <div className="field full-width">

                        <label>
                            Remarks
                        </label>

                        <textarea
                            rows="4"
                            placeholder="Enter test observations or remarks..."
                            value={remarks}
                            onChange={(event) =>
                                setRemarks(
                                    event.target.value
                                )
                            }
                        />

                    </div>

                    <div className="form-actions">

                        <button
                            type="submit"
                            className="primary-btn"
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Add test result"}
                        </button>

                    </div>

                </form>

            </div>

            {/* TESTING RECORDS */}

            <div className="glass-card table-card">

                <div className="section-header">

                    <div>
                        <h3>
                            Testing records
                        </h3>

                        <p>
                            Previous tests performed
                            on this project.
                        </p>
                    </div>

                    <button
                        className="ghost-btn"
                        onClick={() =>
                            navigate("/testing")
                        }
                    >
                        All projects
                    </button>

                </div>

                {loading ? (

                    <div className="empty-inline">
                        Loading testing records...
                    </div>

                ) : tests.length === 0 ? (

                    <div className="empty-inline">
                        No testing records available yet.
                    </div>

                ) : (

                    <table>

                        <thead>
                            <tr>
                                <th>Test</th>
                                <th>Date</th>
                                <th>Result</th>
                                <th>Remarks</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {tests.map((test) => (

                                <tr key={test.id}>

                                    <td>
                                        {test.testName}
                                    </td>

                                    <td>
                                        {test.testDate ||
                                            "—"}
                                    </td>

                                    <td>
                                        <span
                                            className={
                                                test.result === "PASS"
                                                    ? "status-badge success"
                                                    : test.result === "FAIL"
                                                        ? "status-badge danger"
                                                        : "status-badge"
                                            }
                                        >
                                            {test.result}
                                        </span>
                                    </td>

                                    <td>
                                        {test.remarks ||
                                            "—"}
                                    </td>

                                    <td>
                                        <button
                                            className="ghost-btn"
                                            onClick={() =>
                                                deleteTest(
                                                    test.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>
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