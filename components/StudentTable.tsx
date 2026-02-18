
import React from 'react';
import { Trash2, FolderGit2, Users } from 'lucide-react';
import { Student, Subject } from '../types';

interface StudentTableProps {
  students: Student[];
  subjects: Subject[];
  onUpdate: (id: string, updates: Partial<Student>) => void;
  onDelete: (id: string) => void;
  readOnly?: boolean;
}

const StudentTable: React.FC<StudentTableProps> = ({ students, subjects, onUpdate, onDelete, readOnly = false }) => {
  const handleGradeChange = (studentId: string, subjectId: string, value: string) => {
    // Escala 0.0 a 5.0
    let score = parseFloat(value) || 0;
    const student = students.find(s => s.id === studentId);
    if (student) {
      const newGrades = { ...student.grades, [subjectId]: Math.min(5.0, Math.max(0.0, score)) };
      onUpdate(studentId, { grades: newGrades });
    }
  };

  const calculateAverage = (student: Student, subjects: Subject[]): string => {
    const WEIGHTS: Record<string, number> = {
      p1: 0.3,
      p2: 0.3,
      final: 0.4
    };

    let total = 0;
    let weightSum = 0;

    subjects.forEach(subject => {
      const weight = WEIGHTS[subject.id] ?? 0;
      if (weight === 0) return;

      let grade = student.grades[subject.id] ?? 0;

      if (subject.id === 'final') {
        const bonus = student.participationBonus ?? 0;
        grade = Math.min(5.0, grade + bonus);
      }

      total += grade * weight;
      weightSum += weight;
    });

    if (weightSum === 0) return "0.0";
    return (total / weightSum).toFixed(1);
  };

  return (
    <div className="bg-[#0f172a]/50 rounded-3xl shadow-2xl border border-slate-800/50 overflow-hidden backdrop-blur-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-900/50 border-b border-slate-800">
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em]">Alumno / Proyecto BIM</th>
              {subjects.map(subject => (
                <th key={subject.id} className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">
                  {subject.name}
                </th>
              ))}
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Participación</th>
              <th className="px-6 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] text-center">Promedio</th>
              <th className="px-6 py-5 text-right"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50">
            {students.map(student => {
              const avg = parseFloat(calculateAverage(student, subjects));
              return (
                <tr key={student.id} className="group hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4">
                      <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-black shadow-lg">
                        {student.name.charAt(0)}
                      </div>
                      <div className="flex flex-col gap-1 flex-1 min-w-[200px]">
                        {readOnly ? (
                          <div className="font-bold text-slate-100 text-sm">
                            {student.name}
                          </div>
                        ) : (
                          <input 
                            className="bg-transparent border-none p-0 font-bold text-slate-100 focus:ring-0 w-full text-sm"
                            value={student.name}
                            onChange={(e) => onUpdate(student.id, { name: e.target.value })}
                          />
                        )}
                        <div className="flex items-center gap-2 text-[11px] text-slate-500">
                          <FolderGit2 className="w-3 h-3 text-indigo-400" />
                          {readOnly ? (
                            <span className="italic">
                              {student.project}
                            </span>
                          ) : (
                            <input 
                              className="bg-transparent border-none p-0 focus:ring-0 w-full italic"
                              value={student.project}
                              onChange={(e) => onUpdate(student.id, { project: e.target.value })}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  {subjects.map(subject => (
                    <td key={subject.id} className="px-6 py-5 text-center">
                      <input 
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        className="w-14 px-1 py-2 text-center bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none disabled:opacity-60 disabled:cursor-not-allowed"
                        value={student.grades[subject.id] ?? 0.0}
                        onChange={(e) => handleGradeChange(student.id, subject.id, e.target.value)}
                        disabled={readOnly}
                      />
                    </td>
                  ))}
                  <td className="px-6 py-5 text-center">
                    {readOnly ? (
                      <span className="inline-flex items-center justify-center w-16 h-10 rounded-2xl text-xs font-bold border border-slate-700/50 bg-slate-800/50">
                        {(student.participationBonus ?? 0).toFixed(1)}
                      </span>
                    ) : (
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="1"
                        className="w-16 px-1 py-2 text-center bg-slate-800/50 border border-slate-700/50 rounded-xl text-xs font-bold text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                        value={student.participationBonus ?? 0}
                        onChange={(e) => {
                          const raw = parseFloat(e.target.value) || 0;
                          const clamped = Math.max(0, Math.min(1, raw));
                          onUpdate(student.id, { participationBonus: clamped });
                        }}
                      />
                    )}
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-xs font-black border ${
                      avg >= 4.5 
                        ? 'bg-green-500/20 text-green-400 border-green-500/30' 
                        : avg >= 3.0 
                          ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30'
                          : 'bg-red-500/20 text-red-400 border-red-500/30'
                    }`}>
                      {calculateAverage(student, subjects)}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-right">
                    {!readOnly && (
                      <button 
                        onClick={() => onDelete(student.id)}
                        className="opacity-0 group-hover:opacity-100 p-2 text-slate-600 hover:text-red-400 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {students.length === 0 && (
        <div className="p-20 text-center text-slate-600">
           No hay estudiantes registrados.
        </div>
      )}
    </div>
  );
};

export default StudentTable;
