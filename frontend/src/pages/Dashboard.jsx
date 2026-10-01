import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api";
import StudentForm from "../components/StudentForm";

const COURSES = ["B.Tech", "BCA", "MCA", "B.Sc", "MBA"];

export default function Dashboard() {
  const nav = useNavigate();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [course, setCourse] = useState("");
  const [year, setYear] = useState("");
  const [editing, setEditing] = useState(null); // null = closed, {} = add new
  const [viewing, setViewing] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      setError("");
      const { data } = await api.get("/students", { params: { search, course, year } });
      setStudents(data);
    } catch (err) {
      setError(err.response?.data?.message || "Students load nahi hue");
    } finally {
      setLoading(false);
    }
  };

  // search/filter change hone par 300ms baad reload
  useEffect(() => {
    const t = setTimeout(load, 300);
    return () => clearTimeout(t);
  }, [search, course, year]);

  const remove = async (id) => {
    if (!confirm("Is student ko delete karna hai?")) return;
    try {
      await api.delete(`/students/${id}`);
      load();
    } catch (err) {
      setError(err.response?.data?.message || "Delete nahi hua");
    }
  };

  const logout = () => {
    localStorage.clear();
    nav("/login");
  };

  return (
    <div className="container">
      <header className="topbar">
        <h2>Student Management</h2>
        <div>
          <span className="muted">Hi, {localStorage.getItem("user")} </span>
          <button className="btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <div className="card toolbar">
        <input
          placeholder="Search name / email / phone"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={course} onChange={(e) => setCourse(e.target.value)}>
          <option value="">All courses</option>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select value={year} onChange={(e) => setYear(e.target.value)}>
          <option value="">All years</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <button className="btn primary" onClick={() => setEditing({})}>+ Add Student</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="card table-wrap">
        {loading ? (
          <p className="muted center">Loading...</p>
        ) : students.length === 0 ? (
          <p className="muted center">Koi student nahi mila</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Name</th><th>Email</th><th>Phone</th><th>Course</th><th>Year</th><th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s._id}>
                  <td>{s.name}</td>
                  <td>{s.email}</td>
                  <td>{s.phone}</td>
                  <td>{s.course}</td>
                  <td>{s.year}</td>
                  <td className="actions">
                    <button className="btn sm" onClick={() => setViewing(s)}>View</button>
                    <button className="btn sm" onClick={() => setEditing(s)}>Edit</button>
                    <button className="btn sm danger" onClick={() => remove(s._id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {editing && (
        <StudentForm
          student={editing}
          onClose={() => setEditing(null)}
          onSaved={() => { setEditing(null); load(); }}
        />
      )}

      {viewing && (
        <div className="overlay" onClick={() => setViewing(null)}>
          <div className="card modal" onClick={(e) => e.stopPropagation()}>
            <h3>{viewing.name}</h3>
            <p><b>Email:</b> {viewing.email}</p>
            <p><b>Phone:</b> {viewing.phone}</p>
            <p><b>Course:</b> {viewing.course}</p>
            <p><b>Year:</b> {viewing.year}</p>
            <button className="btn" onClick={() => setViewing(null)}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
}