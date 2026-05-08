
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

// ==========================================
// BASE DE DATOS DE PROCEDIMIENTOS INICIALES (SOPs)
// ==========================================
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
  },
  {
    id: 'AG-FT-5',
    code: 'AG-FT-5',
    title: 'Aplicación de Fertilizantes',
    area: 'Agronomía (Campo)',
    version: '9',
    criteria: [
      { id: 'c1', description: '1. El personal utiliza correctamente el EPI requerido (protección auditiva, respiratoria, visual, guantes y botas caña alta).' },
      { id: 'c2', description: '2. Se carga el vehículo con la cantidad exacta de fertilizante según el programa establecido.' },
      { id: 'c3', description: '3. (Manual) Se aplica la dosis estipulada en el plato utilizando medidas calibradas previamente.' },
      { id: 'c4', description: '4. (Mecánica) La boleadora está correctamente equipada y se realizó calibración previa.' },
      { id: 'c5', description: '5. Manejo Ambiental (HCV): Se suspende la aplicación de fertilizantes químicos en las palmas cercanas a fuentes hídricas.' },
      { id: 'c6', description: '6. No se evidencian derrames excesivos de producto durante el transporte o en los puntos de recarga.' },
      { id: 'c7', description: '7. Los empaques y sacos vacíos son recogidos y dispuestos para el reciclaje según el plan ambiental.' }
    ]
  },
  {
    id: 'AG-FT-7',
    code: 'AG-FT-7',
    title: 'Polinización Asistida',
    area: 'Agronomía (Campo)',
    version: '11',
    criteria: [
      { id: 'c1', description: '1. El operario utiliza EPI completo: Botas, guantes, gafas, protección respiratoria, pantalón y camisa manga larga.' },
      { id: 'c2', description: '2. Búsqueda de flor: El recorrido se realiza en Zig-Zag, aplicando técnica de "Mirada atrás".' },
      { id: 'c3', description: '3. Identificación: Se identifica correctamente el estado de la flor (antesis, post-antesis).' },
      { id: 'c4', description: '4. Destape: Se realiza la limpieza retirando material que impida el acceso (abajo, lados y atrás a tope).' },
      { id: 'c5', description: '5. Aplicación: Se esparce el ANA sólido con la técnica adecuada (inserción basal y espiral).' },
      { id: 'c6', description: '6. Marcación: Se marca correctamente la hoja indicando fecha (Día/Mes) o marca X para post-antesis.' },
      { id: 'c7', description: '7. Se diligencia correctamente el reporte diario de inflorescencias (AG-FO-23).' },
      { id: 'c8', description: '8. El auditor diligencia la Evaluación Diaria de Polinización (AG-FO-25) o en sistema Mobile.' }
    ]
  },
  {
    id: 'PB-IN-7',
    code: 'PB-IN-7',
    title: 'Recepción de Fruto',
    area: 'Planta Extractora (Molino)',
    version: '8',
    criteria: [
      { id: 'c1', description: '1. Se verifica el cumplimiento de los requisitos de SST (EPI, inducción) previo al ingreso.' },
      { id: 'c2', description: '2. El operario de báscula solicita y revisa el registro de control diario de cargue de fruto.' },
      { id: 'c3', description: '3. El operario de tolvas coordina el ingreso y posicionamiento seguro de los vehículos.' },
      { id: 'c4', description: '4. El personal utiliza el EPI requerido y acata las normas de seguridad mecánica.' },
      { id: 'c5', description: '5. Manejo Ambiental: Se recogen los residuos del fruto esparcidos y se disponen residuos sólidos en puntos ecológicos.' },
      { id: 'c6', description: '6. Se cuenta con disponibilidad inmediata y fácil acceso al Kit Anti-derrame en la zona.' }
    ]
  },
  {
    id: 'PB-IN-3',
    code: 'PB-IN-3',
    title: 'Manejo de Autoclaves (Esterilización)',
    area: 'Planta Extractora (Molino)',
    version: '7',
    criteria: [
      { id: 'c1', description: '1. Se verifica visualmente que la autoclave esté cargada de fruto y debidamente cerrada.' },
      { id: 'c2', description: '2. Se establece el tiempo del ciclo basándose en la madurez y tipo de material (Híbrido 2 picos / Comercial 3 picos).' },
      { id: 'c3', description: '3. Se ejecuta correctamente la secuencia de válvulas para desaireación (condensados, venteo, expansión).' },
      { id: 'c4', description: '4. Se respetan los picos de presión (subir a 30 PSI, bajar a 10 PSI) en el orden estricto.' },
      { id: 'c5', description: '5. Durante la fase de máxima presión (40 PSI), se realiza purga de condensados manteniendo estable la presión.' },
      { id: 'c6', description: '6. Se despresuriza completamente (condensados, vapor, venteo) antes de proceder a desocupar.' },
      { id: 'c7', description: '7. El operario diligencia oportunamente el formato de control de esterilización (PB-FO-04).' }
    ]
  }
];

const App = () => {
  // Pestañas: 'checklist', 'dashboard', 'admin'
  const [activeTab, setActiveTab] = useState('checklist');
  const [showNewAuditModal, setShowNewAuditModal] = useState(false);
  const [showChangeSOPModal, setShowChangeSOPModal] = useState(false);
  const [pendingSopChange, setPendingSopChange] = useState(null);

  // Estados de la Auditoría Activa
  const [auditInfo, setAuditInfo] = useState({
    farmName: '', lotArea: '', auditorName: '', operatorName: '', date: new Date().toISOString().split('T')[0], sopId: '' 
  });
  
  const [checklist, setChecklist] = useState([]);

  // Estados del Administrador de POES
  const [sops, setSops] = useState([]);
  const [isCreatingSop, setIsCreatingSop] = useState(false);
  const [newSop, setNewSop] = useState({
    code: '', title: '', area: 'Agronomía (Campo)', version: '1', criteria: [{ id: 'c1', description: '' }]
  });

  // Cargar datos al iniciar
  useEffect(() => {
    // Forzamos v7 para asegurar que carguen los procedimientos base más recientes
    const storedSops = localStorage.getItem('rspo_custom_sops_v7');
    if (storedSops) {
      setSops(JSON.parse(storedSops));
    } else {
      setSops(initialSopDatabase);
    }

    const savedData = localStorage.getItem('rspoAuditData_vFinal7');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.auditInfo) setAuditInfo(parsedData.auditInfo);
        if (parsedData.checklist) setChecklist(parsedData.checklist);
      } catch (e) { console.error(e); }
    }
  }, []);

  // Autoguardados
  useEffect(() => {
    localStorage.setItem('rspoAuditData_vFinal7', JSON.stringify({ auditInfo, checklist }));
  }, [auditInfo, checklist]);

  useEffect(() => {
    if (sops.length > 0) {
      localStorage.setItem('rspo_custom_sops_v7', JSON.stringify(sops));
    }
  }, [sops]);

  // =========================================
  // LOGICA DEL CHECKLIST / AUDITORÍA
  // =========================================
  const handleSopChangeRequest = (newSopId) => {
    const hasProgress = checklist.some(c => c.status !== 'pending' || c.notes !== '' || c.photo !== null);
    if (hasProgress && newSopId !== auditInfo.sopId) {
      setPendingSopChange(newSopId);
      setShowChangeSOPModal(true);
    } else { applySopChange(newSopId); }
  };

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
    if (checklist.length === 0) return { score: 0, completed: 0, nonCompliant: 0, inProgress: 0, pending: 0, total: 0 };
    const completed = checklist.filter(i => i.status === 'compliant').length;
    const nonCompliant = checklist.filter(i => i.status === 'non-compliant').length;
    const inProgress = checklist.filter(i => i.status === 'in-progress').length;
    const pending = checklist.filter(i => i.status === 'pending').length;
    const evaluated = checklist.length - pending;
    return { 
      score: evaluated > 0 ? Math.round((completed / evaluated) * 100) : 0,
      completed, nonCompliant, inProgress, pending, total: checklist.length, evaluated
    };
  })();

  const currentSOP = sops.find(s => s.id === auditInfo.sopId);

  const getComplianceTier = (score) => {
    if (score <= 54) return { id: 'red', label: 'No cumple', time: '2 Meses', colorClass: 'bg-red-100 text-red-800 border-red-300', icon: <XCircle className="w-6 h-6 mr-2 text-red-600" /> };
    if (score <= 84) return { id: 'yellow', label: 'Parcial', time: '6 Meses', colorClass: 'bg-yellow-100 text-yellow-800 border-yellow-300', icon: <AlertTriangle className="w-6 h-6 mr-2 text-yellow-600" /> };
    return { id: 'green', label: 'Cumple', time: '1 Año', colorClass: 'bg-emerald-100 text-emerald-800 border-emerald-300', icon: <CheckCircle className="w-6 h-6 mr-2 text-emerald-600" /> };
  };
  const currentTier = getComplianceTier(stats.score);

  // =========================================
  // LOGICA DEL ADMINISTRADOR DE POES
  // =========================================
  const handleCriterionChange = (index, value) => {
    const updated = [...newSop.criteria];
    updated[index].description = value;
    setNewSop({ ...newSop, criteria: updated });
  };

  const addCriterion = () => {
    setNewSop({ 
      ...newSop, 
      criteria: [...newSop.criteria, { id: `c${newSop.criteria.length + 1}`, description: '' }] 
    });
  };

  const saveNewSop = () => {
    if (!newSop.code || !newSop.title || newSop.criteria[0].description.trim() === '') return alert("⚠️ Campos incompletos.");
    setSops([...sops, { ...newSop, id: `custom-${Date.now()}`, criteria: newSop.criteria.filter(c => c.description.trim() !== '') }]);
    setNewSop({ code: '', title: '', area: 'Agronomía (Campo)', version: '1', criteria: [{ id: 'c1', description: '' }] });
    setIsCreatingSop(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col print:bg-white">
      <header className="bg-emerald-800 text-white p-4 shadow-lg sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-200" />
            <h1 className="text-xl font-bold">Auditoría POES RSPO</h1>
          </div>
          <div className="flex space-x-2 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
            <button onClick={() => setActiveTab('checklist')} className={`p-2 px-3 rounded flex items-center space-x-2 font-medium ${activeTab === 'checklist' ? 'bg-white text-emerald-800' : 'hover:bg-emerald-700'}`}><List size={18}/> <span>Verificación</span></button>
            <button onClick={() => setActiveTab('dashboard')} className={`p-2 px-3 rounded flex items-center space-x-2 font-medium ${activeTab === 'dashboard' ? 'bg-white text-emerald-800' : 'hover:bg-emerald-700'}`} disabled={!auditInfo.sopId}><BarChart2 size={18}/> <span>Dashboard</span></button>
            <button onClick={() => window.print()} className="p-2 px-3 border border-emerald-400 rounded hover:bg-emerald-700" disabled={!auditInfo.sopId}><Printer size={18}/></button>
            <button onClick={() => setShowNewAuditModal(true)} className="p-2 px-3 bg-red-700 rounded hover:bg-red-800 shadow-inner text-white"><FilePlus size={18}/></button>
            <button onClick={() => setActiveTab('admin')} className={`p-2 px-3 rounded flex items-center space-x-2 ml-4 border-l border-emerald-600 pl-4 ${activeTab === 'admin' ? 'bg-emerald-900 text-white' : 'hover:bg-emerald-700 text-emerald-200'}`}><Settings size={18}/> <span>Gestión</span></button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 flex-grow w-full">
        {activeTab === 'checklist' && (
          <div className="animate-in fade-in duration-300">
            <section className="bg-white p-6 rounded-xl shadow-sm mb-6 border border-gray-200 print:shadow-none print:border-none print:p-0">
              <h2 className="text-sm font-bold text-emerald-700 uppercase mb-4 tracking-wider">Configuración General</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2 print:hidden">
                  <select value={auditInfo.sopId} onChange={(e) => handleSopChangeRequest(e.target.value)} className="w-full p-3 bg-emerald-50 border border-emerald-200 rounded-lg font-bold text-emerald-900">
                    <option value="">-- Seleccionar Procedimiento (POES) --</option>
                    {sops.map(s => <option key={s.id} value={s.id}>{s.code} - {s.title} ({s.area})</option>)}
                  </select>
                </div>
                <input type="text" placeholder="Finca / Planta" value={auditInfo.farmName} onChange={e => setAuditInfo({...auditInfo, farmName: e.target.value})} className="p-2 border rounded print:border-none print:font-bold" />
                <input type="text" placeholder="Lote / Área" value={auditInfo.lotArea} onChange={e => setAuditInfo({...auditInfo, lotArea: e.target.value})} className="p-2 border rounded print:border-none print:font-bold" />
                <input type="text" placeholder="Auditor Responsable" value={auditInfo.auditorName} onChange={e => setAuditInfo({...auditInfo, auditorName: e.target.value})} className="p-2 border rounded print:border-none print:font-bold" />
                <input type="text" placeholder="Operario Auditado" value={auditInfo.operatorName} onChange={e => setAuditInfo({...auditInfo, operatorName: e.target.value})} className="p-2 border rounded print:border-none print:font-bold" />
              </div>
            </section>

            {auditInfo.sopId ? (
              <div className="space-y-4">
                <div className="bg-emerald-900 text-white p-4 rounded-t-xl print:text-black print:bg-white print:border-b-2 print:border-black">
                  <h3 className="font-bold text-lg uppercase tracking-wide">{currentSOP?.code} - {currentSOP?.title}</h3>
                </div>
                <div className="bg-white border rounded-b-xl divide-y shadow-sm print:border-none print:shadow-none">
                  {checklist.map(item => (
                    <div key={item.id} className="p-5 hover:bg-gray-50 transition-colors print:p-2 print:break-inside-avoid">
                      <p className="font-medium mb-4 text-gray-800 leading-relaxed">{item.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4 print:hidden">
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status: 'compliant'} : i))} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${item.status === 'compliant' ? 'bg-emerald-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>Cumple</button>
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status: 'in-progress'} : i))} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${item.status === 'in-progress' ? 'bg-amber-500 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>En Proceso</button>
                        <button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, status: 'non-compliant'} : i))} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${item.status === 'non-compliant' ? 'bg-red-600 text-white shadow-md scale-105' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>No Cumple</button>
                      </div>
                      <div className="hidden print:block font-bold mb-2">
                          {item.status === 'compliant' ? '✓ CUMPLE' : item.status === 'non-compliant' ? '✗ NO CUMPLE' : item.status === 'in-progress' ? '⚠ EN PROCESO' : '---'}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg print:bg-transparent print:p-0">
                        <textarea placeholder="Observaciones..." className="md:col-span-2 p-3 border rounded shadow-sm focus:ring-2 focus:ring-emerald-500 print:border-none print:italic" value={item.notes} onChange={e => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, notes: e.target.value} : i))} />
                        <div className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded bg-white min-h-[120px] relative print:border-none print:justify-start">
                          {item.photo ? (
                            <><img src={item.photo} className="w-full h-full object-contain p-1 print:max-h-[150px]" /><button onClick={() => setChecklist(prev => prev.map(i => i.id === item.id ? {...i, photo: null} : i))} className="absolute top-1 right-1 bg-red-600 text-white p-1 rounded-full shadow-lg print:hidden hover:bg-red-700"><Trash2 size={14}/></button></>
                          ) : (
                            <label className="cursor-pointer flex flex-col items-center print:hidden hover:text-emerald-600 transition-colors"><ImageIcon className="text-gray-400 w-8 h-8 mb-1" /><span className="text-[10px] text-gray-500 font-bold uppercase text-center px-2">Cámara / Galería</span><input type="file" accept="image/*" className="hidden" onChange={e => handleImageUpload(item.id, e)} /></label>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-24 bg-white border-2 border-dashed rounded-3xl text-gray-400">
                 <ImageIcon className="mx-auto w-16 h-16 opacity-10 mb-4" />
                 <h2 className="text-2xl font-bold uppercase tracking-widest">Seleccionar POES</h2>
              </div>
            )}
          </div>
        )}

        {activeTab === 'dashboard' && (
          <div className="animate-in fade-in space-y-6">
             <div className="bg-emerald-900 text-white p-10 rounded-3xl flex justify-between shadow-xl border border-emerald-700">
                <div><h2 className="text-5xl font-black">{stats.score}%</h2><p className="text-emerald-200 font-medium uppercase tracking-widest mt-2">Cumplimiento Global</p></div>
                <BarChart2 size={80} className="opacity-10" />
             </div>
             <div className={`p-8 rounded-2xl border-2 flex items-center shadow-md ${currentTier.colorClass}`}>
                <div className="mr-6 p-4 bg-white rounded-full shadow-sm">{currentTier.icon}</div>
                <div><h3 className="text-xl font-bold uppercase">Resultado: {currentTier.label}</h3><p className="font-medium mt-1">Seguimiento requerido en: <strong className="underline">{currentTier.time}</strong></p></div>
             </div>
             <div className="bg-white rounded-2xl shadow-sm border overflow-hidden mt-8">
                 <table className="w-full text-left">
                    <thead className="bg-gray-100 text-xs uppercase text-gray-500 font-bold"><tr className="border-b"><th className="p-4">Rango</th><th className="p-4">Criterio</th><th className="p-4">Plazo Seguimiento</th></tr></thead>
                    <tbody className="divide-y text-sm font-bold">
                        <tr className={currentTier.id === 'red' ? 'bg-red-50' : ''}><td className="p-4">0% - 54%</td><td className="p-4 text-red-600">No cumple</td><td className="p-4">2 Meses</td></tr>
                        <tr className={currentTier.id === 'yellow' ? 'bg-yellow-50' : ''}><td className="p-4">55% - 84%</td><td className="p-4 text-amber-600">Parcial</td><td className="p-4">6 Meses</td></tr>
                        <tr className={currentTier.id === 'green' ? 'bg-emerald-50' : ''}><td className="p-4">85% - 100%</td><td className="p-4 text-emerald-700">Cumple</td><td className="p-4">1 Año (Anual)</td></tr>
                    </tbody>
                 </table>
             </div>
             <div className="hidden print:flex justify-around mt-32 pt-10 border-t border-black">
                <div className="text-center w-64 border-t border-black pt-4 font-bold text-lg uppercase tracking-widest">Firma Auditor</div>
                <div className="text-center w-64 border-t border-black pt-4 font-bold text-lg uppercase tracking-widest">Firma Auditado</div>
             </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="animate-in fade-in space-y-6">
             <div className="bg-slate-800 text-white p-8 rounded-3xl flex justify-between shadow-xl items-center relative overflow-hidden">
                 <div className="relative z-10"><h2 className="text-3xl font-black uppercase tracking-tight">Gestor de Procedimientos</h2><p className="text-slate-400 text-sm font-medium mt-1">Base de datos local de POES / SOPs.</p></div>
                 <Settings size={120} className="absolute right-[-20px] bottom-[-40px] opacity-10 text-emerald-400" />
             </div>
             {!isCreatingSop ? (
                 <><div className="flex justify-end"><button onClick={() => setIsCreatingSop(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-xl font-bold flex items-center shadow-lg transition-transform hover:-translate-y-1"><Plus className="mr-2" /> Agregar Nuevo POES</button></div>
                 <div className="bg-white rounded-2xl shadow-sm border overflow-hidden"><table className="w-full text-left"><thead className="bg-gray-50 border-b text-xs uppercase text-gray-500 font-bold"><tr><th className="p-5">Código / Área</th><th className="p-5">Título del Procedimiento</th><th className="p-5 text-right">Gestión</th></tr></thead><tbody className="divide-y text-sm">
                    {sops.map(sop => (<tr key={sop.id} className="hover:bg-gray-50 group transition-colors"><td className="p-5"><span className="font-bold text-emerald-800">{sop.code}</span><br/><span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-black uppercase">{sop.area}</span></td><td className="p-5 font-bold text-gray-700">{sop.title}</td><td className="p-5 text-right"><button onClick={() => auditInfo.sopId !== sop.id ? setSops(sops.filter(s => s.id !== sop.id)) : alert("En uso.")} className="text-red-400 hover:text-red-700 p-2 opacity-50 group-hover:opacity-100 transition-opacity"><Trash2 size={20}/></button></td></tr>))}
                 </tbody></table></div></>
             ) : (
                 <div className="bg-white rounded-3xl shadow-2xl border p-8 animate-in slide-in-from-bottom-6">
                     <div className="flex justify-between items-center mb-8"><h3 className="text-2xl font-black text-emerald-900 uppercase">Construir Nuevo POES</h3><button onClick={() => setIsCreatingSop(false)} className="text-gray-300 hover:text-red-500 transition-colors"><XCircle size={32}/></button></div>
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                         <input type="text" placeholder="Código (Ej. AG-IN-04)" className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white outline-none font-bold" value={newSop.code} onChange={e => setNewSop({...newSop, code: e.target.value})} />
                         <input type="text" placeholder="Título" className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white outline-none font-bold" value={newSop.title} onChange={e => setNewSop({...newSop, title: e.target.value})} />
                         <select className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white outline-none font-bold" value={newSop.area} onChange={e => setNewSop({...newSop, area: e.target.value})}><option>Agronomía (Campo)</option><option>Planta Extractora (Molino)</option><option>Gestión Ambiental / SST</option><option>Administrativo</option></select>
                         <input type="number" className="p-4 border-2 border-gray-50 rounded-2xl bg-gray-50 focus:bg-white outline-none font-bold" value={newSop.version} onChange={e => setNewSop({...newSop, version: e.target.value})} />
                     </div>
                     <div className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 mb-8 space-y-4">
                         {newSop.criteria.map((c, i) => (<div key={i} className="flex gap-4 group"><div className="bg-white border-2 border-emerald-200 font-black p-4 rounded-2xl min-w-[56px] h-[56px] text-center text-emerald-800">{i+1}</div><textarea className="flex-grow p-4 rounded-2xl text-sm font-medium focus:bg-white outline-none resize-none" rows="2" placeholder="Lineamiento..." value={c.description} onChange={e => {const u = [...newSop.criteria]; u[i].description = e.target.value; setNewSop({...newSop, criteria: u}); }} /><button onClick={() => setNewSop({...newSop, criteria: newSop.criteria.filter((_, idx) => idx !== i)})} className="text-gray-300 hover:text-red-500 p-2 transition-colors"><Trash2/></button></div>))}
                         <button onClick={addCriterion} className="bg-white border-2 border-emerald-200 text-emerald-800 font-black text-[10px] uppercase px-6 py-3 rounded-2xl shadow-sm hover:bg-emerald-600 hover:text-white transition-all"><Plus size={16} className="inline mr-2"/> Agregar Criterio</button>
                     </div>
                     <div className="flex justify-end space-x-4"><button onClick={() => setIsCreatingSop(false)} className="px-8 py-4 border-2 border-gray-100 rounded-2xl font-black uppercase text-xs text-gray-400 hover:bg-gray-50 transition-colors">Cancelar</button><button onClick={saveNewSop} className="px-10 py-4 bg-emerald-600 text-white rounded-2xl font-black uppercase text-xs shadow-xl hover:bg-emerald-700 transition-all">Guardar POES</button></div>
                 </div>
             )}
          </div>
        )}
      </main>

      <footer className="p-8 text-center text-[10px] font-black text-emerald-800 bg-emerald-50 uppercase tracking-[0.2em] border-t border-emerald-100 print:hidden">Diseñada en conjunto por Nicolas S. Acosta & Gemini</footer>

      {showNewAuditModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full shadow-2xl"><AlertOctagon className="text-red-600 w-16 h-16 mb-6 mx-auto" /><h3 className="text-2xl font-black mb-2 text-center uppercase">¿Limpiar Auditoría?</h3><p className="text-gray-500 text-sm mb-8 text-center">Se borrará todo el progreso de la pantalla.</p><div className="flex flex-col gap-3"><button onClick={() => { setChecklist([]); setAuditInfo({farmName:'', lotArea:'', auditorName:'', operatorName:'', date: new Date().toISOString().split('T')[0], sopId:''}); setShowNewAuditModal(false); setActiveTab('checklist'); }} className="w-full p-4 bg-red-600 text-white rounded-2xl font-black uppercase text-xs shadow-lg">Sí, borrar</button><button onClick={() => setShowNewAuditModal(false)} className="w-full p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-xs">Cancelar</button></div></div></div>
      )}

      {showChangeSOPModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-4"><div className="bg-white p-10 rounded-[2.5rem] max-w-sm w-full shadow-2xl"><AlertTriangle className="text-amber-500 w-16 h-16 mb-6 mx-auto" /><h3 className="text-2xl font-black mb-2 text-center uppercase">¿Cambiar POES?</h3><p className="text-gray-500 text-sm mb-8 text-center">Perderás el progreso calificado de este procedimiento.</p><div className="flex flex-col gap-3"><button onClick={() => applySopChange(pendingSopChange)} className="w-full p-4 bg-amber-500 text-white rounded-2xl font-black uppercase text-xs shadow-lg">Sí, cambiar</button><button onClick={() => setShowChangeSOPModal(false)} className="w-full p-4 bg-gray-100 text-gray-400 rounded-2xl font-black uppercase text-xs">Volver</button></div></div></div>
      )}
    </div>
  );
};

export default App;