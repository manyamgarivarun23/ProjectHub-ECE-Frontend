import { useState } from "react";
import {
  Link,
  useNavigate
} from "react-router-dom";


export default function Register() {

  const navigate =
    useNavigate();


  const [name, setName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [role, setRole] =
    useState("STUDENT");

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [busy, setBusy] =
    useState(false);


  const submit = async (event) => {

    event.preventDefault();

    setError("");
    setMessage("");
    setBusy(true);


    try {

      const response =
        await fetch(
          "http://localhost:8080/register",
          {
            method: "POST",

            credentials: "include",

            headers: {
              "Content-Type":
                "application/x-www-form-urlencoded"
            },

            body:
              new URLSearchParams({
                name,
                email,
                password,
                role
              })
          }
        );


      const contentType =
        response.headers.get(
          "content-type"
        ) || "";


      const result =
        contentType.includes(
          "application/json"
        )
          ? await response.json()
          : await response.text();


      if (!response.ok) {

        throw new Error(
          typeof result === "string"
            ? result
            : result?.message ||
              "Registration failed."
        );
      }


      setMessage(
        "Registration successful. Redirecting to login..."
      );


      setTimeout(() => {

        navigate(
          "/login",
          {
            replace: true
          }
        );

      }, 1200);


    } catch (err) {

      console.error(err);

      setError(
        err.message ||
        "Registration failed."
      );

    } finally {

      setBusy(false);

    }
  };


  return (
    <div className="login-page">

      <div className="login-visual">

        <div className="glow glow-one" />
        <div className="glow glow-two" />

        <div className="login-brand">

          <div className="brand-mark large">
            P
          </div>

          <div>
            <strong>
              ProjectHub ECE
            </strong>

            <span>
              ENGINEERING PROJECT PORTAL
            </span>
          </div>

        </div>


        <div className="login-copy">

          <span className="eyebrow">
            JOIN THE WORKSPACE
          </span>

          <h1>
            Build, track and manage
            your ECE projects.
          </h1>

          <p>
            Create your ProjectHub account
            and keep projects, teams,
            components, technologies and
            testing organized.
          </p>

          <div className="feature-pills">

            <span>
              Project Tracking
            </span>

            <span>
              Team Management
            </span>

            <span>
              Testing
            </span>

          </div>

        </div>

      </div>


      <div className="login-panel">

        <div className="login-card">

          <span className="eyebrow">
            CREATE ACCOUNT
          </span>

          <h2>
            Register
          </h2>

          <p className="muted">
            Create your ProjectHub ECE account.
          </p>


          <form onSubmit={submit}>

            <label>
              Full Name
            </label>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              type="text"
              placeholder="Enter your name"
              required
            />


            <label>
              Email
            </label>

            <input
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              type="email"
              placeholder="you@example.com"
              required
            />


            <label>
              Password
            </label>

            <input
              value={password}
              onChange={(event) =>
                setPassword(event.target.value)
              }
              type="password"
              placeholder="Create a password"
              required
              minLength={4}
            />


            <label>
              Account Type
            </label>

            <select
              value={role}
              onChange={(event) =>
                setRole(event.target.value)
              }
            >

              <option value="STUDENT">
                Student
              </option>

              <option value="FACULTY">
                Faculty
              </option>

            </select>


            {error && (
              <div className="alert error">
                {error}
              </div>
            )}


            {message && (
              <div className="alert success">
                {message}
              </div>
            )}


            <button
              className="primary-btn full"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Creating account..."
                : "Create Account"}
            </button>

          </form>


          <div
            style={{
              marginTop: "20px",
              textAlign: "center"
            }}
          >

            <span className="muted">
              Already have an account?{" "}
            </span>

            <Link to="/login">
              Sign in
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}