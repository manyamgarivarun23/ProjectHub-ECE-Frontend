import { useState } from "react";

import {
  Navigate,
  useNavigate,
  Link
} from "react-router-dom";

import { useAuth } from "./AuthContext";
import api from "../services/api";


export default function Login() {

  const {
    user,
    setUser,
    loading
  } = useAuth();

  const navigate =
    useNavigate();


  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [error, setError] =
    useState("");

  const [busy, setBusy] =
    useState(false);


  if (!loading && user) {

    return (
      <Navigate
        to="/dashboard"
        replace
      />
    );
  }


  const submit = async (event) => {

    event.preventDefault();

    setError("");
    setBusy(true);


    try {

      const current =
        await api.login(
          email,
          password
        );


      setUser(current);

      navigate(
        "/dashboard",
        {
          replace: true
        }
      );

    } catch (err) {

      setError(
        err.message ===
        "AUTH_REQUIRED"
          ? "Invalid email or password."
          : err.message
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
            BUILD • TRACK • REVIEW
          </span>

          <h1>
            Turn ECE ideas into
            organized projects.
          </h1>

          <p>
            One workspace for projects,
            teams, components, technologies,
            testing and faculty feedback.
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
            WELCOME BACK
          </span>

          <h2>
            Sign in
          </h2>

          <p className="muted">
            Use your ProjectHub ECE
            account to continue.
          </p>


          <form onSubmit={submit}>

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
              placeholder="Enter password"
              required
            />


            {error && (
              <div className="alert error">
                {error}
              </div>
            )}


            <button
              className="primary-btn full"
              disabled={busy}
              type="submit"
            >
              {busy
                ? "Signing in..."
                : "Sign in"}
            </button>

          </form>


          <div
            style={{
              marginTop: "20px",
              textAlign: "center"
            }}
          >

            <span className="muted">
              Don't have an account?{" "}
            </span>

            <Link to="/register">
              Create account
            </Link>

          </div>

        </div>

      </div>

    </div>
  );
}