import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { saveSession } from "../services/auth.jsx"
import { useAuth } from "../services/AuthContext.jsx";
import "./Auth.css";

const API_URL = "http://localhost:8090/api/auth";

function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { loginUser } = useAuth();

    const [form, setForm] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    function handleChange(event) {
        setForm({
            ...form,
            [event.target.name]: event.target.value,
        });
    }

    async function handleSubmit(event) {
        event.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_URL}/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(form),
            });

            const data = await response.json().catch(() => ({}));

            if (!response.ok) {
                throw new Error(
                    data.message || data.error || "Login failed."
                );
            }

            saveSession(data);

            // Verify the returned session before entering the dashboard.
            const token = localStorage.getItem("jwtToken");

            const userResponse = await fetch(`${API_URL}/me`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            if (!userResponse.ok) {
                throw new Error(
                    "Login succeeded, but the user session could not be verified."
                );
            }

            const userData = await userResponse.json();

            const currentUser =
                userData.user ??
                userData.data?.user ??
                userData;

            loginUser(currentUser);

            const redirectPath = location.state?.from?.pathname || "/dashboard";

            navigate(redirectPath, { replace: true });
        } catch (err) {
            setError(err.message || "Unable to log in.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">
            <div className="auth-card">
                <Link to="/login" className="auth-brand">
                    <span className="mlq-logo">M✓</span>
                    <span>
                        <strong>MyLeadQualifier</strong>
                        <small>AI LEAD AUTOMATION</small>
                    </span>
                </Link>

                <h1>Welcome back</h1>
                <p className="auth-subtitle">
                    Sign in to manage your leads and automations.
                </p>

                {error && (
                    <div className="auth-error" role="alert">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email address</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={form.email}
                        onChange={handleChange}
                        required
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                    />

                    <button
                        type="submit"
                        className="auth-button"
                        disabled={loading}
                    >
                        {loading ? "Signing in..." : "Sign in"}
                    </button>
                </form>

                <p className="auth-switch">
                    Don't have an account?{" "}
                    <Link to="/register">Create an account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;