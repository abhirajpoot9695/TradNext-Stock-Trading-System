import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_URL, DASHBOARD_URL } from "../../config";

function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);

        try {
            await axios.post(
                `${API_URL}/signup`,
                { name, email, password },
                { withCredentials: true }
            );

            window.location.href = DASHBOARD_URL;
        } catch (err) {
            console.error(err);
            setError(err.response?.data || "Something went wrong signing up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container mt-5" style={{ maxWidth: "420px" }}>
            <h2 className="mb-4 text-center">Create your account</h2>

            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label className="form-label">Name</label>
                    <input
                        type="text"
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>

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
                        minLength={6}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Confirm password</label>
                    <input
                        type="password"
                        className="form-control"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </div>

                {error && <p className="text-danger">{error}</p>}

                <button
                    type="submit"
                    className="btn btn-primary w-100"
                    disabled={loading}
                >
                    {loading ? "Creating account..." : "Sign up"}
                </button>
            </form>

            <p className="mt-3 text-center">
                Already have an account? <Link to="/login">Log in</Link>
            </p>
        </div>
    );
}

export default Signup;