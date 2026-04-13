import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '@/config/api';
import { motion } from 'framer-motion';
import { 
  ArrowLeft, 
  Bug, 
  Send,
  AlertCircle,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';

const CreateTicket = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Medium',
    status: 'To Do'
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post(`/api/projects/${projectId}/tickets`, formData);
      toast.success('Ticket injected successfully');
      navigate(`/project/${projectId}`);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Error injecting ticket');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <motion.button 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        onClick={() => navigate(`/project/${projectId}`)}
        className="flex items-center gap-2 text-slate-500 hover:text-white transition-colors mb-8 font-bold text-sm group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
        Back to Board
      </motion.button>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-slate-800 border border-slate-700/50 rounded-[2.5rem] p-8 md:p-12 shadow-2xl relative overflow-hidden"
      >
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/5 rounded-full blur-3xl pointer-events-none" />
        
        <div className="flex items-center gap-4 mb-10">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center border border-primary/20">
            <Bug className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight">Report Issue</h1>
            <p className="text-slate-500 font-medium">Inject a new technical obstacle into the development sprint.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Issue Summary
              </label>
              <input 
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-lg focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-slate-600 shadow-inner"
                placeholder="Briefly describe the bug or feature..."
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                Technical Context / Logs
              </label>
              <textarea 
                required
                rows={5}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-md focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all placeholder:text-slate-600 resize-none shadow-inner leading-relaxed"
                placeholder="Provide steps to reproduce or implementation details..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <AlertCircle size={14} /> Priority Level
                </label>
                <select 
                  value={formData.priority}
                  onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                >
                  <option value="Low">Low</option>
                  <option value="Medium">Medium</option>
                  <option value="High">High</option>
                  <option value="Critical">Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-black text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Tag size={14} /> Initial Status
                </label>
                <select 
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white text-sm font-bold uppercase tracking-widest focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all cursor-pointer"
                >
                  <option value="To Do">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Done</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-6 pt-4">
            <button 
              type="button"
              onClick={() => navigate(`/project/${projectId}`)}
              className="text-slate-500 hover:text-white font-bold transition-colors text-sm"
            >
              Discard
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-black flex items-center gap-3 transition-all shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] text-sm"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Inject Ticket
                  <Send size={18} />
                </>
              )}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default CreateTicket;
