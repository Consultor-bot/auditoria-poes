import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, BarChart2, Settings, Printer, FilePlus, Trash2, Camera, PenTool, CheckCircle, XCircle, PalmTree } from 'lucide-react';

// --- BASE DE DATOS INICIAL ---
const initialSops = [
  { id: '1', code: 'PB-IN-15', title: 'Esterilización Línea 2', area: 'Planta', criteria: ['El operario conoce el objetivo.', 'Se verifica ausencia de personal.', 'El esterilizador se llena adecuadamente.', 'El ciclo se ejecuta conforme al instructivo.'] },
  { id: '2', code: 'AG-IN-3', title: 'Control de Strategus aloeus', area: 'Agronomía', criteria: ['Aprobación del presupuesto.', 'Recorrido en zig-zag.', 'Envases con triple lavado.'] },
  { id: '3', code: 'AG-FT-2', title: 'Cosecha', area: 'Agronomía', criteria: ['Racimos con madurez adecuada.', 'Corte del pedúnculo a ras.', 'Calles y platos limpios.'] }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('verificacion');
  const [sops, setSops] = useState(() => JSON.parse(localStorage.getItem('poes_db') || JSON.stringify(initialSops)));
  const [auditInfo, setAuditInfo] = useState({ sopId: '', auditorName: '', sigAuditor: null });
  const [checklist, setChecklist] = useState([]);

  // Guardar cambios en local
  useEffect(() => { localStorage.setItem('poes_db', JSON.stringify(sops)); }, [sops]);

  const handleSopSelect = (id) => {
    const s = sops.find(x => x.id === id);
    if (s) {
      setAuditInfo({...auditInfo, sopId: id});
      setChecklist(s.criteria.map((c, idx) => ({ id: idx, description: c, status: 'pending' })));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-emerald-800 text-white p-4 shadow-lg print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2 font-black text-lg uppercase tracking-tight">
            <PalmTree /> Seguimiento a POES
          </div>
          <div className="flex bg-emerald-900 rounded-lg p-1">
            <button onClick={() => setActiveTab('verificacion')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'verificacion' ? 'bg-white text-emerald-800' : 'text-white'}`}>Verificación</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-md font-bold ${activeTab === 'dashboard' ? 'bg-white text-emerald-800' : 'text-white'}`}>Dashboard</button>
            <button onClick={() => window.print()} className="px-4 py-2 text-white"><Printer size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6">
        {activeTab === 'verificacion' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
              <select onChange={e => handleSopSelect(e.target.value)} className="w-full p-3 border-2 border-emerald-500 rounded-lg font-black mb-4">
                <option value="">-- SELECCIONAR PROCEDIMIENTO --</option>
                {sops.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
              </select>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input type="text" placeholder="Finca / Planta" className="w-full p-2 border rounded-md" />
                <input type="date" className="w-full p-2 border rounded-md" />
              </div>
            </div>

            {checklist.map((item, idx) => (
              <div key={idx} className="bg-white p-6 rounded-xl border flex items-center justify-between">
                <p className="font-bold text-sm w-2/3">{item.description}</p>
                <div className="flex gap-2">
                  <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'ok'} : c))} className={`p-3 rounded-xl ${item.status === 'ok' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}><CheckCircle size={20}/></button>
                  <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'fail'} : c))} className={`p-3 rounded-xl ${item.status === 'fail' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}><XCircle size={20}/></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <footer className="text-center p-6 text-[10px] font-black text-emerald-800 uppercase tracking-widest">
        DISEÑADA POR NICOLAS S. ACOSTA
      </footer>
    </div>
  );
}