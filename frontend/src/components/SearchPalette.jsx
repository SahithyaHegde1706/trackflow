import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Search, 
  Command, 
  Ticket, 
  Layers, 
  ChevronRight, 
  Loader2,
  X
} from 'lucide-react';

const SearchPalette = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ projects: [], tickets: [] });
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const navigate = useNavigate();
  const location = useLocation();
  const inputRef = useRef(null);
  
  // Flatten results for keyboard navigation
  const flatResults = [
    ...results.projects.map(p => ({ type: 'project', item: p })),
    ...results.tickets.map(t => ({ type: 'ticket', item: t }))
  ];

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsOpen(prev => !prev);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery('');
      setResults({ projects: [], tickets: [] });
      setActiveIndex(-1);
    }
  }, [isOpen]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (!query.trim()) {
        setResults({ projects: [], tickets: [] });
        return;
      }

      setLoading(true);
      try {
        const res = await axios.get(`${API_BASE_URL}/api/search?q=${query}`);
        setResults(res.data);
        setActiveIndex(-1); // Reset index on new results
      } catch (error) {
        console.error("Search error", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelect = (type, item) => {
    setIsOpen(false);
    const target = type === 'project' ? `/project/${item._id}` : `/ticket/${item._id}`;
    
    if (location.pathname !== target) {
      navigate(target);
    }
  };

  const handleInputKeyDown = (e) => {
    if (!flatResults.length) return;
    
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex(prev => (prev < flatResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex(prev => (prev > 0 ? prev - 1 : flatResults.length - 1));
    } else if (e.key === 'Enter' && activeIndex >= 0) {
      e.preventDefault();
      const selected = flatResults[activeIndex];
      handleSelect(selected.type, selected.item);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-start justify-center pt-[15vh] px-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm animate-in fade-in" onClick={() => setIsOpen(false)} />
      
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/50 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in slide-in-from-top-4 duration-300">
        <div className="flex items-center px-4 py-4 border-b border-slate-700/50 bg-slate-800/50">
          <Search className="text-slate-500 mr-3" size={20} />
          <input 
            ref={inputRef}
            type="text"
            placeholder="Search projects, tickets, or documentation..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleInputKeyDown}
            className="flex-1 bg-transparent border-none text-white placeholder:text-slate-600 focus:ring-0 text-sm font-medium"
          />
          <div className="flex items-center gap-1.5 px-2 py-1 bg-slate-900 rounded-md border border-slate-700/50 text-[10px] font-black text-slate-500 uppercase">
            <X size={12} className="cursor-pointer hover:text-white" onClick={() => setIsOpen(false)} />
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto p-2 no-scrollbar">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-slate-600">
               <Loader2 className="animate-spin mb-3" size={32} />
               <p className="text-[10px] font-black uppercase tracking-widest">Scanning network...</p>
            </div>
          ) : query && results.projects.length === 0 && results.tickets.length === 0 ? (
            <div className="py-20 text-center text-slate-500">
               <p className="text-sm font-medium">No matches found for "{query}"</p>
               <p className="text-[10px] font-black uppercase tracking-widest mt-2">Check the protocol identifier</p>
            </div>
          ) : !query ? (
            <div className="p-4 space-y-6">
               <div>
                  <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-3 px-2">Navigation</h4>
                  <div className="grid grid-cols-2 gap-2">
                     <div onClick={() => { setIsOpen(false); navigate('/projects'); }} className="p-3 bg-slate-800/50 border border-slate-700/30 rounded-xl hover:border-primary transition-all flex items-center gap-3 cursor-pointer group">
                        <Layers size={16} className="text-slate-500 group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold text-slate-300">All Projects</span>
                     </div>
                     <div onClick={() => { setIsOpen(false); navigate('/admin-dashboard'); }} className="p-3 bg-slate-800/50 border border-slate-700/30 rounded-xl hover:border-primary transition-all flex items-center gap-3 cursor-pointer group">
                        <Command size={16} className="text-slate-500 group-hover:text-primary transition-colors" />
                        <span className="text-[11px] font-bold text-slate-300">Admin Panel</span>
                     </div>
                  </div>
               </div>
               <div className="p-4 bg-primary/5 border border-primary/20 rounded-xl">
                  <p className="text-[10px] font-black text-primary uppercase tracking-widest mb-1">Expert Tip</p>
                  <p className="text-[11px] text-slate-400 font-medium leading-relaxed">Use keywords to find specific tickets across all your project workspaces instantly.</p>
               </div>
            </div>
          ) : (
            <div className="space-y-4 p-2">
              {results.projects.length > 0 && (
                <div className="space-y-1">
                   <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">Project Entities</h4>
                   {results.projects.map((p, idx) => {
                     const isProjectActive = activeIndex === idx;
                     return (
                      <div 
                       key={p._id} 
                       onClick={() => handleSelect('project', p)}
                       className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isProjectActive ? 'bg-slate-800 border-primary/50 ring-1 ring-primary/20' : 'hover:bg-slate-800 border-transparent hover:border-slate-700/50'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center transition-all ${isProjectActive ? 'bg-primary text-white' : 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white'}`}>
                               <Layers size={14} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-200">{p.name}</p>
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{p.owner?.name || 'Workspace'}</p>
                            </div>
                         </div>
                         <ChevronRight size={14} className={`${isProjectActive ? 'text-primary' : 'text-slate-600 group-hover:text-white'} transition-colors`} />
                      </div>
                     );
                   })}
                </div>
              )}

              {results.tickets.length > 0 && (
                <div className="space-y-1 pt-2">
                   <h4 className="text-[10px] font-black text-slate-600 uppercase tracking-widest mb-2 px-2">Ticket Manifests</h4>
                   {results.tickets.map((t, idx) => {
                     const isTicketActive = activeIndex === (results.projects.length + idx);
                     return (
                      <div 
                       key={t._id}
                       onClick={() => handleSelect('ticket', t)}
                       className={`group flex items-center justify-between p-3 rounded-xl border transition-all cursor-pointer ${isTicketActive ? 'bg-slate-800 border-primary/50 ring-1 ring-primary/20' : 'hover:bg-slate-800 border-transparent hover:border-slate-700/50'}`}
                      >
                         <div className="flex items-center gap-4">
                            <div className={`w-8 h-8 rounded-lg ${t.priority === 'High' ? 'bg-orange-500/10 text-orange-500' : 'bg-blue-500/10 text-blue-500'} flex items-center justify-center transition-all ${isTicketActive ? 'scale-110 shadow-lg' : 'group-hover:scale-110'}`}>
                               <Ticket size={14} />
                            </div>
                            <div>
                               <p className="text-xs font-bold text-slate-200">{t.title}</p>
                               <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{t.project?.name} • ISSUE-{t._id.slice(-4).toUpperCase()}</p>
                            </div>
                         </div>
                         <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider bg-slate-700 ${isTicketActive ? 'text-primary border border-primary/30' : 'text-slate-400'}`}>{t.status}</span>
                      </div>
                     );
                   })}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="p-3 bg-slate-800/30 border-t border-slate-700/50 flex items-center justify-between">
           <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                 <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">Enter</span>
                 <span>select</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-500 uppercase tracking-widest leading-none">
                 <span className="px-1.5 py-0.5 bg-slate-800 border border-slate-700 rounded text-slate-400">Esc</span>
                 <span>close</span>
              </div>
           </div>
           <p className="text-[9px] font-black text-primary/50 uppercase tracking-[0.2em] italic">Search Protocol Phase 1</p>
        </div>
      </div>
    </div>
  );
};

export default SearchPalette;
