import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { formatDistanceToNow } from 'date-fns';
import { 
  BarChart3, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  Target,
  Users,
  Layers,
  TrendingUp,
  History
} from 'lucide-react';
import { Link } from 'react-router-dom';

const StatCard = ({ title, value, icon, color, trend }) => (
  <div className="bg-slate-800 border border-slate-700/50 p-6 rounded-2xl shadow-md hover:shadow-xl hover:shadow-primary/5 hover:scale-[1.02] transition-all duration-300 group">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-3 rounded-xl bg-slate-900 border border-slate-700 group-hover:border-primary/30 transition-colors`}>
        {React.cloneElement(icon, { className: color, size: 24 })}
      </div>
      {trend && (
        <div className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-lg ${trend > 0 ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
          <TrendingUp size={12} className={trend < 0 ? 'rotate-180' : ''} />
          {trend > 0 ? '+' : ''}{trend}%
        </div>
      )}
    </div>
    <div>
      <h3 className="text-slate-500 text-xs font-bold uppercase tracking-widest">{title}</h3>
      <p className="text-4xl font-black text-white mt-2 tabular-nums">{value}</p>
    </div>
  </div>
);

const getActionProps = (action) => {
  switch (action) {
    case 'created_project':
    case 'created_ticket':
      return { icon: <Plus />, color: 'text-blue-400' };
    case 'assigned_ticket':
      return { icon: <Users />, color: 'text-primary' };
    case 'resolved_ticket':
      return { icon: <CheckCircle2 />, color: 'text-emerald-400' };
    default:
      return { icon: <Clock />, color: 'text-amber-400' };
  }
};

const ActivityItem = ({ message, time, icon, color }) => (
  <div className="flex items-center gap-4 group cursor-default">
    <div className={`w-10 h-10 flex-shrink-0 rounded-xl ${color} bg-opacity-10 flex items-center justify-center border ${color.replace('text-', 'border-')}/20 group-hover:scale-110 transition-transform`}>
      {React.cloneElement(icon, { className: color, size: 18 })}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-sm font-semibold text-slate-200 truncate">{message}</p>
      <p className="text-[10px] text-slate-500 font-medium uppercase tracking-tight">{time}</p>
    </div>
  </div>
);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProjects: 0,
    openTickets: 0,
    resolvedTickets: 0,
    pendingTask: 0
  });
  const [recentProjects, setRecentProjects] = useState([]);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [projRes, ticketRes, activityRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/api/projects`),
          axios.get(`${API_BASE_URL}/api/tickets/my`).catch(() => ({ data: [] })),
          axios.get(`${API_BASE_URL}/api/activity`).catch(() => ({ data: [] }))
        ]);

        setRecentProjects(projRes.data.slice(0, 3));
        setActivities(activityRes.data);
        
        setStats({
          totalProjects: projRes.data.length,
          openTickets: ticketRes.data.filter(t => t.status !== 'Done').length,
          resolvedTickets: ticketRes.data.filter(t => t.status === 'Done').length,
          pendingTask: ticketRes.data.filter(t => t.priority === 'High').length
        });
      } catch (error) {
        console.error("Dashboard data fetch error", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
        <p className="text-slate-500 font-medium animate-pulse uppercase tracking-widest text-xs">Syncing workspace...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-12 animate-in pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Workspace Overview</h1>
          <p className="text-slate-500 mt-2 font-medium">Welcome back! Manage your projects and track your team's velocity.</p>
        </div>
        <Link 
          to="/projects"
          className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-sm"
        >
          <Plus size={18} />
          Create Project
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Total Projects" 
          value={stats.totalProjects} 
          icon={<Target />} 
          color="text-blue-400" 
          trend={12}
        />
        <StatCard 
          title="Active Tickets" 
          value={stats.openTickets} 
          icon={<AlertCircle />} 
          color="text-amber-400" 
          trend={-5}
        />
        <StatCard 
          title="Resolved" 
          value={stats.resolvedTickets} 
          icon={<CheckCircle2 />} 
          color="text-emerald-400" 
          trend={24}
        />
        <StatCard 
          title="Urgent Tasks" 
          value={stats.pendingTask} 
          icon={<Clock />} 
          color="text-purple-400" 
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Recent Projects Section */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Projects</h2>
            <Link to="/projects" className="text-primary hover:text-primary active:scale-95 flex items-center gap-1 text-sm font-bold transition-all underline-offset-4 hover:underline">
              View all work <ArrowRight size={14} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentProjects.map(project => (
              <Link key={project._id} to={`/projects/${project._id}`} className="bg-slate-800 border border-slate-700/50 p-6 rounded-[2rem] group hover:border-primary/40 transition-all shadow-md">
                <div className="flex justify-between items-start mb-6">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-primary/30 transition-all">
                    <Layers className="text-slate-500 group-hover:text-primary transition-all" size={24} />
                  </div>
                  <div className="flex -space-x-2">
                    {project.members?.slice(0, 3).map((m) => (
                      <div key={m.user?._id || Math.random()} className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-indigo-600 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={m.user?.name}>
                        {m.user?.name?.charAt(0).toUpperCase()}
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-primary transition-colors">{project.name}</h3>
                <p className="text-slate-500 text-xs mt-2 line-clamp-2 leading-relaxed font-medium">{project.description}</p>
                <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-700/50">
                   <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Active</span>
                   </div>
                   <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{project.members?.length || 0} Members</span>
                </div>
              </Link>
            ))}

            {recentProjects.length === 0 && (
              <div className="col-span-1 md:col-span-2 py-20 flex flex-col items-center justify-center text-slate-500 bg-slate-800/30 border-2 border-dashed border-slate-700 rounded-[2.5rem]">
                <div className="w-20 h-20 bg-slate-800 rounded-3xl flex items-center justify-center mb-6 border border-slate-700">
                  <Layers size={40} className="text-slate-600 opacity-50" />
                </div>
                <h3 className="text-white font-bold text-lg">No projects yet</h3>
                <p className="text-sm mt-2 max-w-xs text-center px-4">Create your first workspace to start tracking bugs and managing your team.</p>
                <Link 
                  to="/projects" 
                  className="mt-8 text-primary font-bold text-sm bg-primary/10 px-6 py-2.5 rounded-xl border border-primary/20 hover:bg-primary hover:text-white transition-all"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Activity Feed Section */}
        <div className="lg:col-span-4 space-y-6">
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Recent Activity</h2>
            <History size={18} className="text-slate-500" />
          </div>
          
          <div className="bg-slate-800 border border-slate-700/50 rounded-3xl p-6 shadow-md">
            {activities.length > 0 ? (
              <div className="space-y-8">
                {activities.map((item) => {
                  const { icon, color } = getActionProps(item.action);
                  return (
                    <ActivityItem 
                      key={item._id}
                      message={item.message || item.details || item.action} 
                      time={formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })} 
                      icon={icon} 
                      color={color}
                    />
                  );
                })}
              </div>
            ) : (
              <div className="py-10 text-center">
                <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-700">
                  <History size={24} className="text-slate-600 truncate" />
                </div>
                <p className="text-slate-400 font-medium">No activity yet</p>
              </div>
            )}
            
            {activities.length > 0 && (
              <button className="w-full mt-10 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-[0.2em] border border-slate-700 rounded-xl hover:bg-slate-700 hover:text-white transition-all">
                View Full History
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
