import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, CheckCircle, Wrench, Clock, FileText } from 'lucide-react';

const EmployeeDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [editingId, setEditingId] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [repairNotes, setRepairNotes] = useState('');

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load assigned complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/complaints/${editingId}/status`, { status: newStatus, repairNotes });
      toast.success('Complaint updated successfully');
      setEditingId(null);
      setNewStatus('');
      setRepairNotes('');
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update complaint');
    }
  };

  const openEditModal = (complaint) => {
    setEditingId(complaint._id);
    setNewStatus(complaint.status);
    setRepairNotes(complaint.repairNotes || '');
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-500 bg-amber-50 border-amber-200';
      case 'Assigned': return 'text-purple-500 bg-purple-50 border-purple-200';
      case 'In Progress': return 'text-blue-500 bg-blue-50 border-blue-200';
      case 'Resolved': return 'text-emerald-500 bg-emerald-50 border-emerald-200';
      case 'Closed': return 'text-gray-500 bg-gray-100 border-gray-300';
      default: return 'text-gray-500 bg-gray-50 border-gray-200';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return 'text-red-500 bg-red-100';
      case 'Medium': return 'text-orange-500 bg-orange-100';
      case 'Low': return 'text-green-500 bg-green-100';
      default: return 'text-gray-500 bg-gray-100';
    }
  };

  const stats = {
    total: complaints.length,
    assigned: complaints.filter(c => c.status === 'Assigned').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="min-h-screen flex bg-background relative">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col hidden md:flex text-white">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-xl font-bold flex items-center gap-2 text-blue-400">
            <Wrench size={24} />
            Staff Panel
          </h1>
        </div>
        <div className="p-6 flex-1">
          <div className="flex flex-col items-center text-center p-4 bg-slate-800 rounded-xl mb-6 shadow-sm border border-slate-700">
            <div className="w-16 h-16 rounded-full bg-blue-500/20 text-blue-400 flex items-center justify-center mb-3">
              <Wrench size={24} />
            </div>
            <h3 className="font-semibold">{user?.name}</h3>
            <p className="text-sm text-slate-400">Maintainance Staff</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-blue-500/10 text-blue-400 font-medium transition-colors border border-blue-500/20">
              <FileText size={20} />
              Assigned Tasks
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-slate-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-slate-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <header className="mb-8 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold text-blue-500 flex items-center gap-2"><Wrench size={20}/> Staff Panel</h1>
            <button onClick={logout} className="p-2 text-red-500"><LogOut size={20}/></button>
        </header>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-main">Welcome, {user?.name}</h2>
          <p className="text-text-muted mt-1">Here are your assigned maintenance tasks.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-gray-100 text-gray-600 rounded-lg"><FileText size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Total Tasks</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-500 rounded-lg"><Clock size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Assigned</p>
              <p className="text-2xl font-bold text-gray-900">{stats.assigned}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-500 rounded-lg"><Wrench size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">In Progress</p>
              <p className="text-2xl font-bold text-gray-900">{stats.inProgress}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-500 rounded-lg"><CheckCircle size={24} /></div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Resolved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-sm">
          {loading ? (
            <div className="p-12 text-center text-text-muted">Loading assigned tasks...</div>
          ) : complaints.length === 0 ? (
            <div className="p-12 text-center text-text-muted flex flex-col items-center">
              <CheckCircle size={48} className="text-emerald-400 opacity-50 mb-4" />
              <p>You have no assigned tasks. Great job!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-text-muted border-b border-gray-200 uppercase tracking-wider text-xs font-semibold">
                    <th className="px-6 py-4">Task Details</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4 text-center">Category</th>
                    <th className="px-6 py-4 text-center">Priority</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Notes</th>
                    <th className="px-6 py-4 text-center">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {complaints.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-main">{c.title}</div>
                        <div className="text-xs text-text-muted mt-1 max-w-[200px] truncate" title={c.description}>
                          {c.description}
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1">Assigned on: {c.assignedDate ? new Date(c.assignedDate).toLocaleDateString() : 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-medium text-text-main">{c.createdBy?.hostel || 'N/A'}</div>
                        <div className="text-xs text-text-muted mt-1">Room {c.createdBy?.roomNumber || 'N/A'}</div>
                        <div className="text-[10px] text-gray-400 mt-1">By {c.createdBy?.name || 'Unknown'}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border border-gray-200 bg-gray-50 text-gray-700">
                          {c.category || 'Other'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(c.status)}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-xs text-text-muted max-w-[150px] truncate" title={c.repairNotes}>
                        {c.repairNotes || 'No notes added yet'}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {c.status !== 'Resolved' && c.status !== 'Closed' ? (
                          <button 
                            onClick={() => openEditModal(c)}
                            className="text-white bg-blue-500 hover:bg-blue-600 px-3 py-1.5 rounded-md text-xs font-medium transition-colors shadow-sm"
                          >
                            Update
                          </button>
                        ) : (
                          <span className={`${c.status === 'Closed' ? 'text-gray-500 border-gray-300 bg-gray-100' : 'text-emerald-500 border-emerald-200 bg-emerald-50'} border px-3 py-1.5 rounded-md text-xs font-medium inline-block`}>
                            {c.status}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editingId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Update Task Status</h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 text-sm border"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Repair Notes</label>
                <textarea 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-blue-500 py-2 px-3 text-sm border min-h-[100px]"
                  placeholder="Enter details of repairs made, parts used, etc..."
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setEditingId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeDashboard;
