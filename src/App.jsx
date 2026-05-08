import React, { useState, useEffect } from 'react';
import {
  CheckCircle,
  XCircle,
  Clock,
  Save,
  AlertTriangle,
  FileText,
  BarChart2,
  List,
  ChevronDown,
  ChevronUp,
  Printer,
  FilePlus,
  AlertOctagon,
  Camera,
  Trash2,
  BookOpen,
  Image as ImageIcon,
  Settings,
  Plus
} from 'lucide-react';

const initialSopDatabase = [
  {
    id: 'AG-IN-3',
    code: 'AG-IN-3',
    title: 'Control de Strategus aloeus',
    area: 'Agronomía (Campo)',
    version: '4',
    criteria: [
      { id: 'c1', description: '1. Se cuenta con la aprobación del presupuesto mensual de las actividades de sanidad (Director/Subdirector).' },
      { id: 'c2', description: '2. Se programaron y asignaron las áreas a censar y aplicar según presupuesto (Órdenes de servicios y actas).' },
      { id: 'c3', description: '3. El Auxiliar entregó el producto a las unidades externas de apoyo (Evidencia: Salidas de sistema Enterprise).' },
      { id: 'c4', description: '4. Se usa correctamente los Elementos de Protección Individual y se verificó la ausencia de peligros (nidos, abejas, serpientes).' },
      { id: 'c5', description: '5. Se marcó la entrada a la parcela con la señalización entregada (todos los accesos marcados si aplica).' },
      { id: 'c6', description: '6. El recorrido se hace en zig-zag, inspeccionando desde la base, y la aplicación es localizada directamente en el orificio.' },
      { id: 'c7', description: '7. Manejo Ambiental: Envases con triple lavado entregados al área de Gestión Ambiental. Cero abandono de residuos en campo/fuentes hídricas.' },
      { id: 'c8', description: '8. El Auxiliar de sanidad verificó el tratamiento y registró el número de palmas tratadas en el formato AG-FO-16.' }
    ]
  },
  {
    id: 'AG-FT-2',
    code: 'AG-FT-2',
    title: 'Cosecha',
    area: 'Agronomía (Campo)',
    version: '16',
    criteria: [
      { id: 'c1', description: '1. Se cosechan los racimos con la madurez adecuada (mín. 1 fruto desprendido en E. guineensis o 3 frutos en Híbrido) y se recogen los frutos desgranados del plato.' },
      { id: 'c2', description: '2. Se cortan a ras del estípite las hojas que impiden el corte del racimo, realizando el repique y disponiéndolas correctamente en la palera.' },
      { id: 'c3', description: '3. Se corta el pedúnculo a ras del racimo (No se evidencian racimos con pedúnculo largo).' },
      { id: 'c4', description: '4. Se recogen los frutos que quedan en las axilas de las hojas y se entregan en el centro de acopio.' },
      { id: 'c5', description: '5. Se verifica que NO hay racimos verdes cortados y que NO hay racimos maduros sin cosechar en las palmas.' },
      { id: 'c6', description: '6. Disposición de hojas: No hay hojas colgantes, picadas o cortadas sin encallar. Las calles y platos están libres de hojas y racimos cortados.' },
      { id: 'c7', description: '7. Cumplimiento de Calidad: Pepa sin recoger (máx 0.8/plato), Racimo verde (máx 0.2%), Pedúnculo largo (0%), Hoja mal encallada (0%).' },
      { id: 'c8', description: '8. Se registran las inconsistencias y hallazgos en los formatos AG-FO-5, AG-FO-7 o sistema Mobile y se informa al supervisor para el repaso.' }
    ]
  },
  {
    id: 'PB-IN-10',
    code: 'PB-IN-10',
    title: 'Clarificación',
    area: 'Planta Extractora (Molino)',
    version: '1',
    criteria: [
      { id: 'c1', description: '1. Se calienta el agua del proceso a una temperatura entre 80 y 100 °C activando la electroválvula de vapor.' },
      { id: 'c2', description: '2. Se llena el tanque de crudos con el licor de prensa, verificando que pase por el tamiz.' },
      { id: 'c3', description: '3. Se diligencia el Registro de Clarificación permanente (PG-FO-6) cada hora durante el proceso.' },
      { id: 'c4', description: '4. Se controla la alimentación constante de lodo a las centrífugas y se verifica que no presenten vibración (destapar boquillas si aplica).' },
      { id: 'c5', description: '5. Se realiza la purga del tanque sedimentador, tanque de lodos y clarificadores cada 2 horas durante el turno.' },
      { id: 'c6', description: '6. Se realiza la purga del ciclón desarenador cada 15 a 20 minutos.' },
      { id: 'c7', description: '7. Al finalizar el proceso, se recupera toda la capa de aceite y se verifica que no pasen lodos de la línea de aceite.' },
      { id: 'c8', description: '8. Al finalizar, se cierran todas las válvulas de vapor y se apagan las bombas de aceite terminado y lodos.' }
    ]
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [showNewAuditModal, setShowNewAuditModal] = useState(false);
  const [showChangeSOPModal, setShowChangeSOPModal] = useState(false);
  const [pendingSopChange, setPendingSopChange] = useState(null);
  const [auditInfo, setAuditInfo] = useState({
    farmName: '', lotArea: '', auditorName: '', operatorName: '', date: new Date().toISOString().split('T')[0], sopId: '' 
  });
  const [checklist, setChecklist] = useState([]);
  const [sops, setSops] = useState([]);
  const [isCreatingSop, setIsCreatingSop] = useState(false);
  const [newSop, setNewSop] = useState({
    code: '', title: '', area: 'Agronomía (Campo)', version: '1', criteria: [{ id: 'c1', description: '' }]
  });

  useEffect(() => {
    const storedSops = localStorage.getItem('rspo_custom_sops_v7');
    setSops(storedSops ? JSON.parse(storedSops) : initialSopDatabase);
    const savedData = localStorage.getItem('rspoAuditData_vFinal7');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.auditInfo) setAuditInfo(parsedData.auditInfo);
        if (parsedData.checklist) setChecklist(parsedData.checklist);
      } catch (e) { console.error(e); }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('rspoAuditData_vFinal7', JSON.stringify({ auditInfo, checklist }));
  }, [auditInfo, checklist]);

  useEffect(() => {
    if (sops.length > 0) localStorage.setItem('rspo_custom_sops_v7', JSON.stringify(sops));
  }, [sops]);

  const applySopChange = (sopId) => {
    setAuditInfo({ ...auditInfo, sopId: sopId });
    if (!sopId) { setChecklist([]); setShowChangeSOPModal(false); return; }
    const selectedSOP = sops.find(s => s.id === sopId);
    if (selectedSOP) {
      setChecklist(selectedSOP.criteria.map(c => ({
        id: `${sopId}-${c.id}`,
        description: c.description,
        status: 'pending', notes: '', photo: null
      })));
    }
    setShowChangeSOPModal(false);
  };

  const handleSopChangeRequest = (id) => {
    if (checklist.some(c => c.status !== 'pending') && id !== auditInfo.sopId) {
      setPendingSopChange(id);
      setShowChangeSOPModal(true);
    } else applySopChange(id);
  };

  const handleImageUpload = (id, event) => {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX_WIDTH = 800;
        const scaleSize = MAX_WIDTH / img.width;
        canvas.width = scaleSize < 1 ? MAX_WIDTH : img.width;
        canvas.height = scaleSize < 1 ? img.height * scaleSize : img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setChecklist(prev => prev.map(item => item.id === id ? { ...item, photo: canvas.toDataURL('image/jpeg', 0.6) } : item));
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  };

  const stats = (() => {
    if (checklist.length === 0) return { score: 0 };
    const comp = checklist.filter(i => i.status === 'compliant').length;
    const evaluated = checklist.length - checklist.filter(i => i.status === 'pending').length;
    return { score: evaluated > 0 ? Math.round((comp / evaluated) * 100) : 0 };
  })();

  const currentSOP = sops.find(s => s.id === auditInfo.sopId);
  const getTier = (s) => {
    if (s <= 54) return { label: 'No cumple', color: 'bg-red-100 text-red-800', icon: <XCircle className="text-red-600" /> };
    if (s <= 84) return { label: 'Parcial', color: 'bg-yellow-100 text-yellow-800', icon: <AlertTriangle className="text-yellow-600" /> };
    return { label: 'Cumple', color: 'bg-emerald-100 text-emerald-800', icon: <CheckCircle className="text-emerald-600" /> };
  };
  const tier = getTier(stats.score);

  const inputStyle = "p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 w-full";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col">
      <header className="bg-emerald-800 text-white p-4 shadow-lg sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-200" />
            <h1 className="text-xl font-bold uppercase tracking-tight">Auditoría POES</h1>
          </div>
          <div className="flex space-x-2 overflow-x-auto">
            <button onClick={() => setActiveTab('checklist')} className={"p-2 px-3 rounded flex items-center space-x-2 font-medium " + (activeTab === 'checklist' ? 'bg-white text-emerald-800' : 'hover:bg-emerald-700')}><List size={18}/> <span>Verificación</span></button>
            <button onClick={() => setActiveTab('dashboard')} className={"p-2 px-3 rounded flex items-center space-x-2 font-medium " + (activeTab === 'dashboard' ? 'bg-white text-emerald-800' : 'hover:bg-emerald-700')} disabled={!auditInfo.sopId}><BarChart2 size={18}/> <span>Dashboard</span></button>
            <button onClick={() => window.print()} className="p-2 px-3 border border-emerald-400 rounded hover:bg-emerald-700" disabled={!auditInfo.sopId}><Printer size={18}/></button>
            <button onClick={() => setShowNewAuditModal(true)} className="p-2 px-3 bg-red-700 rounded hover:bg-red-800 text-white"><FilePlus size={18}/></button>
            <button onClick={() => setActiveTab('admin')} className={"p-2 px-3 rounded flex items-center space-x-2 border-l border-emerald-600 pl-4 " + (activeTab === 'admin' ? 'bg-emerald-900' : 'hover:bg-emerald-700')}><Settings size={18}/> <span>Gestión</span></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 flex-grow w-full">
        {activeTab === 'checklist' && (
          <div className="animate-in fade-in">
            <section className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200 print:p-0">
              <h2 className="text-sm font-bold text-emerald-700 uppercase mb-4 tracking-wider">Configuración General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 print:hidden">
                  <select value={auditInfo.sopId} onChange={(e) => handleSopChangeRequest(e.target.value)} className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-lg font-bold text-emerald-900 outline-none">
                    <option value="">-- Seleccionar Procedimiento (POES) --</option>
                    {sops.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title}</option>)}
                  </select>
                </div>
                <input type="text" placeholder="Finca / Planta" value={auditInfo.farmName} onChange={e => setAuditInfo({...auditInfo, farmName: e.target.value})} className={inputStyle} />
                <input type="text" placeholder="Lote / Área" value={auditInfo.lotArea} onChange={e => setAuditInfo({...auditInfo, lotArea: e.target.value})} className={inputStyle} />
                <input type="text" placeholder="Auditor Responsable" value={auditInfo.auditorName} onChange={e => setAuditInfo({...auditInfo, auditorName: e.target.value})} className={inputStyle} />
                <input type="text" placeholder="Operario Auditado" value={auditInfo.operatorName} onChange={e => setAuditInfo({...auditInfo, operatorName: e.target.value})} className={inputStyle} />
              </div>
            </section>

            {auditInfo.sopId ? (
              <div className="space-y-4">
                <div className="bg-emerald-900 text-white p-4 rounded-t-xl"><h3 className="font-bold text-lg uppercase">{currentSOP?.code} - {currentSOP?.title}</h3></div>
                <div className="bg-white border rounded-b-xl divide-y shadow-sm">
                  {checklist.map(item => (
                    <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors print:break-inside-avoid">
                      <p className="font-medium mb-4 text-gray-800">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status: 'compliant'} : i))} className={"px-4 py-2 rounded-full text-xs font-bold " + (item.status === 'compliant' ? 'bg-emerald-600 text-white shadow-md' : 'bg-gray-100 text-gray-600')}>Cumple</button>
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status: 'non-compliant'} : i))} className={"px-4 py-2 rounded-full text-xs font-bold " + (item.status === 'non-compliant' ? 'bg-red-600 text-white shadow-md' : 'bg-gray-100 text-gray-600')}>No Cumple</button>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg print:bg-white print:p-0">
                        <textarea placeholder="Observaciones..." className={inputStyle + " md:col-span-2"} value={item.notes} onChange={e => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, notes: e.target.value} : i))} />
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-white min-h-[100px] relative">
                          {item.photo ? (
                            <><img src={item.photo} className="w-full h-full object-contain p-1" /><button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, photo: null} : i))} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full print:hidden"><Trash2 size={14}/></button></>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center print:hidden"><ImageIcon className="text-gray-400 mb-1" /><span className="text-[10px] text-gray-500 font-bold">Cámara</span><input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(item.id, e)} /></label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : <div className="text-center py-20 text-gray-300 font-bold uppercase tracking-widest border-2 border-dashed rounded-3xl">Seleccionar POES para iniciar</div>}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in space-y-6 text-center">
             <div className="bg-emerald-900 text-white p-10 rounded-3xl shadow-xl"><h2 className="text-6xl font-black">{stats.score}%</h2><p className="uppercase tracking-widest mt-2">Cumplimiento</p></div>
             <div className={"p-8 rounded-2xl border-2 flex items-center justify-center " + tier.colorClass}>
               <div className="mr-4">{tier.icon}</div><h3 className="text-xl font-bold uppercase">Resultado: {tier.label}</h3>
             </div>
          </div>
        )}
      </main>

      <footer className="p-6 text-center text-[10px] font-bold text-emerald-800 bg-emerald-50 uppercase tracking-widest border-t print:hidden">Auditoría POES RSPO - Nicolas Acosta & Gemini</footer>

      {showNewAuditModal && (
        <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-4"><div className="bg-white p-8 rounded-3xl max-w-sm w-full text-center"><AlertOctagon className="text-red-600 w-12 h-12 mb-4 mx-auto" /><h3 className="text-xl font-bold mb-6">¿LIMPIAR AUDITORÍA?</h3><div className="flex flex-col gap-2"><button onClick={() => { setChecklist([]); setAuditInfo({farmName:'', lotArea:'', auditorName:'', operatorName:'', date: new Date().toISOString().split('T')[0], sopId:''}); setShowNewAuditModal(false); }} className="p-3 bg-red-600 text-white rounded-xl font-bold">SÍ, BORRAR</button><button onClick={() => setShowNewAuditModal(false)} className="p-3 bg-gray-100 text-gray-400 rounded-xl font-bold">CANCELAR</button></div></div></div>
      )}
    </div>
  );
};

export default App;