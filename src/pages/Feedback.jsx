import {useEffect,useState} from "react";
import AppLayout from "../components/AppLayout";
import api from "../services/api";
import {useAuth} from "./AuthContext";

export default function Feedback(){
  const {user}=useAuth();const[projects,setProjects]=useState([]),[list,setList]=useState([]);const[form,setForm]=useState({projectId:"",comments:"",status:"PENDING"});
  const load=()=>api.feedback().then(setList);useEffect(()=>{api.projects().then(setProjects);load()},[]);
  const add=async e=>{e.preventDefault();await api.addFeedback({...form,projectId:Number(form.projectId),facultyId:user.id});setForm({projectId:"",comments:"",status:"PENDING"});load()};
  const update=async(id,status)=>{await api.updateFeedbackStatus(id,status);load()};
  return <AppLayout><div className="hero-row"><div><span className="eyebrow">FACULTY REVIEW</span><h1>Feedback workspace</h1><p>Review projects and keep student feedback actionable.</p></div></div>
    <form className="glass-form" onSubmit={add}><div className="form-grid"><div className="field full"><label>Project</label><select value={form.projectId} onChange={e=>setForm({...form,projectId:e.target.value})} required><option value="">Select project</option>{projects.map(p=><option key={p.id} value={p.id}>{p.title}</option>)}</select></div><div className="field full"><label>Comments</label><textarea rows="5" value={form.comments} onChange={e=>setForm({...form,comments:e.target.value})} required placeholder="Enter your feedback..."/></div><div className="field"><label>Status</label><select value={form.status} onChange={e=>setForm({...form,status:e.target.value})}><option>PENDING</option><option>APPROVED</option><option>NEEDS_REVISION</option></select></div></div><button className="primary-btn">Submit feedback</button></form>
    <div className="glass-card table-card"><h3>Submitted feedback</h3><table><thead><tr><th>Project</th><th>Faculty</th><th>Comments</th><th>Status</th><th>Update</th></tr></thead><tbody>{list.map(f=><tr key={f.id}><td>#{f.projectId}</td><td>#{f.facultyId}</td><td>{f.comments}</td><td><span className="status pending">{f.status}</span></td><td><select value={f.status} onChange={e=>update(f.id,e.target.value)}><option>PENDING</option><option>APPROVED</option><option>NEEDS_REVISION</option></select></td></tr>)}</tbody></table></div>
  </AppLayout>
}
