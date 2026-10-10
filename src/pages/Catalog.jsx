import { useEffect, useState } from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

function normalizeArray(response) {
  if (Array.isArray(response)) {
    return response;
  }

  if (Array.isArray(response?.data)) {
    return response.data;
  }

  if (Array.isArray(response?.components)) {
    return response.components;
  }

  if (Array.isArray(response?.technologies)) {
    return response.technologies;
  }

  if (Array.isArray(response?.content)) {
    return response.content;
  }

  return [];
}


/* =========================================================
   COMPONENTS CATALOG
   ========================================================= */

export function ComponentsCatalog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadComponents() {
      try {
        setLoading(true);
        setError("");

        const response = await api.components();

        console.log(
          "Components API response:",
          response
        );

        const list = normalizeArray(response);

        if (mounted) {
          setData(list);
        }
      } catch (err) {
        console.error(
          "Failed to load components:",
          err
        );

        if (mounted) {
          setData([]);
          setError(
            "Unable to load components right now."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadComponents();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppLayout>

      <div className="hero-row">

        <div>
          <span className="eyebrow">
            COMPONENTS
          </span>

          <h1>
            Components Catalog
          </h1>

          <p>
            Browse hardware components available
            for your ECE projects.
          </p>
        </div>

      </div>


      {loading && (
        <div className="empty-state">
          <h3>
            Loading components...
          </h3>

          <p>
            Please wait while the catalog loads.
          </p>
        </div>
      )}


      {!loading && error && (
        <div className="empty-state">

          <h3>
            Components could not be loaded
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


      {!loading &&
        !error &&
        data.length === 0 && (
          <div className="empty-state">

            <h3>
              No components found
            </h3>

            <p>
              There are currently no components
              available in the catalog.
            </p>

          </div>
        )}


      {!loading &&
        !error &&
        data.length > 0 && (
          <div className="catalog-grid">

            {data.map((item, index) => (
              <div
                className="catalog-card"
                key={item.id ?? index}
              >

                <div className="catalog-icon">
                  ◈
                </div>

                <div>

                  <h3>
                    {item.name ||
                      item.componentName ||
                      "Component"}
                  </h3>

                  <p>
                    {item.description ||
                      item.category ||
                      "ECE hardware component"}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

    </AppLayout>
  );
}


/* =========================================================
   TECHNOLOGIES CATALOG
   ========================================================= */

export function TechnologiesCatalog() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadTechnologies() {
      try {
        setLoading(true);
        setError("");

        const response =
          await api.technologies();

        console.log(
          "Technologies API response:",
          response
        );

        const list = normalizeArray(response);

        if (mounted) {
          setData(list);
        }
      } catch (err) {
        console.error(
          "Failed to load technologies:",
          err
        );

        if (mounted) {
          setData([]);
          setError(
            "Unable to load technologies right now."
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    loadTechnologies();

    return () => {
      mounted = false;
    };
  }, []);

  return (
    <AppLayout>

      <div className="hero-row">

        <div>
          <span className="eyebrow">
            TECHNOLOGIES
          </span>

          <h1>
            Technologies Catalog
          </h1>

          <p>
            Explore technologies used across
            ECE projects.
          </p>
        </div>

      </div>


      {loading && (
        <div className="empty-state">

          <h3>
            Loading technologies...
          </h3>

          <p>
            Please wait while the catalog loads.
          </p>

        </div>
      )}


      {!loading && error && (
        <div className="empty-state">

          <h3>
            Technologies could not be loaded
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


      {!loading &&
        !error &&
        data.length === 0 && (
          <div className="empty-state">

            <h3>
              No technologies found
            </h3>

            <p>
              There are currently no technologies
              available in the catalog.
            </p>

          </div>
        )}


      {!loading &&
        !error &&
        data.length > 0 && (
          <div className="catalog-grid">

            {data.map((item, index) => (
              <div
                className="catalog-card"
                key={item.id ?? index}
              >

                <div className="catalog-icon">
                  ◆
                </div>

                <div>

                  <h3>
                    {item.name ||
                      item.technologyName ||
                      "Technology"}
                  </h3>

                  <p>
                    {item.description ||
                      item.category ||
                      "ECE technology"}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

    </AppLayout>
  );
}