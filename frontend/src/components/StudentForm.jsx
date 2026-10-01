import { useState } from "react";
import api from "../api";

const COURSES = ["B.Tech", "BCA", "MCA", "B.Sc", "MBA"];

export default function StudentForm({ student, onClose, onSaved }) {
  const isEdit = !!student?._id;
  const [form, setForm] = useState({
    name: student?.name || "",
    email: student?.email || "",
    phone: student?.phone || "",
    course: student?.course || "",
    year: student?.year || "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (form.name.trim().length < 2) return setError("Name kam se kam 2 characters ka ho");
    if (!/^\S+@\S+\.\S+$/.test(form.email)) return setError("Valid email daalo");
    if (!/^[6-9]\d{9}$/.test(form.phone)) return setError("Phone 10 digit ka valid number ho");
    if (!form.course) return setError("Course select karo");
    if (!form.year) return setError("Year select karo");

    try {
      setSaving(true);
      if (isEdit) await api.put(`/students/${student._id}`, form);
      else await api.post("/students", form);
      onSaved();
    } catch (err) {
      setError(err.response?.data?.message || "Save nahi ho paya");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="overlay" onClick={onClose}>
      <form className="card modal" onClick={(e) => e.stopPropagation()} onSubmit={submit}>
        <h3>{isEdit ? "Edit Student" : "Add Student"}</h3>
        {error && <div className="error">{error}</div>}
        <input name="name" placeholder="Name" value={form.name} onChange={change} />
        <input name="email" type="email" placeholder="Email" value={form.email} onChange={change} />
        <input name="phone" placeholder="Phone (10 digit)" maxLength={10} value={form.phone} onChange={change} />
        <select name="course" value={form.course} onChange={change}>
          <option value="">Select course</option>
          {COURSES.map((c) => <option key={c}>{c}</option>)}
        </select>
        <select name="year" value={form.year} onChange={change}>
          <option value="">Select year</option>
          {[1, 2, 3, 4].map((y) => <option key={y} value={y}>Year {y}</option>)}
        </select>
        <div className="row">
          <button type="button" className="btn" onClick={onClose}>Cancel</button>
          <button className="btn primary" disabled={saving}>{saving ? "Saving..." : "Save"}</button>
        </div>
      </form>
    </div>
  );
}