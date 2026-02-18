
import React, { useState } from 'react';
import { Sparkles, Loader2, User, MessageSquare, BookOpen, TrendingUp, Cpu } from 'lucide-react';
import { Student, Subject } from '../types';
import { getAIInsights, getClassReport } from '../services/geminiService';

interface AIPanelProps {
  students: Student[];
  subjects: Subject[];
  onUpdate: (id: string, updates: Partial<Student>) => void;
}

const AIPanel: React.FC<AIPanelProps> = ({ students, subjects, onUpdate }) => {
  const [selectedStudentId, setSelectedStudentId] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [classReport, setClassReport] = useState<string>('');

  const handleGenerateStudentFeedback = async () => {
    if (!selectedStudentId) return;
    const student = students.find(s => s.id === selectedStudentId);
    if (!student) return;

    setLoading(true);
    const feedback = await getAIInsights(student, subjects);
    onUpdate(student.id, { aiFeedback: feedback });
    setLoading(false);
  };

  const handleGenerateClassReport = async () => {
    setLoading(true);
    const report = await getClassReport(students, subjects);
    setClassReport(report);
    setLoading(false);
  };

  const selectedStudent = students.find(s => s.id === selectedStudentId);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="bg-gradient-to-r from-indigo-900/40 to-purple-900/40 p-8 rounded-[2rem] border border-indigo-500/20 relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="text-3xl font-black text-white flex items-center gap-3">
            Mentor <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">Inteligente</span>
            <Cpu className="w-8 h-8 text-purple-400" />
          </h2>
          <p className="text-indigo-200/70 mt-2 max-w-2xl font-medium">Potencia el aprendizaje BIM con análisis predictivo y retroalimentación técnica basada en IA de Google.</p>
        </div>
        <Sparkles className="absolute -top-4 -right-4 w-48 h-48 text-indigo-500/10 rotate-12" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Student Feedback Section */}
        <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 flex flex-col h-full backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-400">
              <User className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Análisis Individual</h3>
          </div>

          <div className="space-y-5 flex-1">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">Elegir Candidato</label>
              <select 
                className="w-full p-4 bg-slate-900/50 border border-slate-700 rounded-2xl text-slate-100 focus:ring-2 focus:ring-blue-500 focus:outline-none appearance-none cursor-pointer hover:border-slate-600 transition-all font-medium"
                value={selectedStudentId}
                onChange={(e) => setSelectedStudentId(e.target.value)}
              >
                <option value="">Seleccionar Estudiante...</option>
                {students.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>

            {selectedStudent && (
              <div className="p-5 bg-slate-900/50 rounded-2xl border border-slate-800/50 group">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-3">Proyecto Actual</p>
                <p className="text-sm font-bold text-indigo-400 mb-4 italic">"{selectedStudent.project}"</p>
                <div className="grid grid-cols-2 gap-3">
                  {subjects.map(sub => (
                    <div key={sub.id} className="bg-slate-800/30 p-2.5 rounded-xl border border-slate-800/50 flex justify-between items-center">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-tighter">{sub.name}</span>
                      <span className="text-sm font-black text-white">{selectedStudent.grades[sub.id] || 0}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button 
              onClick={handleGenerateStudentFeedback}
              disabled={loading || !selectedStudentId}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl hover:shadow-[0_0_20px_rgba(37,99,235,0.3)] shadow-lg transition-all flex items-center justify-center gap-3 disabled:opacity-30 disabled:shadow-none font-black text-sm uppercase tracking-widest mt-4"
            >
              {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
              <span>Sincronizar Mentor</span>
            </button>

            {selectedStudent?.aiFeedback && (
              <div className="mt-8 p-6 bg-gradient-to-br from-indigo-900/20 to-transparent rounded-3xl border border-indigo-500/20 relative overflow-hidden">
                <MessageSquare className="absolute -bottom-4 -right-4 w-24 h-24 text-indigo-500/5 rotate-12" />
                <h4 className="font-black text-indigo-400 text-[10px] uppercase tracking-widest mb-4 flex items-center gap-2">
                  <div className="w-1 h-1 bg-indigo-500 rounded-full"></div>
                  Directiva del Mentor
                </h4>
                <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                  {selectedStudent.aiFeedback}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Class Report Section */}
        <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 flex flex-col h-full backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-400">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="text-lg font-bold text-white uppercase tracking-tight">Reporte Directivo</h3>
          </div>

          <p className="text-sm text-slate-400 mb-8 font-medium leading-relaxed">
            Genera una auditoría completa del rendimiento grupal para identificar cuellos de botella en la implementación de los proyectos de arquitectura.
          </p>

          <button 
            onClick={handleGenerateClassReport}
            disabled={loading || students.length === 0}
            className="w-full py-4 bg-[#080a0f] text-white border border-slate-700 rounded-2xl hover:bg-slate-900 shadow-md transition-all flex items-center justify-center gap-3 disabled:opacity-30 font-black text-sm uppercase tracking-widest"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <TrendingUp className="w-5 h-5" />}
            <span>Analizar Flujo Grupal</span>
          </button>

          {classReport && (
            <div className="mt-8 p-6 bg-slate-900/50 rounded-3xl border border-slate-800 h-full">
              <h4 className="font-black text-slate-500 text-[10px] uppercase tracking-widest mb-4">Informe Consolidado</h4>
              <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-medium">
                {classReport}
              </div>
            </div>
          )}
          
          {!classReport && !loading && (
            <div className="mt-8 flex-1 flex flex-col items-center justify-center border-2 border-dashed border-slate-800/50 rounded-3xl p-10 group hover:border-indigo-500/20 transition-all">
              <div className="p-5 bg-slate-900/50 rounded-full mb-4 group-hover:scale-110 transition-transform">
                <BookOpen className="w-8 h-8 text-slate-700" />
              </div>
              <p className="text-slate-500 text-sm text-center font-bold">Genera un análisis global del salón Ascend para visualizar tendencias.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIPanel;
