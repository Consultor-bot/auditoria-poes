import React, { useState, useEffect, useRef } from 'react';
import { CheckCircle, XCircle, AlertTriangle, BarChart2, List, Printer, FilePlus, AlertOctagon, Trash2, BookOpen, ImageIcon, Settings, Plus, PenTool, Camera } from 'lucide-react';

// --- COMPONENTE DE FIRMA ---
const SignaturePad = ({ label, onSave, savedImage, onImageUpload }) => {
  const canvasRef = useRef(null);
  const fileInputRef = useRef(null);
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
  
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        onImageUpload(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border-2 border-gray-100 rounded-3xl bg-white w-full print:border-gray-300 print:p-2">
      <span className="text-[10px] font-black uppercase mb-3 text-emerald-800 tracking-widest">{label}</span>
      {savedImage ? (
        <div className="relative w-full h-40 flex items-center justify-center border rounded-xl bg-gray-50 print:h-32 print:border-gray-300">
          <img src={savedImage} className="max-h-full max-w-full object-contain" alt="Firma" style={{maxHeight: '100%', maxWidth: '100%'}} />
          <div className="absolute top-1 right-1 print:hidden flex gap-1">
            <button onClick={() => onSave(null)} className="bg-red-100 text-red-600 p-1 rounded-full hover:bg-red-200">
              <Trash2 size={12}/>
            </button>
            <button onClick={() => fileInputRef.current.click()} className="bg-blue-100 text-blue-600 p-1 rounded-full hover:bg-blue-200">
              <ImageIcon size={12}/>
            </button>
          </div>
        </div>
      ) : (
        <div className="w-full">
          <canvas 
            ref={canvasRef} 
            width={300} 
            height={120} 
            onMouseDown={start} 
            onMouseMove={move} 
            onMouseUp={stop} 
            onTouchStart={start} 
            onTouchMove={move} 
            onTouchEnd={stop} 
            className="border rounded-lg w-full touch-none bg-gray-50 print:hidden" 
          />
          <button 
            type="button"
            onClick={() => fileInputRef.current.click()} 
            className="w-full mt-2 p-2 bg-blue-50 text-blue-600 rounded-lg text-xs font-bold hover:bg-blue-100 print:hidden flex items-center justify-center gap-2"
          >
            <ImageIcon size={14}/> O cargar imagen de firma
          </button>
        </div>
      )}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden"
      />
    </div>
  );
};

// --- BASE DE DATOS COMPLETA (ESTÁNDAR RSPO) ---
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
      { id: 'c3', d: '3. Se diligencia el Registro de Clarificación permanente (PB-FO-6) cada hora durante el proceso.' },
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
  },
  {
    id: 'PB-IN-15', code: 'PB-IN-15', title: 'Esterilización Línea 2', area: 'Planta Extractora (Molino)',
    criteria: [
      { id: 'c1', d: '1. El operario conoce el objetivo y alcance del procedimiento.' },
      { id: 'c2', d: '2. El personal entrevistado conoce sus responsabilidades dentro del proceso de esterilización.' },
      { id: 'c3', d: '3. Antes de iniciar operaciones se verifica que no haya personal trabajando en los redlers.' },
      { id: 'c4', d: '4. El operario realiza el requerimiento de fruto de acuerdo con el procedimiento.' },
      { id: 'c5', d: '5. Se solicita al CCM el encendido de redlers y sinfines antes del llenado.' },
      { id: 'c6', d: '6. Se verifica ausencia de personal en el área antes de poner en marcha los equipos.' },
      { id: 'c7', d: '7. La secuencia de llenado de esterilizadores es activada desde CCM.' },
      { id: 'c8', d: '8. Las compuertas de salida de tolvas hacia redler se encuentran operativas.' },
      { id: 'c9', d: '9. El esterilizador se llena adecuadamente con fruto fresco.' },
      { id: 'c10', d: '10. Las puertas del esterilizador se encuentran cerradas durante la operación.' },
      { id: 'c11', d: '11. Se verifica el estado de empaques y sellos antes de iniciar el ciclo.' },
      { id: 'c12', d: '12. Los seguros de las puertas se encuentran colocados correctamente.' },
      { id: 'c13', d: '13. El ciclo de esterilización se ejecuta conforme al instructivo PB-IN-03.' },
      { id: 'c14', d: '14. El tiempo de esterilización corresponde a la ficha técnica de madurez AG-FT-01.' },
      { id: 'c15', d: '15. El operario conoce los criterios para ajustar los tiempos de esterilización según la madurez del fruto.' },
      { id: 'c16', d: '16. El formato PB-FO-4 Control Esterilización se diligencia correctamente.' },
      { id: 'c17', d: '17. Los registros incluyen fecha, hora, lote y parámetros operativos.' },
      { id: 'c18', d: '18. Al finalizar el ciclo se retiran los seguros de forma segura.' },
      { id: 'c19', d: '19. La apertura de puertas se realiza una vez finalizado completamente el ciclo.' },
      { id: 'c20', d: '20. Se activa la secuencia de llenado de la tolva pulmón para descarga del fruto esterilizado.' },
      { id: 'c21', d: '21. El fruto esterilizado es descargado completamente del esterilizador.' },
      { id: 'c22', d: '22. Se realiza limpieza del cuello del esterilizador después de cada descarga.' },
      { id: 'c23', d: '23. No se observan remanentes de fruto antes de iniciar un nuevo ciclo.' },
      { id: 'c24', d: '24. La puerta inferior es cerrada antes de iniciar el nuevo llenado.' }
    ]
  }
];

const App = () => {
  const [activeTab, setActiveTab] = useState('checklist');
  const [auditInfo, setAuditInfo] = useState({ 
    farmName:'', lotArea:'', auditorName:'', operatorName:'', 
    date: new Date().toISOString().split('T')[0], sopId:'', conclusion:'', 
    sigAuditor:null, sigOperator:null, sigJohanna:null, sigNicolas:null 
  });
  const [checklist, setChecklist] = useState([]);
  const [auditHistory, setAuditHistory] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('audit_master_final_v110');
    if (saved) { const p = JSON.parse(saved); setAuditInfo(p.auditInfo); setChecklist(p.checklist); }
    const history = localStorage.getItem('audit_history_v110');
    if (history) { setAuditHistory(JSON.parse(history)); }
  }, []);

  useEffect(() => { localStorage.setItem('audit_master_final_v110', JSON.stringify({ auditInfo, checklist })); }, [auditInfo, checklist]);
  useEffect(() => { localStorage.setItem('audit_history_v110', JSON.stringify(auditHistory)); }, [auditHistory]);

  const handleSop = (id) => {
    const s = initialSopDatabase.find(x => x.id === id);
    if (s) {
      setAuditInfo({...auditInfo, sopId: id});
      setChecklist(s.criteria.map(c => ({ id: c.id, description: c.d, status: 'pending', notes: '', photo: null })));
    }
  };

  const stats = (() => {
    const evalItems = checklist.filter(i => i.status !== 'pending').length;
    const ok = checklist.filter(i => i.status === 'compliant').length;
    return { score: evalItems > 0 ? Math.round((ok / evalItems) * 100) : 0 };
  })();

  const saveToHistory = () => {
    if (!auditInfo.sopId || !auditInfo.farmName) {
      alert('Completa los datos de finca y procedimiento antes de guardar');
      return;
    }
    const newRecord = {
      id: Date.now(),
      timestamp: new Date().toLocaleString('es-CO'),
      sopCode: initialSopDatabase.find(s => s.id === auditInfo.sopId)?.code,
      sopTitle: initialSopDatabase.find(s => s.id === auditInfo.sopId)?.title,
      farmName: auditInfo.farmName,
      lotArea: auditInfo.lotArea,
      auditorName: auditInfo.auditorName,
      date: auditInfo.date,
      score: stats.score,
      checklist: checklist,
      conclusion: auditInfo.conclusion,
      sigAuditor: auditInfo.sigAuditor
    };
    setAuditHistory([newRecord, ...auditHistory]);
    alert('Auditoría guardada en el historial');
  };

  const downloadPDF = (record) => {
    const element = document.createElement('div');
    element.innerHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
        <h2 style="text-align: center; color: #059669; border-bottom: 2px solid #059669; padding-bottom: 10px;">Seguimiento POES</h2>
        <p><strong>Fecha de generación:</strong> ${record.timestamp}</p>
        <p><strong>Procedimiento:</strong> ${record.sopCode} - ${record.sopTitle}</p>
        <p><strong>Finca/Planta:</strong> ${record.farmName}</p>
        <p><strong>Lote/Área:</strong> ${record.lotArea}</p>
        <p><strong>Auditor:</strong> ${record.auditorName}</p>
        <p><strong>Fecha de auditoría:</strong> ${record.date}</p>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        <h3 style="color: #059669;">Puntuación Global: ${record.score}%</h3>
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
          <thead>
            <tr style="background-color: #f0f0f0;">
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Criterio</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: center;">Estado</th>
              <th style="border: 1px solid #ddd; padding: 8px; text-align: left;">Observaciones</th>
            </tr>
          </thead>
          <tbody>
            ${record.checklist.map(item => `
              <tr>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.description}</td>
                <td style="border: 1px solid #ddd; padding: 8px; text-align: center; font-weight: bold; color: ${item.status === 'compliant' ? '#059669' : item.status === 'non-compliant' ? '#dc2626' : '#999'}">
                  ${item.status === 'compliant' ? '✅ CONFORME' : item.status === 'non-compliant' ? '❌ NO CONFORME' : '---'}
                </td>
                <td style="border: 1px solid #ddd; padding: 8px;">${item.notes || '-'}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ccc;">
        <h3>Dictamen Técnico:</h3>
        <p>${record.conclusion || 'Sin observaciones'}</p>
        <p style="margin-top: 30px; font-size: 12px; color: #999; text-align: center;">Generado por Seguimiento POES · ${new Date().toLocaleDateString('es-CO')}</p>
      </div>
    `;
    const printWindow = window.open('', '', 'width=900,height=600');
    printWindow.document.write(element.innerHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const inputStyle = "p-3 border border-gray-300 rounded-xl bg-white text-gray-900 w-full text-sm outline-none focus:ring-2 focus:ring-emerald-500";

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 flex flex-col font-sans">
      <header className="bg-emerald-800 text-white p-4 sticky top-0 z-50 flex justify-between items-center shadow-lg print:hidden">
        <h1 className="font-bold text-sm uppercase tracking-tighter flex items-center gap-2"><BookOpen size={20}/> Seguimientos POES</h1>
        <div className="flex gap-2">
          <button onClick={() => setActiveTab('checklist')} className={`p-2 rounded-lg ${activeTab==='checklist'?'bg-white text-emerald-800 shadow-md':'bg-emerald-700'}`}><List size={20}/></button>
          <button onClick={() => setActiveTab('dashboard')} className={`p-2 rounded-lg ${activeTab==='dashboard'?'bg-white text-emerald-800 shadow-lg':'bg-emerald-700'}`}><BarChart2 size={20}/></button>
          <button onClick={() => setActiveTab('history')} className={`p-2 rounded-lg relative ${activeTab==='history'?'bg-white text-emerald-800 shadow-lg':'bg-emerald-700'}`}><BookOpen size={20}/>{auditHistory.length > 0 && <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{auditHistory.length}</span>}</button>
          <button onClick={() => window.print()} className="p-2 bg-emerald-700 rounded-lg"><Printer size={20}/></button>
          <button onClick={() => {if(confirm("¿Nueva Auditoría?")) {localStorage.clear(); window.location.reload();}}} className="p-2 bg-red-600 rounded-lg"><FilePlus size={20}/></button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto p-4 w-full flex-grow">
        <div className="hidden print:block text-center mb-6 pb-4 border-b-2 border-emerald-800">
          <h2 className="text-2xl font-black text-emerald-800 uppercase tracking-widest">Seguimiento POES</h2>
        </div>
        <div className="print:hidden mb-8">
          <img src="/auditor-palma.jpg.png" alt="Cultivo de Palma" className="w-full h-64 object-cover rounded-2xl shadow-lg" />
        </div>
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
               <div className="flex flex-col">
                 <span className="text-[10px] uppercase font-bold text-gray-400">Fecha de Diligenciamiento</span>
                 <input type="date" className={inputStyle} value={auditInfo.date} onChange={e=>setAuditInfo({...auditInfo, date:e.target.value})} />
               </div>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Finca / Planta</span><input type="text" className={inputStyle} value={auditInfo.farmName} onChange={e=>setAuditInfo({...auditInfo, farmName:e.target.value})} /></div>
               <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Lote / Área</span><input type="text" className={inputStyle} value={auditInfo.lotArea} onChange={e=>setAuditInfo({...auditInfo, lotArea:e.target.value})} /></div>
                <div className="flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400">Auditor Responsable</span><input type="text" className={inputStyle} value={auditInfo.auditorName} onChange={e=>setAuditInfo({...auditInfo, auditorName:e.target.value})} /></div>
                <div className="flex flex-col md:col-span-2"><span className="text-[10px] uppercase font-bold text-gray-400">Operario Auditado</span><input type="text" className={inputStyle} value={auditInfo.operatorName} onChange={e=>setAuditInfo({...auditInfo, operatorName:e.target.value})} /></div>
              </div>
            </section>

            {checklist.length > 0 && (
              <div className="bg-white border rounded-[2rem] overflow-hidden shadow-sm divide-y print:border-none print:shadow-none">
                {checklist.map(item => (
                  <div key={item.id} className="p-6 hover:bg-gray-50 transition-colors print:break-inside-avoid print:py-4">
                    <p className="text-sm font-bold text-gray-700 mb-4 leading-relaxed">{item.description}</p>
                    <div className="flex gap-2 mb-4 print:hidden">
                      <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'compliant'}:i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase ${item.status==='compliant'?'bg-emerald-600 text-white shadow-lg':'bg-gray-100 text-gray-400'}`}>CONFORME</button>
                      <button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, status:'non-compliant'}:i))} className={`flex-1 p-3 rounded-xl text-[10px] font-black uppercase ${item.status==='non-compliant'?'bg-red-600 text-white shadow-lg':'bg-gray-100 text-gray-400'}`}>NO CONFORME</button>
                    </div>
                    <div className="hidden print:block font-bold text-xs mb-2 italic">
                        RESULTADO: {item.status === 'compliant' ? '✅ CONFORME' : item.status === 'non-compliant' ? '❌ NO CONFORME' : '---'}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="md:col-span-2 flex flex-col"><span className="text-[10px] uppercase font-bold text-gray-400 print:hidden">Observaciones</span><textarea className={inputStyle + " h-20"} value={item.notes} onChange={e=>setChecklist(checklist.map(i=>i.id===item.id?{...i, notes:e.target.value}:i))} /></div>
                      <div className="border-2 border-dashed border-gray-200 rounded-2xl flex items-center justify-center bg-gray-50 min-h-[100px] relative print:border-none">
                        {item.photo ? (
                          <><img src={item.photo} className="h-full w-full object-cover rounded-xl print:max-h-32" /><button onClick={()=>setChecklist(checklist.map(i=>i.id===item.id?{...i, photo:null}:i))} className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full print:hidden"><Trash2 size={12}/></button></>
                        ) : (
                          <label className="cursor-pointer flex flex-col items-center text-gray-400 print:hidden"><Camera size={24}/><input type="file" accept="image/*" capture="camera" className="hidden" onChange={e=>{const reader=new FileReader(); reader.onload=(ev)=>setChecklist(prev=>prev.map(i=>i.id===item.id?{...i, photo:ev.target.result}:i)); reader.readAsDataURL(e.target.files[0]);}} /></label>
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
              <SignaturePad 
                label="Firma: Johanna López" 
                savedImage={auditInfo.sigJohanna} 
                onSave={img=>setAuditInfo({...auditInfo, sigJohanna:img})}
                onImageUpload={img=>setAuditInfo({...auditInfo, sigJohanna:img})}
              />
              <SignaturePad 
                label="Firma: Nicolas Acosta TR" 
                savedImage={auditInfo.sigNicolas} 
                onSave={img=>setAuditInfo({...auditInfo, sigNicolas:img})}
                onImageUpload={img=>setAuditInfo({...auditInfo, sigNicolas:img})}
              />
            </div>
            <button onClick={saveToHistory} className="mt-8 w-full p-4 bg-emerald-600 text-white font-black rounded-2xl uppercase hover:bg-emerald-700 transition-colors">💾 Guardar al Historial</button>
          </div>

        <div className={`${activeTab === 'history' ? 'block' : 'hidden'} space-y-6`}>
          <section className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100">
            <h2 className="text-xl font-black text-emerald-800 uppercase mb-6 flex items-center gap-2"><BookOpen size={24}/> Historial de Seguimientos</h2>
            {auditHistory.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No hay auditorías guardadas aún</p>
            ) : (
              <div className="space-y-4">
                {auditHistory.map(record => (
                  <div key={record.id} className="border border-gray-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Procedimiento</p>
                        <p className="font-bold text-emerald-800">{record.sopCode}</p>
                        <p className="text-sm text-gray-600">{record.sopTitle}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Finca/Auditor</p>
                        <p className="font-bold text-gray-800">{record.farmName}</p>
                        <p className="text-sm text-gray-600">{record.auditorName}</p>
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase">Puntuación</p>
                        <p className={`text-3xl font-black ${record.score >= 85 ? 'text-emerald-600' : record.score >= 55 ? 'text-amber-500' : 'text-red-600'}`}>{record.score}%</p>
                        <p className="text-[10px] text-gray-500">{record.timestamp}</p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => downloadPDF(record)} className="flex-1 p-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700">📄 Descargar PDF</button>
                      <button onClick={() => setAuditHistory(auditHistory.filter(a => a.id !== record.id))} className="p-2 bg-red-600 text-white rounded-lg text-sm font-bold hover:bg-red-700"><Trash2 size={18}/></button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
      <footer className="p-10 text-center text-[9px] font-black text-emerald-800 bg-emerald-50 uppercase tracking-[0.4em] border-t print:hidden">Diseñada por Nicolás S. Acosta · Consultoría Técnica</footer>
    </div>
  );
};

export default App;