import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import api from "../services/api";

export default function CreateProject() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title:"", domain:"", projectAbstract:"", description:"" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const update = (e) => setForm({...form, [e.target.name]: e.target.value});
  const submit = async (e) => {
    e.preventDefault(); setBusy(true); setError("");
    try { const p = await api.createProject(form); navigate(`/projects/${p.id}`); }
    catch (err) { setError(err.message); } finally { setBusy(false); }
  };
  return <AppLayout>
    <div className="form-page"><div className="form-heading"><div><span className="eyebrow">PROJECT SETUP</span><h1>Create a new project</h1><p>Capture the idea, domain and scope of your ECE project.</p></div><button className="ghost-btn" onClick={()=>navigate("/projects")}>← Back</button></div>
      <form className="glass-form" onSubmit={submit}>
        <div className="form-grid">
          <div className="field full"><label>Project title</label><input name="title" value={form.title} onChange={update} placeholder="e.g. Smart Energy Monitoring System" required /></div>
          <div className="field full"><label>Project domain</label><input name="domain" value={form.domain} onChange={update} placeholder="IoT, Embedded Systems, VLSI..." required /></div>
          <div className="field full"><label>Abstract</label><textarea name="projectAbstract" value={form.projectAbstract} onChange={update} rows="5" placeholder="Briefly explain the problem and proposed solution." required /></div>
          <div className="field full"><label>Description</label><textarea name="description" value={form.description} onChange={update} rows="7" placeholder="Describe features, workflow and expected outcome." required /></div>
        </div>
        {error && <div className="alert error">{error}</div>}
        <div className="form-actions"><button type="button" className="ghost-btn" onClick={()=>navigate("/projects")}>Cancel</button><button className="primary-btn" disabled={busy}>{busy?"Creating...":"Create Project"}</button></div>
      </form>
    </div>
  </AppLayout>;
}
