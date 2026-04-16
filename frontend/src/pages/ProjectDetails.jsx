import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API, { API_BASE_URL } from '@/config/api';
import { 
  ChevronLeft, 
  Settings, 
  Users, 
  Search, 
  Plus, 
  Loader2, 
  Bug,
  Filter,
  X,
  Clock,
  MessageSquare,
  Paperclip,
  Trash2,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import KanbanBoard from '../components/KanbanBoard';
import ActivityStream from '../components/ActivityStream';
import { io } from 'socket.io-client';

const socket = io(API_BASE_URL, {
  transports: ['websocket'],
  autoConnect: false,
  withCredentials: true
});

const ProjectDetails = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('All');
  const [activeView, setActiveView] = useState('board'); // board or activity
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');

  const fetchData = async () => {
    try {
      const [projRes, ticketRes] = await Promise.all([
        API.get(`/api/projects/${projectId}`),
        API.get(`/api/projects/${projectId}/tickets`)
      ]);
      setProject(projRes.data);
      setTickets(ticketRes.data);
      setError(null);
    } catch (error) {
      console.error("Data fetch error", error);
      setError("Failed to load project data. Please verify connectivity.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!projectId) return;
    
    setLoading(true);
    fetchData();

    // Socket.io setup
    socket.connect();
    socket.emit('joinProject', projectId);

    socket.on('ticketUpdated', (updatedTicket) => {
      setTickets(prev => prev.map(t => t._id === updatedTicket._id ? { ...t, ...updatedTicket } : t));
    });

    socket.on('ticketCreated', (newTicket) => {
      setTickets(prev => {
        if (prev.some(t => t._id === newTicket._id)) return prev;
        return [...prev, newTicket];
      });
    });

    return () => {
      socket.off('ticketUpdated');
      socket.off('ticketCreated');
      socket.disconnect();
    };
  }, [projectId]);

  const handleDragEnd = async (result) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const updatedTickets = tickets.map(t => {
      if (t._id === draggableId) {
        return { ...t, status: destination.droppableId };
      }
      return t;
    });
    setTickets(updatedTickets);

    try {
      await API.put(`/api/tickets/${draggableId}`, {
        status: destination.droppableId
      });
    } catch (error) {
      console.error("Failed to update ticket status", error);
      fetchData();
    }
  };

  const handleDeleteTicket = async (ticketId) => {
    if (!window.confirm("Are you sure you want to delete this ticket?")) return;
    try {
      await API.delete(`/api/tickets/${ticketId}`);
      setTickets(prev => prev.filter(t => t._id !== ticketId));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleInviteUser = async (e) => {
    e.preventDefault();
    try {
      await API.post(`/api/projects/${projectId}/invite`, { email: inviteEmail });
      alert('Invite sent successfully!');
      setShowInviteModal(false);
      setInviteEmail('');
    } catch (error) {
      alert(error.response?.data?.message || 'Error sending invite');
    }
  };

  const handleTicketSelect = (id) => {
    if (selectedTickets.includes(id)) setSelectedTickets(selectedTickets.filter(tid => tid !== id));
    else setSelectedTickets([...selectedTickets, id]);
  };

  const handleBulkTicketAction = async (action, value) => {
    try {
      if (action === 'move') {
        await API.post(`/api/tickets/bulk-update`, { ids: selectedTickets, status: value });
      } else if (action === 'delete') {
        if (!window.confirm(`Delete ${selectedTickets.length} tickets permanently?`)) return;
        await API.post(`/api/tickets/bulk-delete`, { ids: selectedTickets });
      }
      fetchData();
      setSelectedTickets([]);
    } catch (err) {
      alert("Bulk operation failed");
    }
  };

  const filteredTickets = tickets.filter(t => {
    const matchesSearch = t.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesPriority = priorityFilter === 'All' || t.priority === priorityFilter;
    return matchesSearch && matchesPriority;
  });

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
      <Loader2 className="animate-spin text-primary" size={40} />
      <p className="text-slate-500 font-bold text-xs uppercase tracking-widest animate-pulse">Synchronizing board...</p>
    </div>
  );

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <AlertCircle className="text-red-500" size={40} />
        <p className="text-red-500 font-bold text-xs uppercase tracking-widest leading-relaxed text-center px-10">{error}</p>
        <button onClick={() => navigate('/projects')} className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700">Back to Projects</button>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="flex flex-col items-center justify-center h-[80vh] space-y-4">
        <Search className="text-slate-500" size={40} />
        <p className="text-slate-500 font-bold text-xs uppercase tracking-widest">Project manifest not found</p>
        <button onClick={() => navigate('/projects')} className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-slate-700 transition-all border border-slate-700">Back to Projects</button>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col space-y-8 animate-in pb-10">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 px-1">
        <div className="flex items-start gap-5">
           <button onClick={() => navigate('/projects')} className="mt-1 p-2.5 bg-slate-800 border border-slate-700/50 rounded-xl text-slate-500 hover:text-white hover:border-slate-600 transition-all shadow-sm flex items-center gap-1 font-bold text-sm">
             <ChevronLeft size={16} /> Back
           </button>
           <div>
              <div className="flex items-center gap-3 mb-2">
                 <h1 className="text-3xl font-black text-white tracking-tight">{project?.name}</h1>
                 <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg uppercase tracking-wider bg-primary/10 text-primary border border-primary/20`}>Active Sprint</span>
              </div>
              <p className="text-slate-500 text-sm font-medium max-w-2xl leading-relaxed">{project?.description}</p>
           </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="flex items-center -space-x-3 mr-2">
              {project?.members?.slice(0, 5).map(m => (
                <div key={m.user?._id || Math.random()} className="w-9 h-9 bg-gradient-to-br from-primary to-indigo-600 text-white rounded-full border-2 border-slate-900 flex items-center justify-center text-[11px] font-bold shadow-lg" title={m.user?.name}>
                  {m.user?.name?.charAt(0).toUpperCase()}
                </div>
              ))}
              {project?.members?.length > 5 && (
                <div className="w-9 h-9 rounded-full bg-slate-900 border-2 border-slate-900 flex items-center justify-center text-[10px] font-black text-slate-700 shadow-inner">
                  +{project?.members?.length - 5}
                </div>
              )}
           </div>
           <button 
             onClick={() => setShowInviteModal(true)}
             className="p-3 bg-slate-800 border border-slate-700 text-slate-500 rounded-xl hover:text-white hover:border-slate-600 transition-all">
             <Users size={18} />
           </button>
           <button className="p-3 bg-slate-800 border border-slate-700 text-slate-500 rounded-xl hover:text-white hover:border-slate-600 transition-all">
             <Settings size={18} />
           </button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center gap-4 p-4 bg-slate-800/40 border border-slate-700/30 rounded-2xl shadow-sm">
        <div className="relative flex-1 w-full md:max-w-md group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
          <input 
            type="text"
            placeholder="Filter by title or content..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700/50 rounded-xl py-2.5 pl-11 pr-4 text-sm text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all"
          />
        </div>
        
        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter size={14} className="text-slate-500 ml-2" />
          <select 
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-slate-900 border border-slate-700/50 text-slate-400 text-xs font-bold py-2.5 px-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all uppercase tracking-widest"
          >
            <option value="All">All Priorities</option>
            <option value="High">High Only</option>
            <option value="Medium">Medium Only</option>
            <option value="Low">Low Only</option>
            <option value="Critical">Critical Only</option>
          </select>
        </div>

        <div className="hidden md:block h-8 w-px bg-slate-700/50 mx-2" />
        
        <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-700/50">
           <button 
             onClick={() => setActiveView('board')}
             className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'board' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Board
           </button>
           <button 
             onClick={() => setActiveView('activity')}
             className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${activeView === 'activity' ? 'bg-slate-800 text-white' : 'text-slate-500 hover:text-slate-300'}`}
           >
             Activity
           </button>
        </div>

        <div className="hidden md:block h-8 w-px bg-slate-700/50 mx-2" />

        <button 
          onClick={() => navigate(`/projects/${projectId}/new-ticket`)}
          className="w-full md:w-auto bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white px-6 py-2.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98]"
        >
          <Plus size={16} />
          New Ticket
        </button>
      </div>

      {/* Dynamic Content Area */}
      <div className="flex-1 min-h-[600px] overflow-hidden">
        {activeView === 'board' ? (
          <KanbanBoard 
            tickets={filteredTickets} 
            onDragEnd={handleDragEnd} 
            onOpenTicket={(ticket) => navigate(`/ticket/${ticket._id}`)}
            onAddTicket={() => navigate(`/projects/${projectId}/new-ticket`)}
            selectedTickets={selectedTickets}
            onToggleSelect={handleTicketSelect}
            onDeleteTicket={handleDeleteTicket}
          />
        ) : (
          <div className="bg-slate-800/40 border border-slate-700/30 rounded-[2.5rem] p-10 shadow-inner overflow-y-auto max-h-[700px] no-scrollbar animate-in">
             <ActivityStream projectId={projectId} />
          </div>
        )}
      </div>

       {/* Bulk Action Bar for Tickets */}
      {selectedTickets.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-primary/30 rounded-2xl px-8 py-4 shadow-[0_0_40px_rgba(139,92,246,0.2)] flex items-center gap-8 animate-in slide-in-from-bottom-8 z-50">
           <div className="flex flex-col">
              <span className="text-white font-black text-sm">{selectedTickets.length} Issues Selected</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Mass Movement Active</span>
           </div>
           
           <div className="h-8 w-px bg-slate-800" />
           
           <div className="flex items-center gap-3">
              <button 
                onClick={() => handleBulkTicketAction('move', 'To Do')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
              >
                To Do
              </button>
              <button 
                onClick={() => handleBulkTicketAction('move', 'In Progress')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
              >
                Progress
              </button>
              <button 
                onClick={() => handleBulkTicketAction('move', 'Done')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-[10px] font-black uppercase text-slate-400 hover:text-white rounded-lg border border-slate-700 transition-all"
              >
                Done
              </button>
              <button 
                onClick={() => handleBulkTicketAction('delete')}
                className="ml-2 p-1.5 text-slate-500 hover:text-red-500 transition-colors"
                title="Bulk Delete"
              >
                <Trash2 size={18} />
              </button>
           </div>
           
           <button 
             onClick={() => setSelectedTickets([])}
             className="ml-4 p-2 text-slate-500 hover:text-white transition-colors"
           >
              Cancel
           </button>
        </div>
      )}

      {showInviteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={() => setShowInviteModal(false)} />
          <div className="relative w-full max-w-md bg-slate-800 border border-slate-700 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl animate-in">
            <button 
              onClick={() => setShowInviteModal(false)}
              className="absolute top-8 right-8 text-slate-500 hover:text-white p-2"
            >
              <X size={20} />
            </button>
            <div className="mb-8">
               <h2 className="text-2xl font-black text-white tracking-tight">Invite Team Member</h2>
               <p className="text-slate-500 text-sm mt-1 font-medium">Add collaborators to this workspace</p>
            </div>
            <form onSubmit={handleInviteUser} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[11px] font-black text-slate-500 uppercase tracking-widest px-1">Email Address</label>
                <input 
                  type="email"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-2xl py-3.5 px-6 text-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition-all text-sm font-medium"
                  placeholder="colleague@example.com"
                  required
                />
              </div>
              <button 
                type="submit"
                className="w-full bg-gradient-to-r from-primary to-indigo-600 hover:opacity-90 text-white font-black py-4 rounded-2xl transition-all shadow-xl shadow-primary/30 mt-6 uppercase tracking-widest text-xs"
              >
                Send Invitation
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectDetails;