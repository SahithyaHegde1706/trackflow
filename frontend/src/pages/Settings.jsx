import React, { useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, 
  HelpCircle, 
  Zap, 
  CheckCircle2, 
  Mail, 
  Lock, 
  Bug, 
  Layers, 
  Users, 
  Shield, 
  Upload, 
  MessageSquare,
  PlusCircle,
  UserPlus,
  Ticket,
  Kanban,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TabButton = ({ id, label, icon, activeTab, setActiveTab }) => {
  const isActive = activeTab === id;
  return (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all duration-300 font-bold text-sm min-w-fit ${
        isActive 
          ? "border-primary text-primary bg-primary/5" 
          : "border-transparent text-slate-500 hover:text-slate-300 hover:bg-slate-800/50"
      }`}
    >
      {React.cloneElement(icon, { size: 16 })}
      {label}
    </button>
  );
};

const FeatureCard = ({ icon, title, desc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.1, duration: 0.5 }}
    whileHover={{ 
      scale: 1.05, 
      boxShadow: "0 0 25px rgba(124, 58, 237, 0.15)",
      borderColor: "rgba(124, 58, 237, 0.5)"
    }}
    className="bg-slate-800/60 backdrop-blur-md border border-slate-700/50 p-6 rounded-[2rem] transition-all cursor-pointer group relative overflow-hidden h-full"
  >
    {/* Background Glow */}
    <div className="absolute -right-4 -top-4 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors" />
    
    <div className="relative z-10 flex flex-col items-center text-center h-full">
      <motion.div 
        animate={{ y: [0, -5, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white mb-6 shadow-xl shadow-primary/20 group-hover:rotate-6 transition-transform"
      >
        {React.cloneElement(icon, { size: 28 })}
      </motion.div>
      <h4 className="text-white font-bold text-lg mb-3 group-hover:text-primary transition-colors">{title}</h4>
      <p className="text-slate-400 text-xs leading-relaxed font-medium">{desc}</p>
    </div>
  </motion.div>
);

const Settings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    password: ''
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      await axios.put(`${API_BASE_URL}/api/users/profile`, formData);
      setSuccess('Profile updated successfully');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Bug />, title: "Issue Tracking", desc: "Advanced bug reporting with custom status flows and deep contextual tags." },
    { icon: <Layers />, title: "Kanban Board", desc: "Interactive drag-and-drop workspace optimized for high-performance team workflows." },
    { icon: <Users />, title: "Collaboration", desc: "Real-time presence and assignment system to keep your entire team in total sync." },
    { icon: <Shield />, title: "RBAC Security", desc: "Enterprise-grade role-based access control to secure your sensitive project data." },
    { icon: <Upload />, title: "Cloud Storage", desc: "Seamlessly attach screenshots, logs, and technical documents directly to tickets." },
    { icon: <MessageSquare />, title: "Live Feedback", desc: "Deeply integrated commenting system for real-time discussion and knowledge sharing." }
  ];

  const steps = [
    { icon: <PlusCircle />, title: "Create Workspace", desc: "Define your project boundaries." },
    { icon: <UserPlus />, title: "Invite Talent", desc: "Onboard your engineering team." },
    { icon: <Ticket />, title: "Inject Issues", desc: "Populate your tracking backlog." },
    { icon: <Kanban />, title: "Track Sprint", desc: "Flow tickets from start to finish." }
  ];

  return (
    <div className="max-w-5xl mx-auto py-12 px-6 animate-in relative">
      {/* Background Animated Blobs */}
      <div className="absolute top-1/4 -left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[128px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 -right-1/4 w-96 h-96 bg-indigo-500/5 rounded-full blur-[128px] pointer-events-none animate-pulse animation-delay-2000" />

      <div className="mb-12">
        <h1 className="text-4xl font-black text-white tracking-tight">Settings</h1>
        <p className="text-slate-500 mt-2 text-lg">Elevate your workflow and manage your enterprise identity.</p>
      </div>

      {/* Top Tabs Navigation */}
      <div className="flex border-b border-slate-800 mb-12 overflow-x-auto no-scrollbar scroll-smooth">
        <TabButton id="profile" label="Identity" icon={<User />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="guide" label="Knowledge Base" icon={<HelpCircle />} activeTab={activeTab} setActiveTab={setActiveTab} />
        <TabButton id="features" label="Core Features" icon={<Zap />} activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>

      {/* Content Area */}
      <div className="relative z-10">
        <AnimatePresence mode="wait">
          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] p-8 sm:p-12 shadow-2xl">
                <h2 className="text-2xl font-bold text-white mb-8">Personal Credentials</h2>
                
                {success && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 p-4 rounded-2xl text-xs mb-8 flex items-center gap-3">
                    <CheckCircle2 size={18} />
                    <span className="font-bold">{success}</span>
                  </motion.div>
                )}

                {error && (
                  <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-2xl text-xs mb-8 flex items-center gap-3">
                    <Bug size={18} />
                    <span className="font-bold">{error}</span>
                  </motion.div>
                )}

                <form onSubmit={handleUpdateProfile} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Legal Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Network Identity (Email)</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/40 transition-all text-sm font-medium"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-black text-slate-500 uppercase tracking-[0.2em] px-1">Security Key (Password)</label>
                    <div className="relative">
                      <input
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="w-full bg-slate-900/50 border border-slate-700 rounded-2xl py-4 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm"
                        placeholder="••••••••"
                      />
                      <Lock className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-700" size={18} />
                    </div>
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white px-8 py-4 rounded-2xl font-black transition-all shadow-2xl shadow-primary/30 hover:scale-[1.02] active:scale-[0.98] text-sm w-full tracking-[0.1em] uppercase"
                    >
                      {loading ? 'Processing...' : 'Secure Changes'}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}

          {activeTab === 'guide' && (
            <motion.div 
              key="guide"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-in"
            >
              {steps.map((step, i) => (
                <motion.div 
                  initial={{ scale: 0.9, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: i * 0.1 }}
                  key={i} 
                  className="bg-slate-800/40 border border-slate-700/50 p-8 rounded-[2.5rem] group flex flex-col items-center text-center hover:bg-slate-800/80 transition-all"
                >
                  <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-primary mb-6 group-hover:border-primary/50 transition-all">
                    {React.cloneElement(step.icon, { size: 28 })}
                  </div>
                  <h3 className="text-white font-black mb-3 text-lg">{step.title}</h3>
                  <p className="text-slate-500 text-xs leading-relaxed font-semibold">{step.desc}</p>
                  <div className="mt-6 text-[10px] font-black text-slate-700 tracking-[0.4em] uppercase">PHASE 0{i+1}</div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {activeTab === 'features' && (
            <motion.div 
              key="features"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {features.map((feature, i) => (
                <FeatureCard key={i} index={i} {...feature} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Settings;
