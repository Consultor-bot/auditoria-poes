import React, { useState } from 'react';
import { BookOpen, BarChart2, Settings, Printer, CheckCircle, XCircle, Trash2, Camera, PalmTree } from 'lucide-react';

// --- BASE DE DATOS DE POES ---
const sopsDatabase = [
  { id: '1', title: 'Esterilización Línea 2', criteria: ['Verificar autoclave cerrada', 'Secuencia de válvulas correcta', 'Presión establecida', 'Diligenciar registro PB-FO-04'] },
  { id: '2', title: 'Control de Strategus aloeus', criteria: ['Aprobación presupuesto', 'Recorrido en zig-zag', 'Envases con triple lavado', 'Uso de EPP'] },
  { id: '3', title: 'Cosecha', criteria: ['Madurez adecuada', 'Corte de pedúnculo a ras', 'Calles libres de residuos'] }
];

export default function App() {
  const [activeTab, setActiveTab] = useState('verificacion');
  const [selectedSop, setSelectedSop] = useState(null);
  const [checklist, setChecklist] = useState([]);

  const handleSopChange = (e) => {
    const sop = sopsDatabase.find(s => s.id === e.target.value);
    setSelectedSop(sop);
    setChecklist(sop ? sop.criteria.map((c, i) => ({ id: i, text: c, status: 'pending' })) : []);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      <header className="bg-emerald-800 text-white p-4 shadow-lg">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <h1 className="font-bold text-lg flex items-center gap-2"><BookOpen /> Auditoría POES RSPO</h1>
          <nav className="flex gap-2">
            <button onClick={() => setActiveTab('verificacion')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'verificacion' ? 'bg-white text-emerald-800' : 'bg-emerald-900'}`}>Verificación</button>
            <button onClick={() => setActiveTab('dashboard')} className={`px-4 py-2 rounded-lg font-bold ${activeTab === 'dashboard' ? 'bg-white text-emerald-800' : 'bg-emerald-900'}`}>Dashboard</button>
          </nav>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-6 space-y-6">
        {activeTab === 'verificacion' && (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-xl border shadow-sm">
              <label className="text-[10px] font-black uppercase text-gray-400">Seleccionar Procedimiento</label>
              <select onChange={handleSopChange} className="w-full p-3 border-2 border-emerald-500 rounded-lg font-black mt-2 mb-4">
                <option value="">-- SELECCIONAR --</option>
                {sopsDatabase.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
              </select>
            </div>

            {selectedSop ? (
              checklist.map((item, idx) => (
                <div key={idx} className="bg-white p-6 rounded-xl border flex items-center justify-between shadow-sm">
                  <p className="font-bold text-sm text-gray-700">{item.text}</p>
                  <div className="flex gap-2">
                    <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'ok'} : c))} className={`p-3 rounded-xl ${item.status === 'ok' ? 'bg-emerald-600 text-white' : 'bg-gray-100'}`}><CheckCircle size={20}/></button>
                    <button onClick={() => setChecklist(prev => prev.map((c, i) => i === idx ? {...c, status: 'fail'} : c))} className={`p-3 rounded-xl ${item.status === 'fail' ? 'bg-red-600 text-white' : 'bg-gray-100'}`}><XCircle size={20}/></button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-20 text-gray-400 font-black border-4 border-dashed rounded-xl uppercase tracking-widest">
                SELECCIONA UN POES PARA INICIAR
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}