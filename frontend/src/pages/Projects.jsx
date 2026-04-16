import React, { useState, useEffect } from 'react';
import API from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Layers,
  Calendar,
  Users,
  ExternalLink,
  Loader2,
  X,
  Target
} from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import toast from 'react-hot-toast';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [openMenu, setOpenMenu] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const fetchProjects = async () => {
    try {
      const res = await API.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
    
    // Listeners for click outside
    const handleClickOutside = () => setOpenMenu(null);
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  const handleEdit = (project) => {
    navigate(`/projects/edit/${project._id}`);
    setOpenMenu(null);
  };

  const handleDelete = async (id) => {
    setOpenMenu(null);
    if (!window.confirm("Are you sure you want to delete this project?")) return;
    try {
      await API.delete(`/api/projects/${id}`);
      toast.success('Project deleted');
      fetchProjects();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error deleting project');
    }
  };

  const filteredProjects = projects.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-6 space-y-10 animate-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight">Software Projects</h1>
          <p className="text-slate-500 mt-2 font-medium">Manage and monitor all active development sprints.</p>
        </div>
        <button 
          onClick={() => navigate('/create-project')}
          className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white px-8 py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all shadow-xl shadow-primary/20 hover:scale-105 active:scale-[0.98] text-sm"
        >
          <Plus size={18} />
          Create Project
        </button>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={18} />
          <input 
            type="text"
            placeholder="Search your workspaces..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700/50 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all text-sm shadow-sm"
          />
        </div>
        <button className="bg-slate-800 border border-slate-700 text-slate-400 px-6 py-3 rounded-xl flex items-center gap-2 hover:text-white transition-all font-bold text-sm shadow-sm">
          <Filter size={18} />
          Filter
        </button>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-4">
          <Loader2 className="animate-spin text-primary" size={40} />
          <p className="text-slate-500 text-xs font-black uppercase tracking-widest animate-pulse">Fetching projects...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map(project => (
            <div 
              key={project._id} 
                onClick={() => {
                const target = `/project/${project._id}`;
                if (location.pathname !== target) {
                  navigate(target);
                }
              }}
              className="bg-slate-800 border border-slate-700/50 rounded-[2rem] p-8 relative group overflow-hidden shadow-md hover:shadow-xl hover:shadow-primary/5 hover:translate-y-[-4px] transition-all duration-300 cursor-pointer"
            >
               {/* Accent bar */}
              <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/20 group-hover:bg-primary transition-all duration-300 shadow-[2px_0_10px_rgba(var(--primary),0.2)]" />
              
              <div className="flex justify-between items-start mb-8">
                <div className="w-14 h-14 bg-slate-900 rounded-2xl flex items-center justify-center border border-slate-700 group-hover:border-primary/40 transition-all shadow-inner">
                  <Layers className="text-slate-500 group-hover:text-primary transition-all" size={28} />
                </div>
                <div className="relative" onClick={e => e.stopPropagation()}>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      setOpenMenu(openMenu === project._id ? null : project._id);
                    }}
                    className="text-slate-600 hover:text-white transition-all p-2 rounded-lg hover:bg-white/5"
                  >
                    <MoreVertical size={20} />
                  </button>
                  {openMenu === project._id && (
                    <div className="absolute right-0 mt-2 w-36 bg-slate-800 rounded-xl shadow-2xl border border-slate-700 z-50 overflow-hidden animate-in fade-in zoom-in duration-200">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleEdit(project);
                        }} 
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-700 transition-colors"
                      >
                        Edit Project
                      </button>
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          handleDelete(project._id);
                        }} 
                        className="w-full text-left px-4 py-2.5 text-xs font-bold text-red-400 hover:text-red-300 hover:bg-slate-700 transition-colors cursor-pointer"
                      >
                        Delete Project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <h3 className="text-xl font-bold text-white mb-2 tracking-tight group-hover:text-primary transition-colors">{project.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">
                {project.description}
              </p>

              <div className="space-y-6 pt-6 border-t border-slate-700/50">
                <div className="flex items-center gap-2 text-xs font-bold text-slate-600 uppercase tracking-widest">
                  <Calendar size={14} className="text-slate-700" />
                  <span>Deployed {new Date(project.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="flex -space-x-3">
                      {project.members?.slice(0, 3).map((m) => (
                        <div key={m.user?._id || Math.random()} className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-indigo-600 border-2 border-slate-800 flex items-center justify-center text-[10px] font-bold text-white shadow-sm" title={m.user?.name}>
                          {m.user?.name?.charAt(0).toUpperCase()}
                        </div>
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{project.members?.length || 0} team members</span>
                  </div>
                  <div 
                    onClick={(e) => {
                      e.stopPropagation();
                      const target = `/project/${project._id}`;
                      if (location.pathname !== target) {
                        navigate(target);
                      }
                    }}
                    className="p-3 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 active:scale-95 cursor-pointer"
                  >
                    <ExternalLink size={20} />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredProjects.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 text-slate-500 bg-slate-800/20 border-2 border-dashed border-slate-700 rounded-[3rem]">
          <Target size={64} className="mb-6 opacity-10" />
          <h3 className="text-white font-bold text-xl">No Project Environments Found</h3>
          <p className="mt-2 text-sm font-medium">Try adjusting your search or create a new workspace.</p>
        </div>
      )}

    </div>
  );
};

export default Projects;
