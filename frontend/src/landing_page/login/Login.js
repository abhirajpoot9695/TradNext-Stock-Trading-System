import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL, DASHBOARD_URL } from "../../config";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const res = await axios.post(
                `${API_URL}/login`,
                { email, password },
                { withCredentials: true }
            );

            console.log(res.data);

            alert("LOGIN SUCCESS");

            window.location.href = DASHBOARD_URL;
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "420px" }}>
            <h2 className="mb-4 text-center">Log in</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-danger">{error}</p>}

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Logging in..." : "Log in"}
                </button>
            </form>

            <p className="mt-3 text-center">
                Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
        </div>
    );
}

export default Login;