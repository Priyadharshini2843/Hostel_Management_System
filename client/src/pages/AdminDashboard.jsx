import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, Trash2, CheckCircle, Shield, Filter } from 'lucide-react';
import './AdminDashboard.css';

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
    : complaints.filter((c) => c.status === statusFilter);

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'status-badge status-badge--pending';
      case 'Assigned':
        return 'status-badge status-badge--assigned';
      case 'In Progress':
        return 'status-badge status-badge--in-progress';
      case 'Resolved':
        return 'status-badge status-badge--resolved';
      case 'Closed':
        return 'status-badge status-badge--closed';
      default:
        return 'status-badge status-badge--closed';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'priority-badge priority-badge--high';
      case 'Medium':
        return 'priority-badge priority-badge--medium';
      case 'Low':
        return 'priority-badge priority-badge--low';
      default:
        return 'priority-badge priority-badge--default';
    }
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter((c) => c.status === 'Pending').length,
    assigned: complaints.filter((c) => c.status === 'Assigned').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
    closed: complaints.filter((c) => c.status === 'Closed').length,
  };

  return (
    <div className="admin-page">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__header">
          <h1 className="admin-sidebar__title">
            <Shield size={24} /> Admin Panel
          </h1>
        </div>
        <div className="admin-sidebar__content">
          <div className="admin-profile">
            <div className="admin-profile__avatar">{user?.name?.charAt(0)}</div>
            <div className="admin-profile__info">
              <p className="admin-profile__role">Admin</p>
              <p className="admin-profile__role">Warden</p>
            </div>
          </div>
          <nav className="admin-nav">
            <button className="admin-nav__button">
              <Filter size={20} /> Manage Complaints
            </button>
          </nav>
        </div>
        <div className="admin-sidebar__content">
          <button className="admin-logout" onClick={logout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="admin-main">
        <div className="admin-header--mobile">
          <h1 className="admin-sidebar__title">
            <Shield size={20} /> Admin Panel
          </h1>
          <button className="admin-logout" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <p className="admin-stat-card__title">Total Tasks</p>
            <p className="admin-stat-card__value">{stats.total}</p>
          </div>
          <div className="admin-stat-card admin-stat-card--pending">
            <p className="admin-stat-card__title">Pending</p>
            <p className="admin-stat-card__value">{stats.pending}</p>
          </div>
          <div className="admin-stat-card admin-stat-card--assigned">
            <p className="admin-stat-card__title">Assigned</p>
            <p className="admin-stat-card__value">{stats.assigned}</p>
          </div>
          <div className="admin-stat-card admin-stat-card--progress">
            <p className="admin-stat-card__title">In Progress</p>
            <p className="admin-stat-card__value">{stats.inProgress}</p>
          </div>
        </div>

        <div className="admin-overview">
          <div>
            <h2 className="dashboard-title">Complaints Overview</h2>
            <p className="dashboard-subtitle">Manage and update student issues</p>
          </div>
          <div className="admin-filter-bar">
            {['All', 'Pending', 'Assigned', 'In Progress', 'Resolved', 'Closed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`filter-pill ${statusFilter === status ? 'filter-pill--active' : ''}`}>
                {status}
              </button>
            ))}
          </div>
        </div>

        <div className="admin-table-wrapper">
          {loading ? (
            <div className="text-muted">Loading data...</div>
          ) : filteredComplaints.length === 0 ? (
            <div className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
              <CheckCircle size={48} style={{ color: '#94a3b8', marginBottom: '1rem' }} />
              <div>No complaints found matching this filter.</div>
            </div>
          ) : (
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Student Info</th>
                  <th>Issue Details</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Assigned To</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredComplaints.map((c) => (
                  <tr key={c._id}>
                    <td>
                      <div className="table-label">{c.createdBy?.name || 'Unknown'}</div>
                      <div className="table-meta">{c.createdBy?.hostel || 'N/A'} - Room {c.createdBy?.roomNumber || 'N/A'}</div>
                    </td>
                    <td>
                      <div className="table-label" title={c.title}>{c.title}</div>
                      <div className="table-meta" title={c.description}>{c.description}</div>
                      <div className="table-meta">{new Date(c.createdAt).toLocaleDateString()}</div>
                    </td>
                    <td>
                      <div className="badge">{c.category || 'Other'}</div>
                    </td>
                    <td>
                      <div className={getPriorityBadgeClass(c.priority)}>{c.priority}</div>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={c.assignedTo?._id || ''}
                        onChange={(e) => handleAssignEmployee(c._id, e.target.value)}
                        disabled={c.status === 'Resolved'}>
                        <option value="" disabled>Unassigned</option>
                        {employees.map((emp) => (
                          <option key={emp._id} value={emp._id}>{emp.name} ({emp.department || 'Other'})</option>
                        ))}
                      </select>
                    </td>
                    <td>
                      <select
                        className="admin-select"
                        value={c.status}
                        onChange={(e) => handleStatusChange(c._id, e.target.value)}>
                        <option value="Pending">Pending</option>
                        <option value="Assigned">Assigned</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Resolved">Resolved</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </td>
                    <td>
                      <button className="admin-action-button" onClick={() => handleDelete(c._id)}>
                        <Trash2 size={18} /> Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;
