import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, CheckCircle, Wrench, Clock, FileText } from 'lucide-react';
import ImageGallery from '../components/ImageGallery';
import './EmployeeDashboard.css';

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

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Pending':
        return 'employee-status-badge employee-status-badge--pending';
      case 'Assigned':
        return 'employee-status-badge employee-status-badge--assigned';
      case 'In Progress':
        return 'employee-status-badge employee-status-badge--in-progress';
      case 'Resolved':
        return 'employee-status-badge employee-status-badge--resolved';
      case 'Closed':
        return 'employee-status-badge employee-status-badge--closed';
      default:
        return 'employee-status-badge employee-status-badge--closed';
    }
  };

  const getPriorityBadgeClass = (priority) => {
    switch (priority) {
      case 'High':
        return 'employee-priority-badge employee-priority-badge--high';
      case 'Medium':
        return 'employee-priority-badge employee-priority-badge--medium';
      case 'Low':
        return 'employee-priority-badge employee-priority-badge--low';
      default:
        return 'employee-priority-badge employee-priority-badge--default';
    }
  };

  const stats = {
    total: complaints.length,
    assigned: complaints.filter((c) => c.status === 'Assigned').length,
    inProgress: complaints.filter((c) => c.status === 'In Progress').length,
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="employee-page">
      <aside className="employee-sidebar">
        <div className="employee-sidebar__header">
          <h1 className="employee-sidebar__title">
            <Wrench size={24} /> Staff Panel
          </h1>
        </div>
        <div className="employee-sidebar__content">
          <div className="employee-profile-card">
            <div className="employee-profile-card__avatar">
              <Wrench size={24} />
            </div>
            <h3 className="employee-profile-card__name">{user?.name}</h3>
            <p className="employee-profile-card__meta">Maintenance Staff</p>
          </div>
          <nav className="employee-nav">
            <button className="employee-nav__button employee-nav__button--active">
              <FileText size={20} /> Assigned Tasks
            </button>
          </nav>
        </div>
        <div className="employee-sidebar__footer">
          <button className="employee-logout" onClick={logout}>
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      <main className="employee-main">
        <div className="employee-header--mobile">
          <h1 className="employee-page-title">
            <Wrench size={20} /> Staff Panel
          </h1>
          <button className="employee-logout" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="mb-8">
          <h2 className="employee-page-title">Welcome, {user?.name}</h2>
          <p className="employee-page-subtitle">Here are your assigned maintenance tasks.</p>
        </div>

        <div className="employee-stats-grid">
          <div className="employee-stat-card">
            <div className="employee-stat-card__icon">
              <FileText size={24} />
            </div>
            <div>
              <p className="employee-stat-card__title">Total Tasks</p>
              <p className="employee-stat-card__value">{stats.total}</p>
            </div>
          </div>
          <div className="employee-stat-card">
            <div className="employee-stat-card__icon">
              <Clock size={24} />
            </div>
            <div>
              <p className="employee-stat-card__title">Assigned</p>
              <p className="employee-stat-card__value">{stats.assigned}</p>
            </div>
          </div>
          <div className="employee-stat-card">
            <div className="employee-stat-card__icon">
              <Wrench size={24} />
            </div>
            <div>
              <p className="employee-stat-card__title">In Progress</p>
              <p className="employee-stat-card__value">{stats.inProgress}</p>
            </div>
          </div>
          <div className="employee-stat-card">
            <div className="employee-stat-card__icon">
              <CheckCircle size={24} />
            </div>
            <div>
              <p className="employee-stat-card__title">Resolved</p>
              <p className="employee-stat-card__value">{stats.resolved}</p>
            </div>
          </div>
        </div>

        <div className="employee-table-wrapper">
          {loading ? (
            <div className="text-muted">Loading assigned tasks...</div>
          ) : complaints.length === 0 ? (
            <div className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
              <CheckCircle size={48} style={{ color: '#10b981', opacity: 0.5, marginBottom: '1rem' }} />
              <div>You have no assigned tasks. Great job!</div>
            </div>
          ) : (
            <table className="employee-table">
              <thead>
                <tr>
                  <th>Task Details</th>
                  <th>Location</th>
                  <th>Category</th>
                  <th>Priority</th>
                  <th>Status</th>
                  <th>Notes</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {complaints.map((c) => (
                  <React.Fragment key={c._id}>
                    <tr>
                      <td>
                        <div className="table-label">{c.title}</div>
                        <div className="table-meta" title={c.description}>{c.description}</div>
                        <div className="table-meta">Assigned on: {c.assignedDate ? new Date(c.assignedDate).toLocaleDateString() : 'N/A'}</div>
                      </td>
                      <td>
                        <div className="table-label">{c.createdBy?.hostel || 'N/A'}</div>
                        <div className="table-meta">Room {c.createdBy?.roomNumber || 'N/A'}</div>
                        <div className="table-meta">By {c.createdBy?.name || 'Unknown'}</div>
                      </td>
                      <td>
                        <span className="badge">{c.category || 'Other'}</span>
                      </td>
                      <td>
                        <span className={getPriorityBadgeClass(c.priority)}>{c.priority}</span>
                      </td>
                      <td>
                        <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                      </td>
                      <td>
                        <div className="table-meta" title={c.repairNotes || 'No notes added yet'}>{c.repairNotes || 'No notes added yet'}</div>
                      </td>
                      <td>
                        {c.status !== 'Resolved' && c.status !== 'Closed' ? (
                          <button className="employee-action-button" onClick={() => openEditModal(c)}>
                            Update
                          </button>
                        ) : (
                          <span className={c.status === 'Closed' ? 'employee-status-badge employee-status-badge--closed' : 'employee-status-badge employee-status-badge--resolved'}>
                            {c.status}
                          </span>
                        )}
                      </td>
                    </tr>
                    {c.images && c.images.length > 0 && (
                      <tr key={`${c._id}-images`}>
                        <td colSpan="7">
                          <ImageGallery images={c.images} />
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {editingId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-card__header">Update Task Status</h3>
            <form onSubmit={handleUpdate} className="dashboard-form">
              <div className="form-group">
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}>
                  <option value="Assigned">Assigned</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Resolved">Resolved</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Repair Notes</label>
                <textarea
                  className="form-textarea"
                  placeholder="Enter details of repairs made, parts used, etc..."
                  value={repairNotes}
                  onChange={(e) => setRepairNotes(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="button button--ghost" onClick={() => setEditingId(null)}>
                  Cancel
                </button>
                <button type="submit" className="button button--primary">
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
