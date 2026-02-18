
import React, { useMemo } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Student, Subject } from '../types';
import { TrendingUp, Target, Briefcase } from 'lucide-react';

interface DashboardProps {
  students: Student[];
  subjects: Subject[];
}

const NEON_COLORS = ['#38bdf8', '#a855f7', '#f97316', '#ef4444'];

const Dashboard: React.FC<DashboardProps> = ({ students, subjects }) => {
  const getStudentAverage = (student: Student): number => {
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

    if (weightSum === 0) return 0;
    return total / weightSum;
  };

  const chartData = useMemo(() => {
    return subjects.map(subject => {
      const avg = students.length > 0
        ? students.reduce((acc: number, st: Student) => acc + (st.grades[subject.id] || 0), 0) / students.length
        : 0;
      return {
        name: subject.name,
        promedio: parseFloat(avg.toFixed(1))
      };
    });
  }, [students, subjects]);

  const distributionData = useMemo(() => {
    const counts = { excellent: 0, good: 0, basic: 0, low: 0 };
    students.forEach(st => {
      const avg = getStudentAverage(st);
      if (avg >= 4.5) counts.excellent++;
      else if (avg >= 3.5) counts.good++;
      else if (avg >= 3.0) counts.basic++;
      else counts.low++;
    });
    return [
      { name: 'Excelente (4.5-5.0)', value: counts.excellent },
      { name: 'Satisfactorio (3.5-4.4)', value: counts.good },
      { name: 'Básico (3.0-3.4)', value: counts.basic },
      { name: 'Insuficiente (<3.0)', value: counts.low },
    ];
  }, [students, subjects]);

  const stats = useMemo(() => {
    if (students.length === 0) return null;
    const allAverages = students.map(st => {
      return getStudentAverage(st);
    });
    const globalAvg = allAverages.reduce((a: number, b: number) => a + b, 0) / students.length;
    const topStudent = students.reduce((prev, curr) => {
        return (getStudentAverage(curr) > getStudentAverage(prev)) ? curr : prev;
    });

    return {
      globalAvg: globalAvg.toFixed(1),
      topPerformer: topStudent.name,
      projects: new Set(students.map(s => s.project).filter(p => !p.includes('Pendiente'))).size
    };
  }, [students, subjects]);

  if (!stats) return <div className="p-20 text-center">Iniciando analítica Ascend...</div>;

  return (
    <div className="space-y-8 pb-20">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          icon={<TrendingUp className="w-6 h-6 text-blue-400" />} 
          label="Promedio Grupal" 
          value={stats.globalAvg} 
          subtext="/ 5.0 Escala Ascend"
        />
        <StatCard 
          icon={<Target className="w-6 h-6 text-orange-400" />} 
          label="Mejor promedio" 
          value={stats.topPerformer.split(' ')[0]} 
          subtext={stats.topPerformer}
        />
        <StatCard 
          icon={<Briefcase className="w-6 h-6 text-purple-400" />} 
          label="Modelos BIM" 
          value={stats.projects.toString()} 
          subtext="Proyectos únicos"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Desempeño por Entrega</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis domain={[0, 5]} ticks={[0, 1, 2, 3, 4, 5]} stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '16px', border: '1px solid #334155' }}
                />
                <Bar dataKey="promedio" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={50} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[#0f172a]/50 p-8 rounded-3xl border border-slate-800 backdrop-blur-sm">
          <h3 className="text-sm font-black text-slate-500 uppercase tracking-widest mb-8">Estado de Aprobación</h3>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={distributionData}
                  cx="50%"
                  cy="50%"
                  innerRadius={70}
                  outerRadius={110}
                  paddingAngle={8}
                  dataKey="value"
                  stroke="none"
                >
                  {distributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={NEON_COLORS[index % NEON_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, label, value, subtext }: { icon: any, label: string, value: string, subtext: string }) => (
  <div className="bg-[#0f172a]/50 p-6 rounded-3xl border border-slate-800 flex items-center gap-6 group hover:border-slate-700 transition-all">
    <div className="p-5 bg-slate-900 rounded-2xl group-hover:scale-110 transition-transform">{icon}</div>
    <div>
      <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">{label}</p>
      <p className="text-3xl font-black text-white">{value}</p>
      <p className="text-[10px] text-slate-500 font-medium truncate max-w-[120px]">{subtext}</p>
    </div>
  </div>
);

export default Dashboard;
