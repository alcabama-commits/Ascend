
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Plus, 
  LayoutDashboard, 
  Sparkles, 
  Search,
  Shield,
  Save,
  Loader2
} from 'lucide-react';
import { Student, Subject } from './types';
import StudentTable from './components/StudentTable';
import Dashboard from './components/Dashboard';
import AIPanel from './components/AIPanel';
import { saveStudentsToSheet, getStudentsFromSheet } from './services/googleSheetsService';

// Definición de las 3 entregas principales
const BIM_DELIVERIES: Subject[] = [
  { id: 'p1', name: 'Parcial 1' },
  { id: 'p2', name: 'Parcial 2' },
  { id: 'final', name: 'Entrega Final' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Yenifer Tatiana Arias Coca', project: 'Casa AF / Arquipélago Arquitetos', grades: { p1: 4.2, p2: 4.0, final: 4.5 }, participationBonus: 0, comment: '' },
  { id: '2', name: 'Camilo Andres Miranda Gomez', project: 'Casa AF / Arquipélago Arquitetos', grades: { p1: 3.8, p2: 3.5, final: 4.0 }, participationBonus: 0, comment: '' },
  { id: '3', name: 'Andres Felipe Posso Garcia', project: 'Casa Salatino / Sommet', grades: { p1: 4.5, p2: 4.2, final: 4.8 }, participationBonus: 0, comment: '' },
  { id: '4', name: 'Carlos Mario Dagua Palco', project: 'Casa Salatino / Sommet', grades: { p1: 3.2, p2: 3.8, final: 3.5 }, participationBonus: 0, comment: '' },
  { id: '5', name: 'James Andres Marin Rojas', project: 'Casa al cuadrado / Estudi La Caseta', grades: { p1: 4.8, p2: 4.9, final: 5.0 }, participationBonus: 0, comment: '' },
  { id: '6', name: 'Alvaro Andres Rodriguez Espinel', project: 'Pendiente de asignar', grades: { p1: 2.5, p2: 2.8, final: 3.0 }, participationBonus: 0, comment: '' },
  { id: '7', name: 'Karol Andrea Forero Herrera', project: 'Casa Salatino / Sommet', grades: { p1: 4.0, p2: 4.2, final: 4.3 }, participationBonus: 0, comment: '' },
  { id: '8', name: 'Alejandra Rueda Castro', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 4.9, p2: 4.8, final: 5.0 }, participationBonus: 0, comment: '' },
  { id: '9', name: 'Julian Santiago Gonzalez Pirazan', project: 'Pendiente de asignar', grades: { p1: 3.0, p2: 3.2, final: 3.5 }, participationBonus: 0, comment: '' },
  { id: '10', name: 'Alejandra Lopez Arrubla', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 4.1, p2: 4.3, final: 4.5 }, participationBonus: 0, comment: '' },
  { id: '11', name: 'Juan Felipe Diaz Martinez', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 3.9, p2: 4.0, final: 4.2 }, participationBonus: 0, comment: '' },
];

type Tab = 'student' | 'table' | 'dashboard' | 'ai';

const ADMIN_PASSWORD = 'Ascend2025';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('student');
  const [students, setStudents] = useState<Student[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadInitialData = async () => {
      setIsLoading(true);
      const dataFromSheet = await getStudentsFromSheet();

      if (dataFromSheet && dataFromSheet.length > 0) {
        setStudents(dataFromSheet);
      } else {
        // Si la hoja está vacía o hay un error, carga los datos iniciales de ejemplo.
        // Puedes cambiar esto para que muestre un error o se quede vacío.
        setStudents(INITIAL_STUDENTS);
        console.warn("No se cargaron datos de Google Sheets. Usando datos de ejemplo locales.");
      }
      setIsLoading(false);
    };
    loadInitialData();
  }, []); // El array vacío asegura que se ejecute solo una vez al montar el componente

  const handleAdminTabClick = (tab: Tab) => {
    if (!adminAuthenticated) {
      const input = window.prompt('Introduce la contraseña de administración');
      if (input !== ADMIN_PASSWORD) {
        window.alert('Contraseña incorrecta');
        return;
      }
      setAdminAuthenticated(true);
    }
    setActiveTab(tab);
  };

  const addStudent = () => {
    const newStudent: Student = {
      id: Date.now().toString(),
      name: 'Nuevo Estudiante',
      project: 'Proyecto sin asignar',
      grades: BIM_DELIVERIES.reduce((acc, sub) => ({ ...acc, [sub.id]: 0 }), {}),
      comment: 'Anotación pendiente',
    };
    setStudents([newStudent, ...students]);
  };

  const updateStudent = (id: string, updates: Partial<Student>) => {
    setStudents(students.map(s => s.id === id ? { ...s, ...updates } : s));
  };

  const deleteStudent = (id: string) => {
    if (window.confirm('¿Eliminar registro de estudiante?')) {
      setStudents(students.filter(s => s.id !== id));
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    s.project.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveToCloud = async () => {
    if (!window.confirm('¿Sincronizar datos actuales con Google Sheets? Esto sobrescribirá la hoja.')) return;
    
    setIsSaving(true);
    const result = await saveStudentsToSheet(students);
    setIsSaving(false);

    if (result.success) {
      alert('¡Datos sincronizados correctamente con la nube!');
    } else {
      alert('Error al guardar: ' + (result.message || 'Verifica la consola'));
    }
  };

  const handleDownloadCSV = () => {
    const weights: Record<string, number> = { p1: 0.3, p2: 0.3, final: 0.4 };
    const header = ['id','name','project', ...BIM_DELIVERIES.map(s => s.id), 'participationBonus','promedio','comment'];
    const escape = (v: any) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const rows = students.map(st => {
      let total = 0;
      let sum = 0;
      BIM_DELIVERIES.forEach(s => {
        const w = weights[s.id] ?? 0;
        if (!w) return;
        const g = st.grades[s.id] ?? 0;
        total += g * w;
        sum += w;
      });
      const base = sum ? total / sum : 0;
      const bonus = st.participationBonus ?? 0;
      const avg = Math.min(5, base + bonus);
      const cols = [
        st.id,
        st.name,
        st.project,
        ...BIM_DELIVERIES.map(s => st.grades[s.id] ?? 0),
        (st.participationBonus ?? 0).toFixed(1),
        avg.toFixed(1),
        st.comment ?? ''
      ];
      return cols.map(escape).join(',');
    });
    const csv = [header.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'registro-calificaciones.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center bg-[#020617] text-slate-200">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-500" />
        <p className="mt-4 text-lg">Sincronizando con la nube...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-[#020617] text-slate-200">
      {/* Sidebar - Ascend Theme con Logo PNG */}
      <aside className="w-full md:w-72 bg-[#080a0f] border-r border-slate-800 flex flex-col shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-orange-500"></div>
        
        <div className="p-8 border-b border-slate-800/50">
          <div className="flex flex-col items-center">
            <img 
              src="https://i.postimg.cc/dVHkY36j/logo-ascend-dark.png" 
              alt="Ascend Logo" 
              className="w-full h-auto max-w-[180px]"
            />
          </div>
        </div>

        <nav className="flex-1 p-6 space-y-3">
          <NavItem 
            active={activeTab === 'student'} 
            onClick={() => setActiveTab('student')}
            icon={<Users className="w-5 h-5" />}
            label="Vista estudiantes"
          />
          <NavItem 
            active={activeTab === 'table'} 
            onClick={() => handleAdminTabClick('table')}
            icon={<Shield className="w-5 h-5" />}
            label="Administración"
          />
          <NavItem 
            active={activeTab === 'dashboard'} 
            onClick={() => handleAdminTabClick('dashboard')}
            icon={<LayoutDashboard className="w-5 h-5" />}
            label="Analítica"
          />
          <NavItem 
            active={activeTab === 'ai'} 
            onClick={() => handleAdminTabClick('ai')}
            icon={<Sparkles className="w-5 h-5" />}
            label="Mentor IA"
            special
          />
        </nav>

        <div className="p-6 border-t border-slate-800/50 flex flex-col gap-4"></div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto flex flex-col">
        <header className="sticky top-0 z-10 bg-[#020617]/80 backdrop-blur-xl border-b border-slate-800/50 px-8 py-4 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Buscar estudiante..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-11 pr-4 py-3 bg-slate-900/50 border border-slate-800 rounded-2xl text-sm focus:ring-2 focus:ring-indigo-500 focus:bg-slate-900 transition-all text-white outline-none"
            />
          </div>

          {activeTab === 'table' && (
            <div className="flex items-center gap-3">
              <button 
                onClick={handleSaveToCloud}
                disabled={isSaving}
                className="flex items-center gap-2 px-4 py-3 bg-yellow-500 text-black rounded-2xl hover:bg-yellow-400 transition-all text-sm font-bold shadow-lg shadow-yellow-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                <span>{isSaving ? 'Subiendo...' : 'Subir notas'}</span>
              </button>
              <button 
                onClick={handleDownloadCSV}
                className="flex items-center gap-2 px-4 py-3 bg-blue-500 text-white rounded-2xl hover:bg-blue-600 transition-all text-sm font-bold shadow-lg shadow-blue-500/20"
              >
                <span>Descargar CSV</span>
              </button>
            </div>
          )}

          {activeTab !== 'student' && (
            <button 
              onClick={addStudent}
              className="group relative flex items-center gap-2 px-6 py-3 bg-white text-black rounded-2xl hover:bg-slate-100 shadow-lg transition-all text-sm font-bold overflow-hidden"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Alumno</span>
            </button>
          )}
        </header>

        <div className="p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'student' && (
            <div className="animate-in fade-in duration-500">
              <StudentTable 
                students={filteredStudents} 
                subjects={BIM_DELIVERIES} 
                onUpdate={updateStudent} 
                onDelete={deleteStudent}
                readOnly
              />
            </div>
          )}

          {activeTab === 'table' && (
            <div className="animate-in fade-in duration-500">
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Registro de Calificaciones</h2>
                <p className="text-slate-500 mt-1">Escala de 0.0 a 5.0 • 3 Entregas Principales.</p>
              </div>
              <StudentTable 
                students={filteredStudents} 
                subjects={BIM_DELIVERIES} 
                onUpdate={updateStudent} 
                onDelete={deleteStudent}
              />
            </div>
          )}

          {activeTab === 'dashboard' && (
            <div className="animate-in slide-in-from-bottom-4 duration-500">
              <Dashboard students={students} subjects={BIM_DELIVERIES} />
            </div>
          )}

          {activeTab === 'ai' && (
            <div className="animate-in zoom-in-95 duration-500">
              <AIPanel students={students} subjects={BIM_DELIVERIES} onUpdate={updateStudent} />
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ active, onClick, icon, label, special = false }: { active: boolean, onClick: () => void, icon: any, label: string, special?: boolean }) => (
  <button 
    onClick={onClick}
    className={`w-full flex items-center gap-4 px-4 py-4 rounded-2xl transition-all relative group ${
      active 
        ? (special ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white/10 text-white') 
        : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'
    }`}
  >
    <div className={`${active ? 'text-white' : 'group-hover:text-indigo-400'} transition-colors`}>
      {icon}
    </div>
    <span className="font-bold text-sm tracking-wide">{label}</span>
  </button>
);

export default App;
