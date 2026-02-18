
import React, { useState } from 'react';
import { 
  Users, 
  Plus, 
  LayoutDashboard, 
  Sparkles, 
  Search,
  Shield
} from 'lucide-react';
import { Student, Subject } from './types';
import StudentTable from './components/StudentTable';
import Dashboard from './components/Dashboard';
import AIPanel from './components/AIPanel';

// Definición de las 3 entregas principales
const BIM_DELIVERIES: Subject[] = [
  { id: 'p1', name: 'Parcial 1' },
  { id: 'p2', name: 'Parcial 2' },
  { id: 'final', name: 'Entrega Final' },
];

const INITIAL_STUDENTS: Student[] = [
  { id: '1', name: 'Yenifer Tatiana Arias Coca', project: 'Casa AF / Arquipélago Arquitetos', grades: { p1: 4.2, p2: 4.0, final: 4.5 } },
  { id: '2', name: 'Camilo Andres Miranda Gomez', project: 'Casa AF / Arquipélago Arquitetos', grades: { p1: 3.8, p2: 3.5, final: 4.0 } },
  { id: '3', name: 'Andres Felipe Posso Garcia', project: 'Casa Salatino / Sommet', grades: { p1: 4.5, p2: 4.2, final: 4.8 } },
  { id: '4', name: 'Carlos Mario Dagua Palco', project: 'Casa Salatino / Sommet', grades: { p1: 3.2, p2: 3.8, final: 3.5 } },
  { id: '5', name: 'James Andres Marin Rojas', project: 'Casa al cuadrado / Estudi La Caseta', grades: { p1: 4.8, p2: 4.9, final: 5.0 } },
  { id: '6', name: 'Alvaro Andres Rodriguez Espinel', project: 'Pendiente de asignar', grades: { p1: 2.5, p2: 2.8, final: 3.0 } },
  { id: '7', name: 'Karol Andrea Forero Herrera', project: 'Casa Salatino / Sommet', grades: { p1: 4.0, p2: 4.2, final: 4.3 } },
  { id: '8', name: 'Alejandra Rueda Castro', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 4.9, p2: 4.8, final: 5.0 } },
  { id: '9', name: 'Julian Santiago Gonzalez Pirazan', project: 'Pendiente de asignar', grades: { p1: 3.0, p2: 3.2, final: 3.5 } },
  { id: '10', name: 'Alejandra Lopez Arrubla', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 4.1, p2: 4.3, final: 4.5 } },
  { id: '11', name: 'Juan Felipe Diaz Martinez', project: 'Casa Jungla / FAMM Arquitectura', grades: { p1: 3.9, p2: 4.0, final: 4.2 } },
];

type Tab = 'student' | 'table' | 'dashboard' | 'ai';

const ADMIN_PASSWORD = 'Ascend2025';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>('student');
  const [students, setStudents] = useState<Student[]>(INITIAL_STUDENTS);
  const [searchTerm, setSearchTerm] = useState('');
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

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
              className="w-full h-auto max-w-[180px] mb-2"
            />
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-indigo-400">Dream it, we BIM it</p>
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

        <div className="p-6 border-t border-slate-800/50 flex flex-col gap-4">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase">
            <span>Certificaciones</span>
          </div>
          <div className="flex gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all cursor-default">
             <div className="bg-white/5 p-2 rounded border border-white/10 text-[8px] font-bold">AUTODESK</div>
             <div className="bg-white/5 p-2 rounded border border-white/10 text-[8px] font-bold">BIM FORUM</div>
          </div>
        </div>
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
              <div className="mb-8">
                <h2 className="text-3xl font-extrabold text-white tracking-tight">Vista de estudiantes</h2>
                <p className="text-slate-500 mt-1">Consulta de calificaciones en modo solo lectura.</p>
              </div>
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
