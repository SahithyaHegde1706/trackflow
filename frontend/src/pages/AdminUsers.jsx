import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '@/config/api';
import { 
  Users, 
  Trash2, 
  ShieldAlert, 
  ShieldCheck, 
  Ban, 
  CheckCircle2, 
  Loader2, 
  Search,
  MoreVertical,
  Mail,
  User as UserIcon,
  Shield
} from 'lucide-react';

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [actionLoading, setActionLoading] = useState(null);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/api/admin/users`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
    setSelectedUsers([]);
  }, []);

  const handleToggleBlock = async (id, currentStatus) => {
    setActionLoading(id);
    try {
      await axios.put(`${API_BASE_URL}/api/admin/user/${id}`, { isBlocked: !currentStatus }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user status');
    } finally {
      setActionLoading(null);
    }
  };

  const handleToggleRole = async (id, currentRole) => {
    setActionLoading(id);
    const newRole = currentRole === 'admin' ? 'user' : 'admin';
    try {
      await axios.put(`${API_BASE_URL}/api/admin/user/${id}`, { role: newRole }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      alert('Failed to update user role');
    } finally {
      setActionLoading(null);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to permanently delete this user?')) return;
    setActionLoading(id);
    try {
      await axios.delete(`${API_BASE_URL}/api/admin/user/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      fetchUsers();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setActionLoading(null);
    }
  };

  const handleBulkAction = async (action, value) => {
    if (action === 'delete') {
      if (!window.confirm(`Are you sure you want to delete ${selectedUsers.length} users?`)) return;
      try {
        await axios.post(`${API_BASE_URL}/api/admin/users/bulk-delete`, { ids: selectedUsers }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) { alert('Bulk delete failed'); }
    } else {
      try {
        await axios.post(`${API_BASE_URL}/api/admin/users/bulk-update`, { ids: selectedUsers, isBlocked: value }, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
      } catch (err) { alert('Bulk update failed'); }
    }
    fetchUsers();
    setSelectedUsers([]);
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) setSelectedUsers([]);
    else setSelectedUsers(filteredUsers.map(u => u._id));
  };

  const toggleSelect = (id) => {
    if (selectedUsers.includes(id)) setSelectedUsers(selectedUsers.filter(uid => uid !== id));
    else setSelectedUsers([...selectedUsers, id]);
  };

  const filteredUsers = users.filter(u => 
    u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8 animate-in pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
           <h1 className="text-3xl font-black text-white tracking-tight">User Directory</h1>
           <p className="text-slate-500 mt-2 font-medium">Manage network access, roles, and security protocols.</p>
        </div>
        
        <div className="relative group min-w-[300px]">
           <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-primary transition-colors" size={16} />
           <input 
             type="text"
             placeholder="Search by identity or email..."
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
             className="w-full bg-slate-800 border border-slate-700 rounded-xl py-2.5 pl-10 pr-4 text-white text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary/50 transition-all shadow-sm"
           />
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-[2.5rem] overflow-hidden shadow-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-900/50">
                <th className="px-8 py-5">
                   <input 
                     type="checkbox" 
                     className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40 transition-all cursor-pointer"
                     checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
                     onChange={toggleSelectAll}
                   />
                </th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Identity</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Clearance</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Network Status</th>
                <th className="px-8 py-5 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Registered</th>
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-500 uppercase tracking-[0.3em]">Protocols</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-700/50">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-8 py-20 text-center">
                    <Loader2 className="animate-spin mx-auto text-primary" size={32} />
                    <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mt-4">Scanning Network...</p>
                  </td>
                </tr>
              ) : filteredUsers.map(u => (
                <tr key={u._id} className={`hover:bg-slate-900/40 transition-colors group ${selectedUsers.includes(u._id) ? 'bg-primary/5' : ''}`}>
                  <td className="px-8 py-5">
                     <input 
                       type="checkbox" 
                       className="w-4 h-4 rounded border-slate-700 bg-slate-900 text-primary focus:ring-primary/40 transition-all cursor-pointer"
                       checked={selectedUsers.includes(u._id)}
                       onChange={() => toggleSelect(u._id)}
                     />
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-2xl bg-slate-900 border border-slate-700 flex items-center justify-center text-primary font-black text-xs shadow-inner uppercase tracking-tighter">
                          {u.name.charAt(0)}
                       </div>
                       <div>
                          <p className="text-white font-black tracking-tight">{u.name}</p>
                          <p className="text-slate-500 text-[11px] font-bold">{u.email}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${
                       u.role === 'admin' 
                         ? 'bg-primary/10 text-primary border-primary/20' 
                         : 'bg-slate-900 text-slate-400 border-slate-700'
                     }`}>
                       {u.role === 'admin' ? <Shield size={12} /> : <UserIcon size={12} />}
                       {u.role}
                     </span>
                  </td>
                  <td className="px-8 py-5">
                     <div className={`flex items-center gap-2 text-[10px] font-black uppercase tracking-widest ${u.isBlocked ? 'text-red-500' : 'text-emerald-500'}`}>
                        {u.isBlocked ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                        {u.isBlocked ? 'Blocked' : 'Active'}
                     </div>
                  </td>
                  <td className="px-8 py-5 font-bold text-slate-500 text-xs tabular-nums">
                     {new Date(u.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-3 opacity-20 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => handleToggleRole(u._id, u.role)}
                        disabled={actionLoading === u._id}
                        className="p-2 text-slate-400 hover:text-primary hover:bg-primary/10 rounded-xl transition-all"
                        title={u.role === 'admin' ? 'Revoke Admin' : 'Make Admin'}
                      >
                         <ShieldAlert size={18} />
                      </button>
                      <button 
                         onClick={() => handleToggleBlock(u._id, u.isBlocked)}
                         disabled={actionLoading === u._id}
                         className={`p-2 rounded-xl transition-all ${u.isBlocked ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 hover:bg-amber-500/10'}`}
                         title={u.isBlocked ? 'Unblock' : 'Block'}
                      >
                         <Ban size={18} />
                      </button>
                      <button 
                         onClick={() => handleDelete(u._id)}
                         disabled={actionLoading === u._id || u.role === 'admin'}
                         className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                         title="Delete"
                      >
                         <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bulk Action Bar */}
      {selectedUsers.length > 0 && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 bg-slate-900/90 backdrop-blur-xl border border-primary/30 rounded-2xl px-8 py-4 shadow-[0_0_40px_rgba(139,92,246,0.2)] flex items-center gap-8 animate-in slide-in-from-bottom-8 z-50">
           <div className="flex flex-col">
              <span className="text-white font-black text-sm">{selectedUsers.length} Users Selected</span>
              <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest leading-none">Global Protocals Active</span>
           </div>
           
           <div className="h-8 w-px bg-slate-800" />
           
           <div className="flex items-center gap-4">
              <button 
                onClick={() => handleBulkAction('block', true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500/10 hover:bg-amber-500/20 text-amber-500 border border-amber-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Ban size={14} /> Bulk Block
              </button>
              <button 
                onClick={() => handleBulkAction('block', false)}
                className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-500 border border-emerald-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <CheckCircle2 size={14} /> Bulk Unblock
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                <Trash2 size={14} /> Bulk Delete
              </button>
           </div>
           
           <button 
             onClick={() => setSelectedUsers([])}
             className="ml-4 p-2 text-slate-500 hover:text-white transition-colors"
           >
              Cancel
           </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
