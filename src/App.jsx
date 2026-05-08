
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

  useEffect(() => {
    localStorage.setItem('rspoAuditData_vFinal7', JSON.stringify({ auditInfo, checklist }));
  }, [auditInfo, checklist]);

  useEffect(() => {
    if (sops.length > 0) {
      localStorage.setItem('rspo_custom_sops_v7', JSON.stringify(sops));
    }
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

  const handleSopChangeRequest = (newSopId) => {
    const hasProgress = checklist.some(c => c.status !== 'pending' || c.notes !== '' || c.photo !== null);
    if (hasProgress && newSopId !== auditInfo.sopId) {
      setPendingSopChange(newSopId);
      setShowChangeSOPModal(true);
    } else { applySopChange(newSopId); }
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

  const saveNewSop = () => {
    if (!newSop.code || !newSop.title || newSop.criteria[0].description.trim() === '') return alert("⚠️ Campos incompletos.");
    setSops([...sops, { ...newSop, id: `custom-${Date.now()}`, criteria: newSop.criteria.filter(c => c.description.trim() !== '') }]);
    setNewSop({ code: '', title: '', area: 'Agronomía (Campo)', version: '1', criteria: [{ id: 'c1', description: '' }] });
    setIsCreatingSop(false);
  };

  const commonInputClass = "p-3 border border-gray-300 rounded-lg bg-white text-gray-900 placeholder-gray-400 outline-none focus:ring-2 focus:ring-emerald-500 print:border-none print:font-bold w-full";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans flex flex-col print:bg-white">
      <header className="bg-emerald-800 text-white p-4 shadow-lg sticky top-0 z-50 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center space-x-2">
            <BookOpen className="w-6 h-6 text-emerald-200" />
            <h1 className="text-xl font-bold uppercase tracking-tight">Auditoría POES</h1>
          </div>
          <div className="flex space-x-2">
            <button onClick={() => setActiveTab('checklist')} className={`p-2 px-3 rounded flex items-center space-x-2 font-medium ${activeTab === 'checklist' ? '