import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { 
  Users, 
  Layers, 
  Ticket, 
  Activity, 
  Loader2, 
  TrendingUp, 
  PieChart as PieChartIcon, 
  BarChart as BarChartIcon,
  ShieldCheck,
  AlertCircle,
  Zap,
  Clock,
  Target
} from 'lucide-react';
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
  LineChart,
  Line,
  AreaChart,
  Area
} from 'recharts';

const StatCard = ({ title, value, icon, color, subtitle }) => (
  <div className="bg-slate-800 border border-slate-700 p-6 rounded-2xl shadow-xl hover:shadow-primary/5 transition-all group">
    <div className="flex justify-between items-start mb-4">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10 border border-opacity-20 ${color.replace('text-', 'border-')}`}>
        {React.cloneElement(icon, { size: 24, className: color })}
      </div>
      <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest bg-slate-900 px-2 py-1 rounded-lg">Live</div>
    </div>
    <p className="text-3xl font-black text-white mb-1">{value}</p>
    <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
    {subtitle && <p className="text-[10px] text-slate-600 font-bold mt-2 uppercase italic">{subtitle}</p>}
  </div>
);

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${API_BASE_URL}/api/admin/analytics`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setData(res.data);
      } catch (err) {
        setError('Failed to fetch platform telemetry');
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">Initializing Control Center...</p>
    </div>
  );

  if (error) return (
     <div className="p-8 bg-red-500/10 border border-red-500/20 rounded-2xl text-red-500 flex items-center gap-3">
        <AlertCircle size={20} />
        <span className="font-bold">{error}</span>
     </div>
  );

  const COLORS = ['#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#6366f1'];

  return (
    <div className="space-y-10 animate-in pb-20">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
             <ShieldCheck className="text-primary" size={20} />
             <p className="text-[10px] font-black text-primary uppercase tracking-[0.3em] bg-primary/10 px-3 py-1 rounded-full border border-primary/20">System Administration</p>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight leading-none">Intelligence Dashboard</h1>
          <p className="text-slate-500 mt-2 text-lg">Real-time platform velocity and network health telemetry.</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-700/50 p-4 rounded-2xl flex items-center gap-6">
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Status</p>
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                 <span className="text-white text-xs font-black uppercase tracking-widest">Nominal</span>
              </div>
           </div>
           <div className="w-px h-8 bg-slate-800" />
           <div className="text-center">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-1">Latency</p>
              <span className="text-white text-xs font-black uppercase tracking-widest">12ms</span>
           </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <StatCard title="Total Manifests" value={data.totalIssues} icon={<Ticket />} color="text-primary" subtitle="Across all projects" />
        <StatCard title="Avg Resolution" value={`${data.avgResolutionTime}h`} icon={<Clock />} color="text-amber-400" subtitle="From creation to done" />
        <StatCard title="Completion Rate" value={`${data.completionRate}%`} icon={<Target />} color="text-emerald-400" subtitle="Efficiency index" />
        <StatCard title="System Load" value="Optimal" icon={<Zap />} color="text-blue-400" subtitle="Resource availability" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
        {/* Trend Chart */}
        <div className="lg:col-span-8 bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 shadow-xl">
          <div className="flex justify-between items-center mb-10">
            <div>
               <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2">
                 <TrendingUp size={20} className="text-primary" />
                 Platform Velocity
               </h3>
               <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-1">Ticket creation vs resolution (30d)</p>
            </div>
          </div>
          <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.trends}>
                <defs>
                  <linearGradient id="colorCreated" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                <XAxis dataKey="_id" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  itemStyle={{ color: '#fff' }}
                />
                <Area type="monotone" dataKey="created" stroke="#8b5cf6" fillOpacity={1} fill="url(#colorCreated)" strokeWidth={3} />
                <Area type="monotone" dataKey="resolved" stroke="#10b981" fillOpacity={0} strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="lg:col-span-4 bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 shadow-xl">
           <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mb-10">
             <PieChartIcon size={20} className="text-primary" />
             Ticket Load
           </h3>
           <div className="h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={data.statusDistribution}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="count"
                    nameKey="_id"
                  >
                    {data.statusDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                 <p className="text-white font-black text-2xl leading-none">{data.totalIssues}</p>
                 <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mt-1">Total</p>
              </div>
           </div>
           
           <div className="space-y-4 mt-8">
              {data.statusDistribution.map((item, i) => (
                <div key={i} className="flex items-center justify-between group">
                   <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                      <span className="text-slate-400 text-xs font-bold uppercase tracking-widest group-hover:text-white transition-colors">{item._id}</span>
                   </div>
                   <span className="text-white font-black tabular-nums">{item.count}</span>
                </div>
              ))}
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 lg:gap-8">
         {/* User Activity */}
         <div className="lg:col-span-6 bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mb-8">
              <BarChartIcon size={20} className="text-primary" />
              Execution Leaderboard
            </h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.busiestUsers} layout="vertical">
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" horizontal={false} />
                     <XAxis type="number" hide />
                     <YAxis dataKey="name" type="category" stroke="#64748b" fontSize={10} width={80} />
                     <Tooltip 
                        cursor={{fill: 'rgba(139, 92, 246, 0.05)'}}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                     />
                     <Bar dataKey="ticketCount" fill="#8b5cf6" radius={[0, 4, 4, 0]} barSize={20} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>

         {/* Project Stats */}
         <div className="lg:col-span-6 bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 shadow-xl">
            <h3 className="text-white font-black text-xl tracking-tight flex items-center gap-2 mb-8">
              <Activity size={20} className="text-primary" />
              Project Allocation
            </h3>
            <div className="h-[300px] w-full">
               <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.projectStats}>
                     <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                     <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                     <YAxis stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                     <Tooltip 
                        cursor={{fill: 'rgba(139, 92, 246, 0.05)'}}
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                     />
                     <Bar dataKey="ticketCount" fill="#6366f1" radius={[4, 4, 0, 0]} barSize={30} />
                  </BarChart>
               </ResponsiveContainer>
            </div>
         </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
