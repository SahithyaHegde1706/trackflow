import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { 
  History, 
  User, 
  Ticket, 
  Layers, 
  ArrowRight, 
  Clock,
  Loader2
} from 'lucide-react';

const ActivityStream = ({ projectId }) => {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/activity/${projectId}`);
        setActivities(res.data);
      } catch (error) {
        console.error("Failed to fetch activity logs", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivity();
  }, [projectId]);

  if (loading) return (
    <div className="py-10 flex flex-col items-center justify-center text-slate-600">
       <Loader2 className="animate-spin mb-2" size={24} />
       <p className="text-[10px] font-black uppercase tracking-widest">Intercepting logs...</p>
    </div>
  );

  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-primary/10 rounded-lg text-primary">
                <History size={18} />
             </div>
             <div>
                <h3 className="text-white font-black text-sm tracking-tight">Project Telemetry</h3>
                <p className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">Real-time audit stream</p>
             </div>
          </div>
       </div>

       <div className="relative pl-6 space-y-8 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-px before:bg-slate-800">
          {activities.length === 0 ? (
            <div className="text-slate-600 text-[10px] font-bold uppercase tracking-widest text-center py-10">
               No telemetry captured yet
            </div>
          ) : activities.map((log, i) => (
            <div key={log._id} className="relative animate-in">
               <div className="absolute -left-[23px] top-1.5 w-3.5 h-3.5 rounded-full bg-slate-900 border-2 border-primary shadow-[0_0_10px_rgba(139,92,246,0.3)] z-10" />
               
               <div className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                     <span className="text-[11px] font-black text-white">{log.user?.name}</span>
                     <span className="text-[10px] font-bold text-primary uppercase tracking-widest">{log.action}</span>
                  </div>
                  
                  {log.ticket && (
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 font-medium">
                       <Ticket size={10} className="text-slate-600" />
                       <span className="truncate max-w-[200px]">{log.ticket.title}</span>
                    </div>
                  )}

                  {log.details && (
                    <div className="mt-1 flex items-center gap-2 px-3 py-1 bg-slate-800/50 border border-slate-700/50 rounded-lg w-fit">
                       <span className="text-[9px] font-bold text-slate-500 tabular-nums">{log.details}</span>
                    </div>
                  )}

                  <div className="mt-2 flex items-center gap-1.5 text-[9px] font-bold text-slate-600 uppercase tracking-widest">
                     <Clock size={10} />
                     {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
};

export default ActivityStream;
