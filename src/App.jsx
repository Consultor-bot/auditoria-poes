import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, BarChart2, List, Printer, FilePlus, AlertOctagon, Trash2, BookOpen, ImageIcon, Settings, Plus, PenTool, Camera } from 'lucide-react';

// --- COMPONENTE DE FIRMA (SOPORTE TÁCTIL) ---
const SignaturePad = ({ label, onSave, savedImage }) => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const getPos = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
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
  const stop = () => { if (isDrawing) { setIsDrawing(false); onSave(canvasRef.current.toDataURL()); } };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-gray-100 rounded-3xl bg-white w-full">
      <span className="text-[10px] font-black uppercase mb-3 text-emerald-800 tracking-widest">{label}</span>
      {savedImage ? (
        <div className="relative w-full h-32 flex items-center justify-center border rounded-xl bg-gray-50">
          <img src={savedImage} className="max-h-full" alt="Firma" />
          <button onClick={() => onSave(null)} className="absolute top-1 right-1 bg-red-100 text-red-600 p-1 rounded-full print:hidden"><Trash2 size={12}/></button>
        </div>
      ) : (
        <canvas ref={canvasRef} width={300} height={120} onMouseDown={start} onMouseMove={move} onMouseUp={stop} onTouchStart={start} onTouchMove={move} onTouchEnd={stop} className="border rounded-lg w-full touch-none bg-gray-50" />
      )}
    </div>
  );
};

// ==========================================
// BASE DE DATOS MADRE (ORIGINAL SIN RECORTES)
// ==========================================
const initialSopDatabase = [
  {
    id: 'AG-IN-3', code: 'AG-IN-3', title: 'Control de Strategus aloeus', area: 'Agronomía (Campo)',
    criteria: [
      { id: 'c1', d: '1. Se cuenta con la aprobación del presupuesto mensual de las actividades de sanidad (Director/Subdirector).' },
      { id: 'c2', d: '2. Se programaron y asignaron las áreas a censar y aplicar según presupuesto (Órdenes de servicios y actas).' },
      { id: 'c3', d: '3. El Auxiliar entregó el producto a las unidades externas de apoyo (Evidencia: Salidas de sistema Enterprise).' },
      { id: 'c4', d: '4. Se usa correctamente los Elementos de Protección Individual y se verificó la ausencia de peligros (nidos, abejas, serpientes).' },
      { id: 'c5', d: '5. Se marcó la entrada a la parcela con la señalización entregada (todos los accesos marcados si aplica).' },
      { id: 'c6', d: '6. El recorrido se hace en zig-zag, inspeccionando desde la base, y la aplicación es localizada directamente en el orificio.' },
      { id: 'c7', d: '7. Manejo Ambiental: Envases con triple lavado entregados al área de Gestión Ambiental. Cero abandono de residuos en campo/fuentes hídricas.' },
      { id: 'c8', d: '8. El Auxiliar de sanidad verificó el tratamiento y registró el número de palmas tratadas en el formato AG-FO-16.' }
    ]
  },
  {
    id: 'AG-FT-2', code: 'AG-FT-2', title: 'Cosecha', area: 'Agronomía (Campo)',
    criteria: [
      { id: 'c1', d: '1. Se cosechan los racimos con la madurez adecuada (mín. 1 fruto desprendido en E. guineensis o 3 frutos en Híbrido) y se recogen los frutos desgranados del plato.' },
      { id: 'c2', d: '2. Se cortan a ras del estípite las hojas que impiden el corte del racimo, realizando el repique y disponiéndolas correctamente en la palera.' },
      { id: 'c3', d: '3. Se corta el pedúnculo a ras del racimo (No se evidencian racimos con pedúnculo largo).' },
      { id: 'c4', d: '4. Se recogen los frutos que quedan en las axilas de las hojas y se entregan en el centro de acopio.' },
      { id: 'c5', d: '5. Se verifica que NO hay racimos verdes cortados y que NO hay racimos maduros sin cosechar en las palmas.' },
      { id: 'c6', d: '6. Disposición de hojas: No hay hojas colgantes, picadas o cortadas sin encallar. Las calles y platos están libres de hojas y racimos cortados.' },
      { id: 'c7', d: '7. Cumplimiento de Calidad: Pepa sin recoger (máx 0.8/plato), Racimo verde (máx 0.2%), Pedúnculo largo (0%), Hoja mal encallada (0%).' },
      { id: 'c8', d: '8. Se registran las inconsistencias y hallazgos en los formatos AG-FO-5, AG-FO-7 o sistema Mobile y se informa al supervisor para el repaso.' }
    ]
  },
  {
    id: 'PB-IN-10', code: 'PB-IN-10', title: 'Clarificación', area: 'Planta Extractora (Molino)',
    criteria: [
      { id: 'c1', d: '1. Se calienta el agua del proceso a una temperatura entre 80 y 100 °C activando la electroválvula de vapor.' },
      { id: 'c2', d: '2. Se llena el tanque de crudos con el licor de prensa, verificando que pase por el tamiz.' },
      { id: 'c3', d: '3. Se diligencia el Registro de Clarificación permanente (PG-FO-6) cada hora durante el proceso.' },
      { id: 'c4', d: '4. Se controla la alimentación constante de lodo a las centrífugas y se verifica que no presenten vibración (destapar boquillas si aplica).' },
      { id: 'c5', d: '5. Se realiza la purga del tanque sedimentador, tanque de lodos y clarificadores cada 2 horas durante el turno.' },
      { id: 'c6', d: '6. Se realiza la purga del ciclón desarenador cada 15 a 20 minutos.' },
      { id: 'c7', d: '7. Al finalizar el proceso, se recupera toda la capa de aceite y se verifica que no pasen lodos de la línea de aceite.' },
      { id: 'c8', d: '8. Al finalizar, se cierran todas las válvulas de vapor y se apagan las bombas de aceite terminado y lodos.' }
    ]
  },
  {
    id: 'AG-FT-5', code: 'AG-FT-5', title: 'Aplicación de Fertilizantes', area: 'Agronomía (Campo)',
    criteria: [
      { id: 'c1', d: '1. El personal utiliza correctamente el EPI requerido (protección auditiva, respiratoria, visual, guantes y botas caña alta).' },
      { id: 'c2', d: '2. Se carga el vehículo con la cantidad exacta de fertilizante según el programa establecido.' },
      { id: 'c3', d: '3. (Manual) Se aplica la dosis estipulada en el plato utilizando medidas calibradas previamente.' },
      { id: 'c4', d: '4. (Mecánica) La boleadora está correctamente equipada y se realizó calibración previa.' },
      { id: 'c5', d: '5. Manejo Ambiental (HCV): Se suspende la aplicación de fertilizantes químicos en las palmas cercanas a fuentes hídricas.' },
      { id: 'c6', d: '6. No se evidencian derrames excesivos de producto durante el transporte o en los puntos de recarga.' },
      { id: 'c7', d: '7. Los empaques y sacos vacíos son recogidos y dispuestos para el reciclaje según el plan ambiental.' }
    ]
  },
  {
    id: 'AG-FT-7', code: 'AG-FT-7', title: 'Polinización Asistida', area: 'Agronomía (Campo)',
    criteria: [
      { id: 'c1', d: '1. El operario utiliza EPI completo: Botas, guantes, gafas, protección respiratoria, pantalón y camisa manga larga.' },
      { id: 'c2', d: '2. Búsqueda de flor: El recorrido se realiza en Zig-Zag, aplicando técnica de "Mirada atrás".' },
      { id: 'c3', d: '3. Identificación: Se identifica correctamente el estado de la flor (antesis, post-antesis).' },
      { id: 'c4', d: '4. Destape: Se realiza la limpieza retirando material que impida el acceso (abajo, lados y atrás a tope).' },
      { id: 'c5', d: '5. Aplicación: Se esparce el ANA sólido con la técnica adecuada (inserción basal y espiral).' },
      { id: 'c6', d: '6. Marcación: Se marca correctamente la hoja indicando fecha (Día/Mes) o marca X para post-antesis.' },
      { id: 'c7', d: '7. Se diligencia correctamente el reporte diario de inflorescencias (AG-FO-23).' },
      { id: 'c8', d: '8. El auditor diligencia la Evaluación Diaria de Polinización (AG-FO-25) o en sistema Mobile.' }
    ]
  },
  {
    id: 'PB-IN-7', code: 'PB-IN-7', title: 'Recepción de Fruto', area: 'Planta Extractora (Molino)',
    criteria: [
      { id: 'c1', d: '1. Se verifica el cumplimiento de los requisitos de SST (EPI, inducción) previo al ingreso.' },
      { id: 'c2', d: '2. El operario de báscula solicita y revisa el registro de control diario de cargue de fruto.' },
      { id: 'c3', d: '3. El operario de tolvas coordina el ingreso y posicionamiento seguro de los vehículos.' },
      { id: 'c4', d: '4. El personal utiliza el EPI requerido y acata las normas de seguridad mecánica.' },
      { id: 'c5', d: '5. Manejo Ambiental: Se recogen los residuos del fruto esparcidos y se disponen residuos sólidos en puntos ecológicos.' },
      { id: 'c6', d: '6. Se cuenta con disponibilidad inmediata y fácil acceso al Kit Anti-derrame en la zona.' }
    ]
  },
  {
    id: 'PB-IN-3', code: 'PB-IN-3', title: 'Manejo de Autoclaves (Esterilización)', area: 'Planta Extractora (Molino)',
    criteria: [
      { id: 'c1', d: '1. Se verifica visualmente que la autoclave esté cargada de fruto y debidamente cerrada.' },
      { id: 'c2', d: '2. Se establece el tiempo del ciclo basándose en la madurez y tipo de material (Híbrido 2 picos / Comercial 3 picos).' },
      { id: 'c3', d: '3. Se ejecuta correctamente la secuencia de válvulas para desaireación (condensados, venteo, expansión).' },
      { id: 'c4', d: '4. Se respetan los picos de presión (subir a 30 PSI, bajar a 10 PSI) en el orden estricto.' },
      { id: 'c5', d: '5. Durante la fase de máxima presión (40 PSI), se realiza purga de condensados manteniendo estable la presión.' },
      { id: 'c6', d: '6. Se despresuriza completamente (condensados, vapor, venteo) antes de proceder a desocupar.' },
      { id: 'c7', d: '7. El operario diligencia oportunamente el formato de control de esterilización (PB-FO-04).' }
    ]
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [auditInfo, setAuditInfo] = useState({ farmName:'', lotArea:'', auditorName:'', operatorName:'', date: new Date().toISOString().split('T')[0], sopId:'', conclusion:'', sigAuditor:null, sigOperator:null });
  const [checklist, setChecklist] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('audit_final_vMaster');
    if (saved) { const p = JSON.parse(saved); setAuditInfo(p.auditInfo); setChecklist(p.checklist); }
  }, []);

  useEffect(() => { localStorage.setItem('audit_final_vMaster', JSON.stringify({ auditInfo, checklist })); }, [auditInfo, checklist]);

  const handleSop = (id) => {
    const s = initialSopDatabase.find(x => x.id === id);
    if (s) {
      setAuditInfo({...auditInfo, sopId: id});
      setChecklist(s.criteria.map(c => ({ id: c.id, description: c.d, status: 'pending', notes: '', photo: null })));
    }
  };

  const handleImg = (id, e) => {
    const r = new FileReader();
    r.onload = (ev) => setChecklist(prev => prev.map(i => i.id === id ? { ...i, photo: ev.target.result } : i));
    r.readAsDataURL(e.target.files[0]);
  };

  const stats = (() => {
    const evaluated = checklist.filter(i => i.status !== 'pending').length;
    const ok = checklist.filter(i => i.status === 'compliant').length;
    return { score: evaluated > 0 ? Math.round((ok / evaluated) * 100) : 0 };
  })();

  const inputStyle = "p-3 border border-gray-300 rounded-xl bg-white text-gray-900 w-full text-sm outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="bg-emerald-800 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg print:hidden">
        <h1 className="font-bold text-sm uppercase tracking-tighter flex items-center gap-2"><BookOpen size={20}/> Auditoría RSPO</h1>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('checklist')} className={`p-2 rounded-lg ${activeTab==='checklist'?'bg-white text-emerald-800 shadow-md':'bg-emerald-700'}`}><List size={20}/></button>
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab==='dashboard'?'bg-white text-emerald-800 shadow-lg':'bg-emerald-700'}`}><BarChart2 size={20}/></button>
          <button onClick={() => window.print()} className="p-2 bg-emerald-700 rounded-lg"><Printer size={20}/></button>
          <button onClick={() => {if(confirm("¿Nueva Auditoría?")) {localStorage.clear(); window.location.reload();}}} className="p-2 bg-red-600 rounded-lg"><FilePlus size={20}/></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 w-full flex-grow">
        
        {/* VISTA CHECKLIST */}
        <div className={`${activeTab === 'checklist' ? 'block' : 'hidden print:block'} space-y-6`}>
            <section className="bg-white p-6 rounded-3xl shadow-sm border space-y-4 print:border-none print:shadow-none">
              <div className="print:hidden">
                <select value={auditInfo.sopId} onChange={e => handleSop(e.target.value)} className={inputStyle + " font-black bg-emerald-50 text-emerald-900"}>
                    <option value="">-- SELECCIONAR PROCEDIMIENTO --</option>
                    {initialSopDatabase.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                </select>
              </div>
              <div className="hidden print:block font-black text-emerald-800 text-lg border-b-2 border-emerald-800 pb-2 mb-4">
                {initialSopDatabase.find(s => s.id === auditInfo.sopId)?.code} - {initialSopDatabase.find(s => s.id === auditInfo.sopId)?.title}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Finca / Planta</span><input type="text" className={inputStyle} value={auditInfo.farmName} onChange={e=>setAuditInfo({...auditInfo, farmName:e.target.value})} /></div>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Lote / Área</span><input type="text" className={inputStyle} value={auditInfo.lotArea} onChange={e=>setAuditInfo({...auditInfo, lotArea:e.target.value})} /></div>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Auditor Responsable</span><input type="text" className={inputStyle} value={auditInfo.auditorName} onChange={e=>setAuditInfo({...auditInfo, auditorName:e.target.value})} /></div>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Operario Auditado</span><input type="text" className={inputStyle} value={auditInfo.operatorName} onChange={e=>setAuditInfo({...auditInfo, operatorName:e.target.value})} /></div>
              </div>
            </section>

            {checklist.length > 0 && (
              <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm divide-y print:border-none print:shadow-none">
                {checklist.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors print:break-inside-avoid print:py-4">
                    <p className="text-sm font-bold text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex gap-2 mb-4 print:hidden">
                      <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'compliant'}:i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black ${item.status==='compliant'?'bg-emerald-600 text-white shadow-lg':'bg-gray-100 text-gray-400'}`}>CONFORME</button>
                      <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'non-compliant'}:i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black ${item.status==='non-compliant'?'bg-red-600 text-white shadow-lg':'bg-gray-100 text-gray-400'}`}>NO CONFORME</button>
                    </div>
                    <div className="hidden print:block font-bold text-xs mb-2 italic">
                        RESULTADO: {item.status === 'compliant' ? '✅ CONFORME' : item.status === 'non-compliant' ? '❌ NO CONFORME' : '---'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400 print:hidden">Observaciones</span><textarea className={inputStyle + " h-20"} value={item.notes} onChange={e=>setChecklist(checklist.map(i=>i.id===item.id?{...i, notes:e.target.value}:i))} /></div>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 min-h-[100px] relative print:border-none">
                        {item.photo ? (
                          <><img src={item.photo} className="h-full w-full object-cover rounded-xl" /><button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, photo:null}:i))} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full print:hidden"><Trash2 size={12}/></button></>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center text-gray-400 print:hidden"><Camera size={24}/><input type="file" accept="image/*" capture="camera" className="hidden" onChange={e=>{const r=new FileReader(); r.onload=(ev)=>setChecklist(prev=>prev.map(i=>i.id===item.id?{...i, photo:ev.target.result}:i)); r.readAsDataURL(e.target.files[0]);}} /></label>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {auditInfo.sopId && (
              <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 print:border-none print:shadow-none">
                <h3 className="text-[10px] font-black text-emerald-700 uppercase mb-4 flex items-center gap-2"><PenTool size={14}/> Dictamen Técnico Final (Consultoría)</h3>
                <textarea className={inputStyle + " h-32 print:h-auto print:italic"} value={auditInfo.conclusion} onChange={e=>setAuditInfo({...auditInfo, conclusion:e.target.value})} />
              </section>
            )}
        </div>

        {/* VISTA DASHBOARD */}
        <div className={`${activeTab === 'dashboard' ? 'block' : 'hidden print:block'} space-y-6 print:break-before-page print:mt-10`}>
            <div className={`p-12 rounded-[3.5rem] text-center shadow-2xl print:border-2 ${stats.score>=85?'bg-emerald-900 text-white print:border-emerald-900 print:text-emerald-900':stats.score>=55?'bg-amber-500 text-white print:border-amber-500 print:text-amber-500':'bg-red-700 text-white print:border-red-700 print:text-red-700'}`}>
              <h2 className="text-8xl font-black print:text-5xl">{stats.score}%</h2>
              <p className="uppercase text-[10px] font-bold tracking-[0.4em] opacity-80 mt-2">Cumplimiento Global</p>
            </div>

            <div className="bg-white rounded-[2.5rem] border overflow-hidden shadow-sm print:border-none print:shadow-none">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-100 font-black text-gray-400 uppercase border-b">
                  <tr><th className="p-5">Rango</th><th className="p-5">Criterio</th><th className="p-5 text-right">Plazo Seguimiento</th></tr>
                </thead>
                <tbody className="font-bold divide-y divide-gray-50">
                  <tr className={stats.score <= 54 ? 'bg-red-600 text-white' : 'text-red-600'}> 
                    <td className="p-5">0% - 54%</td><td className="p-5 uppercase">No cumple</td><td className="p-5 text-right">2 Meses</td> 
                  </tr>
                  <tr className={(stats.score >= 55 && stats.score <= 84) ? 'bg-amber-500 text-white' : 'text-amber-600'}> 
                    <td className="p-5">55% - 84%</td><td className="p-5 uppercase">Parcial</td><td className="p-5 text-right">6 Meses</td> 
                  </tr>
                  <tr className={stats.score >= 85 ? 'bg-emerald-600 text-white' : 'text-emerald-700'}> 
                    <td className="p-5">85% - 100%</td><td className="p-5 uppercase">Cumple</td><td className="p-5 text-right">1 Año (Anual)</td> 
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-10">
              <SignaturePad label="Firma Auditor Responsable" savedImage={auditInfo.sigAuditor} onSave={img=>setAuditInfo({...auditInfo, sigAuditor:img})} />
              <SignaturePad label="Firma Operario Auditado" savedImage={auditInfo.sigOperator} onSave={img=>setAuditInfo({...auditInfo, sigOperator:img})} />
            </div>
          </div>
      </main>
      <footer className="p-10 text-center text-[9px] font-black text-emerald-800 bg-emerald-50 uppercase tracking-[0.4em] border-t print:hidden">Diseñada por Nicolás S. Acosta · Consultoría Técnica</footer>
    </div>
  );
};

export default App;