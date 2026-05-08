import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, BarChart2, List, Printer, FilePlus, AlertOctagon, Trash2, BookOpen, Image as ImageIcon, PenTool } from 'lucide-react';

const SignaturePad = ({ label, onSave, savedImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = (e.clientX || e.touches[0].clientX) - rect.left;
    const y = (e.clientY || e.touches[0].clientY) - rect.top;
    return { x, y };
  };
  const start = (e) => {
    const { x, y } = getPos(e);
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#000';
    ctx.beginPath(); ctx.moveTo(x, y);
    setIsDrawing(true);
  };
  const move = (e) => {
    if (!isDrawing) return;
    const { x, y } = getPos(e);
    canvasRef.current.getContext('2d').lineTo(x, y);
    canvasRef.current.getContext('2d').stroke();
    if (e.touches) e.preventDefault();
  };
  const stop = () => { if (isDrawing) { setIsDrawing(false); onSave(canvasRef.current.toDataURL()); } };

  return (
    <div className="flex flex-col items-center p-3 border rounded-2xl bg-white w-full shadow-sm">
      <span className="text-[10px] font-black uppercase mb-2 text-emerald-800">{label}</span>
      {savedImage ? (
        <div className="relative w-full h-32 flex items-center justify-center border rounded-lg bg-gray-50">
          <img src={savedImage} className="max-h-full" alt="Firma" />
          <button onClick={() => onSave(null)} className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full"><Trash2 size={12}/></button>
        </div>
      ) : (
        <canvas ref={canvasRef} width={300} height={120} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onTouchStart={start} onTouchMove={move} onTouchEnd={stop} className="border rounded-lg w-full touch-none bg-gray-50" />
      )}
    </div>
  );
};

const App = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [auditInfo, setAuditInfo] = useState({ farmName:'', auditorName:'', operatorName:'', sopId:'', conclusion:'', sigAuditor:null, sigOperator:null });
  const [checklist, setChecklist] = useState([]);
  const sops = [{ id:'1', code:'POES-01', title:'Limpieza y Desinfección', criteria:[{id:'c1', d:'Superficies limpias'},{id:'c2', d:'Concentración de químicos'}] }];

  const stats = (() => {
    const evalItems = checklist.filter(i => i.status !== 'pending').length;
    const ok = checklist.filter(i => i.status === 'compliant').length;
    return { score: evalItems > 0 ? Math.round((ok / evalItems) * 100) : 0 };
  })();

  const inputStyle = "p-3 border border-gray-300 rounded-lg bg-white text-gray-900 w-full text-sm focus:ring-2 focus:ring-emerald-500 outline-none";

  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 flex flex-col font-sans">
      <header className="bg-emerald-800 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg print:hidden">
        <h1 className="font-bold text-sm uppercase tracking-tighter">Auditoría RSPO</h1>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('checklist')} className={`p-2 rounded ${activeTab==='checklist'?'bg-white text-emerald-800':''}`}><List size={20}/></button>
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded ${activeTab==='dashboard'?'bg-white text-emerald-800':''}`}><BarChart2 size={20}/></button>
          <button onClick={() => window.print()} className="p-2"><Printer size={20}/></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 w-full flex-grow">
        {activeTab === 'checklist' ? (
          <div className="space-y-4">
            <div className="bg-white p-5 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-3">
              <input type="text" placeholder="Finca / Planta" className={inputStyle} value={auditInfo.farmName} onChange={e=>setAuditInfo({...auditInfo, farmName:e.target.value})} />
              <input type="text" placeholder="Auditor" className={inputStyle} value={auditInfo.auditorName} onChange={e=>setAuditInfo({...auditInfo, auditorName:e.target.value})} />
              <button onClick={() => setChecklist(sops[0].criteria.map(c=>({...c, status:'pending', notes:'', photo:null})))} className="bg-emerald-600 text-white p-3 rounded-lg font-bold text-xs uppercase">Iniciar Formulario</button>
            </div>
            {checklist.map(item => (
              <div key={item.id} className="bg-white p-4 rounded-xl border border-gray-200">
                <p className="font-bold text-sm mb-3">{item.d}</p>
                <div className="flex gap-2">
                  <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'compliant'}:i))} className={`flex-1 p-2 rounded-lg text-[10px] font-black ${item.status==='compliant'?'bg-emerald-600 text-white':'bg-gray-100 text-gray-400'}`}>CUMPLE</button>
                  <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'non-compliant'}:i))} className={`flex-1 p-2 rounded-lg text-[10px] font-black ${item.status==='non-compliant'?'bg-red-600 text-white':'bg-gray-100 text-gray-400'}`}>NO CUMPLE</button>
                </div>
              </div>
            ))}
            <div className="bg-white p-5 rounded-2xl border border-emerald-100">
              <h3 className="text-xs font-black text-emerald-700 uppercase mb-2">Conclusión del Consultor</h3>
              <textarea className={inputStyle + " h-24"} value={auditInfo.conclusion} onChange={e=>setAuditInfo({...auditInfo, conclusion:e.target.value})} />
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className={`p-10 rounded-3xl text-center shadow-xl ${stats.score>=85?'bg-emerald-800 text-white':stats.score>=55?'bg-yellow-500 text-white':'bg-red-700 text-white'}`}>
              <h2 className="text-6xl font-black">{stats.score}%</h2>
              <p className="uppercase text-[10px] mt-2 font-bold tracking-widest">Resultado Final</p>
            </div>
            <table className="w-full text-left text-xs bg-white rounded-xl border overflow-hidden">
              <thead className="bg-gray-100 font-black"><tr><th className="p-3">Rango</th><th className="p-3">Estado</th><th className="p-3">Plazo</th></tr></thead>
              <tbody className="font-bold divide-y">
                <tr className={stats.score<=54?'bg-red-50 text-red-700':''}> <td className="p-3">0-54%</td><td className="p-3">No cumple</td><td className="p-3">2 Meses</td> </tr>
                <tr className={stats.score>=55&&stats.score<=84?'bg-yellow-50 text-yellow-700':''}> <td className="p-3">55-84%</td><td className="p-3">Parcial</td><td className="p-3">6 Meses</td> </tr>
                <tr className={stats.score>=85?'bg-emerald-50 text-emerald-700':''}> <td className="p-3">85-100%</td><td className="p-3">Cumple</td><td className="p-3">1 Año</td> </tr>
              </tbody>
            </table>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <SignaturePad label="Firma Auditor" savedImage={auditInfo.sigAuditor} onSave={img=>setAuditInfo({...auditInfo, sigAuditor:img})} />
              <SignaturePad label="Firma Operario" savedImage={auditInfo.sigOperator} onSave={img=>setAuditInfo({...auditInfo, sigOperator:img})} />
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default App;