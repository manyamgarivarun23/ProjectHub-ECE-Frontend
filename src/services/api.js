
const API_BASE_URL = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "");

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE_URL}${path}`, {
        credentials: "include",
        ...options,
        headers: {
            ...(options.body &&
            !(options.body instanceof FormData)
                ? { "Content-Type": "application/json" }
                : {}),
            ...(options.headers || {}),
        },
    });

    if (response.status === 401 || response.status === 403) {
        throw new Error("AUTH_REQUIRED");
    }

    const contentType = response.headers.get("content-type") || "";

    let data;

    if (contentType.includes("application/json")) {
        data = await response.json();
    } else {
        data = await response.text();

        if (
            typeof data === "string" &&
            (
                data.includes("<html") ||
                data.includes("<!DOCTYPE html") ||
                data.includes("<form")
            )
        ) {
            throw new Error("AUTH_REQUIRED");
        }
    }

    if (!response.ok) {
        throw new Error(
            typeof data === "string"
                ? data
                : data?.message || "Request failed"
        );
    }

    return data;
}

const api = {

    // =========================
    // AUTHENTICATION
    // =========================

    me: () => request("/api/me"),

    login: async (email, password) => {
        const body = new URLSearchParams({
            username: email,
            password: password,
        });

        const response = await fetch(`${API_BASE_URL}/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body,
        });

        if (!response.ok) {
            throw new Error("Invalid email or password.");
        }

        const current = await request("/api/me");

        if (
            !current ||
            typeof current !== "object" ||
            !current.role
        ) {
            throw new Error(
                "Login succeeded, but user information could not be loaded."
            );
        }

        return current;
    },

    logout: () =>
        request("/logout", {
            method: "POST",
        }),

    // =========================
    // PROJECTS
    // =========================

    projects: () =>
        request("/api/projects"),

    project: (id) =>
        request(`/api/projects/${id}`),

    createProject: (data) =>
        request("/api/projects", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateStatus: (projectId, status) =>
        request("/api/projects/status", {
            method: "PUT",
            body: JSON.stringify({
                projectId,
                status,
            }),
        }),

    updateProgress: (projectId, progress) =>
        request("/api/projects/progress", {
            method: "PUT",
            body: JSON.stringify({
                projectId,
                progress,
            }),
        }),

    // =========================
    // STUDENTS / TEAM
    // =========================

    students: () =>
        request("/api/students"),

    members: (projectId) =>
        request(`/api/projects/${projectId}/team`),

    addMember: (projectId, studentId) =>
        request(`/api/projects/${projectId}/team`, {
            method: "POST",
            body: JSON.stringify({
                studentId,
            }),
        }),

    removeMember: (id) =>
        request(`/api/projects/team/${id}`, {
            method: "DELETE",
        }),

    // =========================
    // COMPONENT CATALOG
    // =========================

    components: () =>
        request("/api/components"),

    createComponent: (data) =>
        request("/api/components", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // =========================
    // PROJECT COMPONENTS
    // =========================

    projectComponents: (projectId) =>
        request(`/api/projects/${projectId}/components`),

    addComponent: (projectId, componentId, quantity) =>
        request(`/api/projects/${projectId}/components`, {
            method: "POST",
            body: JSON.stringify({
                componentId,
                quantity,
            }),
        }),

    // REMOVE A COMPONENT FROM A PROJECT
    // This does not delete it from the global catalog.
    removeProjectComponent: (projectId, id) =>
        request(`/api/projects/${projectId}/components/${id}`, {
            method: "DELETE",
        }),

    // =========================
    // TECHNOLOGY CATALOG
    // =========================

    technologies: () =>
        request("/api/technologies"),

    createTechnology: (data) =>
        request("/api/technologies", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    // =========================
    // PROJECT TECHNOLOGIES
    // =========================

    projectTechnologies: (projectId) =>
        request(`/api/projects/${projectId}/technologies`),

    addTechnology: (projectId, technologyId) =>
        request(`/api/projects/${projectId}/technologies`, {
            method: "POST",
            body: JSON.stringify({
                technologyId,
            }),
        }),

    // =========================
    // TESTING
    // =========================

    testing: (projectId) =>
        request(`/api/projects/${projectId}/testing`),

    projectTesting: (projectId) =>
        request(`/api/projects/${projectId}/testing`),

    addTesting: (projectId, data) =>
        request(`/api/projects/${projectId}/testing`, {
            method: "POST",
            body: JSON.stringify(data),
        }),

    deleteTesting: (id) =>
        request(`/api/projects/testing/${id}`, {
            method: "DELETE",
        }),

    // =========================
    // FEEDBACK
    // =========================

    feedback: () =>
        request("/api/feedback"),

    addFeedback: (data) =>
        request("/api/feedback", {
            method: "POST",
            body: JSON.stringify(data),
        }),

    updateFeedbackStatus: (feedbackId, status) =>
        request(`/api/feedback/${feedbackId}/status`, {
            method: "PUT",
            body: JSON.stringify({
                status,
            }),
        }),
};

export default api;
