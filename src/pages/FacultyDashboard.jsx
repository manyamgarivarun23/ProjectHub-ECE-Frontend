import { Link } from "react-router-dom";
import AppLayout from "../components/AppLayout";
import { useEffect, useState } from "react";
import api from "../services/api";

export default function FacultyDashboard() {
  const [projects, setProjects] = useState([]);
  useEffect(() => { api.projects().then(setProjects).catch(() => setProjects([])); }, []);
  const pending = projects.filter(p => p.status !== "COMPLETED").length;
  return <AppLayout>
    <div className="hero-row"><div><span className="eyebrow">FACULTY PORTAL</span><h1>Review student work.</h1><p>Monitor project progress and provide structured feedback.</p></div><Link to="/feedback" className="primary-btn">Give Feedback</Link></div>
    <div className="stats-grid">
      <div className="stat-card"><span className="stat-icon blue">▦</span><div><span>Student Projects</span><strong>{projects.length}</strong></div></div>
      <div className="stat-card"><span className="stat-icon orange">◔</span><div><span>Active Reviews</span><strong>{pending}</strong></div></div>
      <div className="stat-card"><span className="stat-icon green">✓</span><div><span>Completed</span><strong>{projects.filter(p=>p.status==="COMPLETED").length}</strong></div></div>
    </div>
    <div className="section-heading"><div><span className="eyebrow">OVERVIEW</span><h3>Student projects</h3></div><Link to="/projects" className="ghost-btn">View all →</Link></div>
    <div className="project-grid">{projects.slice(0,6).map(p=><div key={p.id}><Link className="project-card" to={`/projects/${p.id}`}><div className="card-top"><span className={`status ${(p.status||"").toLowerCase().replace("_","-")}`}>{p.status?.replace("_"," ")}</span><span>#{p.id}</span></div><h3>{p.title}</h3><span className="domain">{p.domain}</span><p>{p.description}</p><div className="progress-row"><span>Progress</span><strong>{p.progress}%</strong></div><div className="progress-track"><div style={{width:`${p.progress}%`}}/></div></Link></div>)}</div>
  </AppLayout>;
}
