import React, { useState, useEffect, useRef } from 'react';
import {
  CheckCircle, XCircle, AlertTriangle, BarChart2, List, Printer, 
  FilePlus, AlertOctagon, Trash2, BookOpen, Image as ImageIcon, Settings, Plus, PenTool, Camera
} from 'lucide-react';

// ==========================================
// COMPONENTE DE FIRMA DIGITAL (CANVAS)
// ==========================================
const SignaturePad = ({ label, onSave, savedImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const getPos = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.clientX || (e.touches && e.touches[0].clientX);
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    return { x: clientX - rect.left, y: clientY - rect.top };
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

  const stop = () => {
    if (isDrawing) {
      setIsDrawing(false);
      onSave(canvasRef.current.toDataURL());
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-gray-100 rounded-3xl bg-white w-full shadow-sm">
      <span className="text-[10px] font-black uppercase mb-3 text-emerald-800 tracking-widest">{label}</span>
      {savedImage ? (
        <div className="relative w-full h-40 bg-gray-50 border rounded-2xl flex items-center justify-center overflow-hidden">
          <img src={savedImage} className="max-h-full" alt="Firma" />
          <button onClick={() => onSave(null)} className="absolute top-2 right-2 bg-red-100 text-red-600 p-2 rounded-full shadow-sm print:hidden hover:bg-red-200 transition-colors">
            <Trash2 size={16}/>
          </button>
        </div>
      ) : (
        <canvas
          ref={canvasRef}
          width={400}
          height={160}
          onMouseDown={start}
          onMouseMove={move}
          onMouseUp={stop}
          onMouseLeave={stop}
          onTouchStart={start}
          onTouchMove={move}
          onTouchEnd={stop}
          className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl cursor-crosshair w-full touch-none"
        />
      )}
      {!savedImage && <p className="text-[9px] text-gray-400 mt-2 font-bold uppercase italic">Firme con el dedo o mouse dentro del recuadro</p>}
    </div>
  );
};

// ==========================================
// BASE DE DATOS MAESTRA DE PROCEDIMIENTOS (SOPs)
// ==========================================
const initialSopDatabase = [
  {
    id: 'AG-IN-3', code: 'AG-IN-3', title: 'Control de Strategus aloeus', area: 'Agronomía',
    criteria: [
      { id: 'c1', d: 'Aprobación de presupuesto mensual de sanidad.' },
      { id: 'c2', d: 'Programación de áreas a censar/aplicar.' },
      { id: 'c3', d: 'Entrega de producto a unidades de apoyo.' },
      { id: 'c4', d: 'Uso correcto de EPIs y verificación de peligros.' },
      { id: 'c5', d: 'Señalización de entrada a parcelas.' },
      { id: 'c6', d: 'Recorrido en zig-zag y aplicación localizada.' },
      { id: 'c7', d: 'Triple lavado de envases y disposición ambiental.' },
      { id: 'c8', d: 'Registro de palmas tratadas (AG-FO-16).' }
    ]
  },
  {
    id: 'AG-FT-2', code: 'AG-FT-2', title: 'Cosecha de Racimos', area: 'Agronomía',
    criteria: [
      { id: 'c1', d: 'Madurez adecuada (mín. 1 fruto suelto Guineensis).' },
      { id: 'c2', d: 'Corte a ras del estípite y repique de hojas.' },
      { id: 'c3', d: 'Corte del pedúnculo a ras del racimo.' },
      { id: 'c4', d: 'Recolección de frutos en axilas y centro acopio.' },
      { id: 'c5', d: 'No evidencia de racimos verdes cortados.' },
      { id: 'c6', d: 'Calles y platos libres de hojas/obstáculos.' },
      { id: 'c7', d: 'Calidad: Pepa sin recoger máx 0.8/plato.' }
    ]
  },
  {
    id: 'PB-IN-10', code: 'PB-IN-10', title: 'Clarificación de Aceite', area: 'Planta',
    criteria: [
      { id: 'c1', d: 'Temperatura de agua entre 80 y 100 °C.' },
      { id: 'c2', d: 'Tanque de crudos con licor de prensa filtrado.' },
      { id: 'c3', d: 'Registro PG-FO-6 diligenciado cada hora.' },
      { id: 'c4', d: 'Alimentación constante de lodo a centrífugas.' },
      { id: 'c5', d: 'Purga de sedimentador cada 2 horas.' },
      { id: 'c6', d: 'Purga de ciclón desarenador cada 20 min.' },
      { id: 'c7', d: 'Cierre de válvulas de vapor al finalizar.' }
    ]
  },
  {
    id: 'AG-FT-5', code: 'AG-FT-5', title: 'Aplicación de Fertilizantes', area: 'Agronomía',
    criteria: [
      { id: 'c1', d: 'Personal con EPI completo (respiratoria/visual).' },
      { id: 'c2', d: 'Cargue de cantidad exacta según programa.' },
      { id: 'c3', d: 'Dosis aplicada con medidas calibradas.' },
      { id: 'c4', d: 'Suspensión de aplicación en zonas HCV (Ríos).' },
      { id: 'c5', d: 'Recolección de sacos vacíos para reciclaje.' }
    ]
  },
  {
    id: 'AG-FT-7', code: 'AG-FT-7', title: 'Polinización Asistida', area: 'Agronomía',
    criteria: [
      { id: 'c1', d: 'Técnica de mirada atrás en zig-zag.' },
      { id: 'c2', d: 'Identificación correcta de antesis/post-antesis.' },
      { id: 'c3', d: 'Limpieza de inflorescencia para acceso basal.' },
      { id: 'c4', d: 'Aplicación de ANA sólido técnica espiral.' },
      { id: 'c5', d: 'Marcación de hoja con fecha (Día/Mes).' }
    ]
  },
  {
    id: 'PB-IN-7', code: 'PB-IN-7', title: 'Recepción de Fruto', area: 'Planta',
    criteria: [
      { id: 'c1', d: 'Revisión de requisitos SST al ingreso.' },
      { id: 'c2', d: 'Control diario de cargue en báscula.' },
      { id: 'c3', d: 'Posicionamiento seguro en tolvas.' },
      { id: 'c4', d: 'Disponibilidad de Kit Anti-derrames.' }
    ]
  },
  {
    id: 'PB-IN-3', code: 'PB-IN-3', title: 'Manejo de Autoclaves', area: 'Planta',
    criteria: [
      { id: 'c1', d: 'Verificación de cierre de autoclave cargada.' },
      { id: 'c2', d: 'Ciclo según material (Híbrido 2 picos).' },
      { id: 'c3', d: 'Secuencia de válvulas desaireación.' },
      { id: 'c4', d: 'Respeto de picos de presión (30-40 PSI).' },
      { id: 'c5', d: 'Despresurización total antes de apertura.' }
    ]
  }
];

// ==========================================
// APLICACIÓN PRINCIPAL
// ==========================================
const App = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [auditInfo, setAuditInfo] = useState({
    farmName: '', lotArea: '', auditorName: '', operatorName: '', date: new Date().toISOString().split('T')[0], 
    sopId: '', conclusion: '', sigAuditor: null, sigOperator: null
  });
  const [checklist, setChecklist] = useState([]);

  // Persistencia de datos local (Offline)
  useEffect(() => {
    const saved = localStorage.getItem('audit_final_storage_v1');
    if (saved) {
      const parsed = JSON.parse(saved);
      setAuditInfo(parsed.auditInfo);
      setChecklist(parsed.checklist);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('audit_final_storage_v1', JSON.stringify({ auditInfo, checklist }));
  }, [auditInfo, checklist]);

  const handleSopSelection = (id) => {
    const selected = initialSopDatabase.find(s => s.id === id);
    if (selected) {
      setAuditInfo({ ...auditInfo, sopId: id });
      setChecklist(selected.criteria.map(c => ({
        id: c.id, description: c.d, status: 'pending', notes: '', photo: null
      })));
    }
  };

  const handleImage = (id, e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      setChecklist(prev => prev.map(item => item.id === id ? { ...item, photo: event.target.result } : item));
    };
    reader.readAsDataURL(file);
  };

  const stats = (() => {
    const total = checklist.length;
    const evaluated = checklist.filter(i => i.status !== 'pending').length;
    const compliant = checklist.filter(i => i.status === 'compliant').length;
    const score = evaluated > 0 ? Math.round((compliant / evaluated) * 100) : 0;
    return { score, total, evaluated };
  })();

  const commonInput = "p-3 border-2 border-gray-100 rounded-2xl bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-4 focus:ring-emerald-500/20 focus:border-emerald-500 w-full transition-all text-sm";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans selection:bg-emerald-100">
      
      {/* HEADER PROFESIONAL */}
      <header className="bg-emerald-800 text-white p-4 sticky top-0 z-50 shadow-xl border-b border-emerald-900 print:hidden">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-700 rounded-xl"><BookOpen size={24}/></div>
            <div>
              <h1 className="font-black text-sm uppercase tracking-tighter leading-none">Auditoría Técnica</h1>
              <p className="text-[10px] text-emerald-300 font-bold uppercase tracking-widest mt-1">RSPO · Sostenibilidad</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setActiveTab('checklist')} className={`p-3 rounded-2xl transition-all ${activeTab === 'checklist' ? 'bg-white text-emerald-800 shadow-lg scale-105' : 'bg-emerald-700 hover:bg-emerald-600'}`}><List size={20}/></button>
            <button onClick={() => setActiveTab('dashboard')} className={`p-3 rounded-2xl transition-all ${activeTab === 'dashboard' ? 'bg-white text-emerald-800 shadow-lg scale-105' : 'bg-emerald-700 hover:bg-emerald-600'}`}><BarChart2 size={20}/></button>
            <button onClick={() => window.print()} className="p-3 bg-emerald-700 rounded-2xl hover:bg-emerald-600"><Printer size={20}/></button>
            <button onClick={() => { if(confirm("¿Nueva Auditoría? Se borrará lo actual.")){ localStorage.clear(); window.location.reload(); } }} className="p-3 bg-red-600 rounded-2xl hover:bg-red-500 shadow-lg"><FilePlus size={20}/></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 w-full flex-grow">
        {activeTab === 'checklist' && (
          <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
            
            {/* SECCIÓN CONFIGURACIÓN */}
            <section className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-gray-100">
              <h2 className="text-[10px] font-black text-emerald-700 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                <Settings size={14}/> Datos Generales de la Visita
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <select value={auditInfo.sopId} onChange={e => handleSopSelection(e.target.value)} className={commonInput + " font-black bg-emerald-50 border-emerald-100 text-emerald-900"}>
                  <option value="">-- SELECCIONAR PROCEDIMIENTO (POES) --</option>
                  {initialSopDatabase.map(s => <option key={s.id} value={s.id}>{s.code} | {s.title}</option>)}
                </select>
                <input type="text" placeholder="Hacienda / Planta Extractora" value={auditInfo.farmName} onChange={e => setAuditInfo({...auditInfo, farmName: e.target.value})} className={commonInput} />
                <input type="text" placeholder="Auditor Líder" value={auditInfo.auditorName} onChange={e => setAuditInfo({...auditInfo, auditorName: e.target.value})} className={commonInput} />
                <input type="text" placeholder="Responsable de Área" value={auditInfo.operatorName} onChange={e => setAuditInfo({...auditInfo, operatorName: e.target.value})} className={commonInput} />
              </div>
            </section>

            {/* LISTA DE VERIFICACIÓN */}
            {auditInfo.sopId ? (
              <div className="space-y-4">
                <div className="bg-emerald-900 text-white p-5 rounded-t-[2rem] flex justify-between items-center shadow-lg">
                  <h3 className="font-black text-sm uppercase tracking-tight">Verificando: {initialSopDatabase.find(s => s.id === auditInfo.sopId)?.title}</h3>
                  <span className="bg-emerald-700 px-3 py-1 rounded-full text-[10px] font-black">{stats.evaluated}/{stats.total}</span>
                </div>
                <div className="bg-white border border-gray-100 rounded-b-[2rem] overflow-hidden shadow-sm divide-y divide-gray-50">
                  {checklist.map(item => (
                    <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors">
                      <p className="text-sm font-bold text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                      <div className="flex gap-2 mb-5 print:hidden">
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status:'compliant'} : i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${item.status === 'compliant' ? 'bg-emerald-600 text-white shadow-emerald-200 shadow-lg scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>Conforme</button>
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status:'non-compliant'} : i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase transition-all ${item.status === 'non-compliant' ? 'bg-red-600 text-white shadow-red-200 shadow-lg scale-105' : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}>No Conforme</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <textarea placeholder="Descripción del hallazgo o evidencia..." value={item.notes} onChange={e => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, notes: e.target.value} : i))} className={commonInput + " md:col-span-2 min-h-[80px]"} />
                        <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 min-h-[100px] relative transition-all hover:border-emerald-300">
                          {item.photo ? (
                            <div className="relative h-full w-full p-2">
                              <img src={item.photo} className="h-full w-full object-cover rounded-xl shadow-md" alt="Evidencia" />
                              <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, photo:null} : i))} className="absolute top-3 right-3 bg-red-600 text-white p-1 rounded-full shadow-lg print:hidden"><Trash2 size={12}/></button>
                            </div>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center text-gray-400 hover:text-emerald-600 transition-colors">
                              <Camera size={28}/>
                              <span className="text-[9px] font-black uppercase mt-2">Capturar Evidencia</span>
                              <input type="file" accept="image/*" capture="camera" className="hidden" onChange={e => handleImage(item.id, e)} />
                            </label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CONCLUSIÓN FINAL */}
                <section className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-emerald-100">
                  <h2 className="text-[10px] font-black text-emerald-700 uppercase mb-4 tracking-[0.2em] flex items-center gap-2">
                    <PenTool size={14}/> Dictamen Técnico Final (Consultoría)
                  </h2>
                  <textarea placeholder="Se sugiere..." value={auditInfo.conclusion} onChange={e => setAuditInfo({...auditInfo, conclusion: e.target.value})} className={commonInput + " h-32"} />
                </section>
              </div>
            ) : (
              <div className="text-center py-32 bg-white border-2 border-dashed border-gray-200 rounded-[3rem] text-gray-300">
                <ImageIcon size={60} className="mx-auto mb-4 opacity-20"/>
                <h3 className="font-black uppercase tracking-widest text-lg">Inicie la Auditoría</h3>
                <p className="text-xs font-bold mt-2">Seleccione un POES en el menú superior para comenzar el checklist</p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="space-y-6 animate-in fade-in duration-500">
            {/* SCORE CARD AUTOMATIZADA */}
            <div className={`p-12 rounded-[3.5rem] text-center shadow-2xl transition-all duration-700 ${stats.score >= 85 ? 'bg-emerald-900 text-white' : stats.score >= 55 ? 'bg-amber-500 text-white' : 'bg-red-700 text-white'}`}>
              <h2 className="text-8xl font-black tracking-tighter">{stats.score}%</h2>
              <div className="h-2 w-24 bg-white/20 mx-auto my-4 rounded-full"></div>
              <p className="uppercase font-black text-xs tracking-[0.5em] opacity-80">Nivel de Cumplimiento</p>
            </div>

            {/* TABLA DE RANGOS NORMATIVA */}
            <div className="bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden shadow-sm">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 font-black text-gray-400 uppercase tracking-widest border-b border-gray-100">
                  <tr><th className="p-5">Rango de Calificación</th><th className="p-5">Criterio Técnico</th><th className="p-5 text-right">Plazo Seguimiento</th></tr>
                </thead>
                <tbody className="font-bold divide-y divide-gray-50">
                  <tr className={stats.score <= 54 ? 'bg-red-50 text-red-700' : 'text-gray-400'}>
                    <td className="p-5">0% — 54%</td><td className="p-5 uppercase">No Cumple</td><td className="p-5 text-right">2 Meses</td>
                  </tr>
                  <tr className={(stats.score >= 55 && stats.score <= 84) ? 'bg-amber-50 text-amber-700' : 'text-gray-400'}>
                    <td className="p-5">55% — 84%</td><td className="p-5 uppercase">Cumplimiento Parcial</td><td className="p-5 text-right">6 Meses</td>
                  </tr>
                  <tr className={stats.score >= 85 ? 'bg-emerald-50 text-emerald-700' : 'text-gray-400'}>
                    <td className="p-5">85% — 100%</td><td className="p-5 uppercase">Cumple Estándar</td><td className="p-5 text-right">1 Año (Anual)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* SECCIÓN DE FIRMAS DIGITALES */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SignaturePad label="Firma del Auditor Líder" savedImage={auditInfo.sigAuditor} onSave={img => setAuditInfo({...auditInfo, sigAuditor: img})} />
              <SignaturePad label="Firma Responsable Auditado" savedImage={auditInfo.sigOperator} onSave={img => setAuditInfo({...auditInfo, sigOperator: img})} />
            </div>

            {/* VISTA PREVIA PARA IMPRESIÓN */}
            <div className="hidden print:block border-t-2 border-black mt-10 pt-6">
              <h4 className="font-black uppercase text-[10px] mb-2">Dictamen de Consultoría:</h4>
              <p className="text-sm italic text-gray-700 mb-10">{auditInfo.conclusion || 'Sin observaciones adicionales.'}</p>
              <div className="flex justify-between mt-20">
                <div className="w-64 border-t border-black text-center pt-2 font-black text-[10px] uppercase">Auditor: {auditInfo.auditorName}</div>
                <div className="w-64 border-t border-black text-center pt-2 font-black text-[10px] uppercase">Responsable: {auditInfo.operatorName}</div>
              </div>
            </div>
          </div>
        )}
      </main>

      <footer className="p-10 text-center text-[9px] font-black text-emerald-800 bg-emerald-50 uppercase tracking-[0.4em] border-t border-emerald-100 print:hidden">
        Diseñada bajo estándares RSPO por Nicolás S. Acosta & Gemini
      </footer>
    </div>
  );
};

export default App;