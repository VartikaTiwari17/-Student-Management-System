import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../api";

export default function Auth({ mode }) {
  const isRegister = mode === "register";
  const nav = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (isRegister && form.name.trim().length < 2) return setError("Name kam se kam 2 characters ka ho");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Valid email daalo");
    if (form.password.length < 6) return setError("Password kam se kam 6 characters ka ho");

    try {
      setLoading(true);
      const { data } = await api.post(`/auth/${mode}`, form);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", data.name);
      nav("/");
    } catch (err) {
      setError(err.response?.data?.message || "Server se connect nahi ho paya");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-wrap">
      <form className="card auth-card" onSubmit={submit}>
        <h2>{isRegister ? "Register" : "Login"}</h2>
        {error && <div className="error">{error}</div>}
        {isRegister && (
          <input name="name" placeholder="Full name" value={form.name} onChange={change} />
        )}
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="password" type="password" placeholder="Password" value={form.password} onChange={change} />
        <button className="btn primary" disabled={loading}>
          {loading ? "Please wait..." : isRegister ? "Create account" : "Login"}
        </button>
        <p className="muted">
          {isRegister ? (
            <>Account hai? <Link to="/login">Login</Link></>
          ) : (
            <>Naya user? <Link to="/register">Register</Link></>
          )}
        </p>
      </form>
    </div>
  );
}