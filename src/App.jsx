import React, { useState, useEffect, useRef } from 'react';
import { PalmTree, CheckCircle, BarChart2, List, Settings, ShieldCheck, Trash2, PenTool, Camera, BookOpen, FilePlus } from 'lucide-react';

const SignaturePad = ({ label, onSave, savedImage }) => {
  const canvasRef = useRef(null);
  const start = (e) => {
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
    ctx.beginPath(); ctx.moveTo(x, y);
    canvasRef.current.isDrawing = true;
  };
  const move = (e) => {
    if (!canvasRef.current.isDrawing) return;
    const ctx = canvasRef.current.getContext('2d');
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    ctx.lineTo(x, y); ctx.stroke();
  };
  const stop = () => { canvasRef.current.isDrawing = false; onSave(canvasRef.current.toDataURL()); };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-emerald-100 rounded-3xl bg-white w-full shadow-sm">
      <span className="text-[10px] font-black uppercase mb-3 text-emerald-800 tracking-widest">{label}</span>
      {savedImage ? (
        <div className="relative w-full h-32 flex items-center justify-center border rounded-xl bg-gray-50">
          <img src={savedImage} className="max-h-full" alt="Firma" />
          <button onClick={() => onSave(null)} className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full"><Trash2 size={12}/></button>
        </div>
      ) : (
        <canvas ref={canvasRef} width={300} height={120} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onTouchStart={start} onTouchMove={move} onTouchEnd={stop} className="border rounded-lg w-full touch-none bg-gray-50" />
      )}
    </div>
  );
};

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [adminAuth, setAdminAuth] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [sops, setSops] = useState(() => JSON.parse(localStorage.getItem('poes_db') || '[{"id":"1","code":"PB-IN-15","title":"Esterilización Línea 2","criteria":["Operario conoce objetivo","Ausencia personal en redlers","Llenado adecuado","Ciclo conforme a instructivo","Limpieza cuello esterilizador"]}]'));
  const [auditInfo, setAuditInfo] = useState({ farmName:'', lotArea:'', auditorName:'', date: new Date().toISOString().split('T')[0], sopId:'', sigAuditor:null });
  const [checklist, setChecklist] = useState([]);
  const [newPoes, setNewPoes] = useState({ title: '', code: '', criteria: '' });

  useEffect(() => { localStorage.setItem('poes_db', JSON.stringify(sops)); }, [sops]);

  const handleSopSelect = (id) => {
    const s = sops.find(x => x.id === id);
    if (s) {
      setAuditInfo({...auditInfo, sopId: id});
      setChecklist(s.criteria.map((c, idx) => ({ id: idx, description: c, status: 'pending' })));
    }
  };

  const addPoes = () => {
    if(!newPoes.title || !newPoes.criteria) return;
    const newItem = { id: Date.now().toString(), code: newPoes.code, title: newPoes.title, criteria: newPoes.criteria.split('\n') };
    setSops([...sops, newItem]);
    setNewPoes({ title: '', code: '', criteria: '' });
  };

  const inputStyle = "p-3 border border-emerald-200 rounded-xl bg-white text-gray-900 w-full text-sm";

  return (
    <div className="min-h-screen bg-emerald-50 font-sans text-gray-900">
      <header className="bg-emerald-900 text-white p-6 shadow-xl">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-black text-xl flex items-center gap-3"><PalmTree /> Seguimiento a POES</h1>
          <nav className="flex gap-2">
            {['home', 'checklist', 'admin'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`p-2 px-4 rounded-xl capitalize font-bold ${activeTab===tab?'bg-white text-emerald-900':'bg-emerald-800'}`}>{tab}</button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 py-10">
        {activeTab === 'home' && (
          <div className="text-center py-20">
            <div className="w-40 h-40 mx-auto bg-emerald-200 rounded-full flex items-center justify-center shadow-lg mb-8 border-4 border-emerald-300">
              <PalmTree className="w-24 h-24 text-emerald-900" />
            </div>
            <h2 className="text-4xl font-black text-emerald-900">Seguimiento a POES 2</h2>
          </div>
        )}

        {activeTab === 'checklist' && (
          <div className="space-y-6">
            <select onChange={e => handleSopSelect(e.target.value)} className="w-full p-4 rounded-2xl border-2 border-emerald-200 font-bold bg-white text-emerald-900">
              <option value="">Seleccionar POES...</option>
              {sops.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
            </select>
            {checklist.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
                <p className="font-bold mb-4">{item.description}</p>
                <div className="flex gap-4">
                  <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'ok'} : c))} className={`p-3 px-8 rounded-xl font-black ${item.status === 'ok' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}>✔️</button>
                  <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'fail'} : c))} className={`p-3 px-8 rounded-xl font-black ${item.status === 'fail' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}>❌</button>
                </div>
              </div>
            ))}
            {auditInfo.sopId && <SignaturePad label="Firma Auditor Responsable" savedImage={auditInfo.sigAuditor} onSave={img=>setAuditInfo({...auditInfo, sigAuditor:img})} />}
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-emerald-100">
            {!adminAuth ? (
              <div className="space-y-4">
                <h2 className="font-black text-xl flex items-center gap-2"><ShieldCheck/> Acceso Admin</h2>
                <input type="email" placeholder="Correo" className={inputStyle} onChange={(e) => setAdminEmail(e.target.value)} />
                <button onClick={() => adminEmail.includes('@') && setAdminAuth(true)} className="w-full bg-emerald-800 text-white p-3 rounded-xl font-bold">ENTRAR</button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="font-black text-2xl mb-6 flex items-center gap-2"><Settings/> Gestión de POES</h2>
                <input placeholder="Título" className={inputStyle} value={newPoes.title} onChange={e => setNewPoes({...newPoes, title: e.target.value})} />
                <textarea placeholder="Criterios (uno por línea)" className={inputStyle + " h-32"} value={newPoes.criteria} onChange={e => setNewPoes({...newPoes, criteria: e.target.value})} />
                <button onClick={addPoes} className="w-full bg-emerald-800 text-white p-4 rounded-xl font-black">GUARDAR NUEVO POES</button>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
```eof

Una vez pegado en tu VS Code, presiona `Ctrl + S`, vuelve a la terminal y ejecuta:

```bash
git add .
git commit -m "app consolidada final con POES y admin"
git push -u origin main