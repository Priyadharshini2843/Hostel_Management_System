import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, Filter, Trash2, Edit2, CheckCircle, Shield } from 'lucide-react';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('All');

  const fetchData = async () => {
    try {
      const [complaintsRes, employeesRes] = await Promise.all([
        api.get('/complaints'),
        api.get('/auth/employees')
      ]);
      setComplaints(complaintsRes.data);
      setEmployees(employeesRes.data);
    } catch (error) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleStatusChange = async (id, newStatus) => {
    try {
      await api.put(`/complaints/${id}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      fetchData();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleAssignEmployee = async (complaintId, employeeId) => {
    if (!employeeId) return;
    try {
      await api.put(`/complaints/${complaintId}/assign`, { employeeId });
      toast.success('Employee assigned successfully');
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to assign employee');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this complaint?')) return;
    try {
      await api.delete(`/complaints/${id}`);
      toast.success('Complaint deleted');
      fetchData();
    } catch (error) {
      toast.error('Failed to delete complaint');
    }
  };

  const filteredComplaints = statusFilter === 'All' 
    ? complaints 
    : complaints.filter(c => c.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending': return 'text-amber-500 bg-amber-50';
      case 'Ongoing': return 'text-blue-500 bg-blue-50';
      case 'Resolved': return 'text-emerald-500 bg-emerald-50';
      default: return 'text-gray-500 bg-gray-50';
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

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-xl font-bold flex items-center gap-2">
            <Shield className="text-primary text-secondary" size={24} />
            Admin Panel
          </h1>
        </div>
        <div className="p-6 flex-1">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="font-bold text-lg">{user?.name?.charAt(0)}</span>
            </div>
            <div>
              <p className="font-medium text-sm">{user?.name}</p>
              <p className="text-xs text-gray-400">Warden</p>
            </div>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-gray-800 text-white font-medium transition-colors">
              <Filter size={20} />
              Manage Complaints
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-800">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto w-full">
        <header className="mb-8 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2"><Shield size={20}/> Admin Panel</h1>
            <button onClick={logout} className="p-2 text-red-500"><LogOut size={20}/></button>
        </header>
        
        <div className="mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h2 className="text-3xl font-bold text-text-main">Complaints Overview</h2>
            <p className="text-text-muted mt-1">Manage and update student issues</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white p-1 rounded-lg shadow-sm border border-gray-200">
            {['All', 'Pending', 'Ongoing', 'Resolved'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${statusFilter === status ? 'bg-gray-900 text-white flex-1' : 'text-text-muted hover:text-text-main hover:bg-gray-50 flex-1'}`}
              >
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden text-sm">
          {loading ? (
            <div className="p-12 text-center text-text-muted">Loading data...</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="p-12 text-center text-text-muted flex flex-col items-center">
              <CheckCircle size={48} className="text-gray-300 mb-4" />
              <p>No complaints found matching this filter.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="bg-gray-50 text-text-muted border-b border-gray-200 uppercase tracking-wider text-xs font-semibold">
                    <th className="px-6 py-4">Student Info</th>
                    <th className="px-6 py-4">Issue Details</th>
                    <th className="px-6 py-4 text-center">Priority</th>
                    <th className="px-6 py-4">Assigned To</th>
                    <th className="px-6 py-4 text-center">Status</th>
                    <th className="px-6 py-4">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredComplaints.map(c => (
                    <tr key={c._id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-text-main">{c.createdBy?.name || 'Unknown'}</div>
                        <div className="text-xs text-text-muted mt-1">
                          {c.createdBy?.hostel || 'N/A'} - Room {c.createdBy?.roomNumber || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 max-w-xs">
                        <div className="font-medium text-text-main truncate" title={c.title}>{c.title}</div>
                        <div className="text-xs text-text-muted mt-1 max-w-[200px] truncate" title={c.description}>{c.description}</div>
                        <div className="text-[10px] text-gray-400 mt-1">{new Date(c.createdAt).toLocaleDateString()}</div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(c.priority)}`}>
                          {c.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm max-w-[150px]">
                        <select
                          className="w-full bg-gray-50 border border-gray-200 text-gray-700 text-xs rounded focus:ring-primary focus:border-primary px-2 py-1 cursor-pointer"
                          value={c.assignedTo?._id || ''}
                          onChange={(e) => handleAssignEmployee(c._id, e.target.value)}
                          disabled={c.status === 'Resolved'}
                        >
                          <option value="" disabled>Unassigned</option>
                          {employees.map(emp => (
                            <option key={emp._id} value={emp._id}>{emp.name}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <select
                          className={`appearance-none bg-transparent font-medium text-center focus:outline-none focus:ring-2 focus:ring-gray-200 rounded px-2 py-1 cursor-pointer ${getStatusColor(c.status)}`}
                          value={c.status}
                          onChange={(e) => handleStatusChange(c._id, e.target.value)}
                        >
                          <option className="text-gray-800" value="Pending">Pending</option>
                          <option className="text-gray-800" value="Ongoing">Ongoing</option>
                          <option className="text-gray-800" value="Resolved">Resolved</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => handleDelete(c._id)}
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete Complaint"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
