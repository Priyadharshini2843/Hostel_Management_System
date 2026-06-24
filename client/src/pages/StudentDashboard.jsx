import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, User as UserIcon, AlertCircle, CheckCircle } from 'lucide-react';
import StudentSidebar from '../components/StudentSidebar';
import ImageGallery from '../components/ImageGallery';
import './StudentDashboard.css';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedbackData, setFeedbackData] = useState({ rating: 5, feedback: '' });
  const [feedbackComplaintId, setFeedbackComplaintId] = useState(null);

  const fetchComplaints = async () => {
    try {
      const { data } = await api.get('/complaints');
      setComplaints(data);
    } catch (error) {
      toast.error('Failed to load complaints');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, []);

  const handleFeedbackSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/complaints/${feedbackComplaintId}/feedback`, feedbackData);
      toast.success('Feedback submitted successfully');
      setFeedbackComplaintId(null);
      setFeedbackData({ rating: 5, feedback: '' });
      fetchComplaints();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit feedback');
    }
  };

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
    resolved: complaints.filter((c) => c.status === 'Resolved').length,
  };

  return (
    <div className="dashboard-page">
      <StudentSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header--mobile">
          <h1 className="dashboard-title">Hostel System</h1>
          <button className="dashboard-logout" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="dashboard-page-header">
          <h2 className="dashboard-title">Student Dashboard</h2>
          <p className="dashboard-subtitle">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>

        <div className="dashboard-grid">
          <section className="dashboard-stats-grid">
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-card__title">Total Complaints</p>
              <p className="dashboard-stat-card__value">{stats.total}</p>
            </div>
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-card__title">Pending</p>
              <p className="dashboard-stat-card__value">{stats.pending}</p>
            </div>
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-card__title">Assigned</p>
              <p className="dashboard-stat-card__value">{stats.assigned}</p>
            </div>
            <div className="dashboard-stat-card">
              <p className="dashboard-stat-card__title">Resolved</p>
              <p className="dashboard-stat-card__value">{stats.resolved}</p>
            </div>
          </section>

          <section className="dashboard-panel">
            <div className="dashboard-panel__header">
              <h3>History</h3>
            </div>
            <div className="dashboard-panel__content">
              {loading ? (
                <div className="text-muted">Loading complaints...</div>
              ) : complaints.length === 0 ? (
                <div className="text-muted" style={{ textAlign: 'center', padding: '3rem 0' }}>
                  <CheckCircle size={48} style={{ color: '#10B981', opacity: 0.5, marginBottom: '1rem' }} />
                  <div>Great! You have no submitted complaints.</div>
                </div>
              ) : (
                <div className="dashboard-table-wrapper">
                  <table className="dashboard-table">
                    <thead>
                      <tr>
                        <th>Issue</th>
                        <th>Assigned To</th>
                        <th>Status & Notes</th>
                        <th>Date</th>
                        <th>Feedback</th>
                      </tr>
                    </thead>
                    <tbody>
                      {complaints.map((c) => (
                        <React.Fragment key={c._id}>
                          <tr>
                            <td>
                              <div className="table-label">{c.title}</div>
                              <div className="table-meta">{c.description}</div>
                              <div style={{ marginTop: '0.75rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span className="badge">{c.category || 'Other'}</span>
                                <span className={getPriorityBadgeClass(c.priority)}>{c.priority} Priority</span>
                              </div>
                            </td>
                            <td>
                              {c.assignedTo?.name ? (
                                <div className="table-label">{c.assignedTo.name}</div>
                              ) : (
                                <span className="text-muted" style={{ fontStyle: 'italic' }}>Unassigned</span>
                              )}
                            </td>
                            <td>
                              <span className={getStatusBadgeClass(c.status)}>{c.status}</span>
                              {c.repairNotes && (
                                <div className="table-meta" style={{ marginTop: '0.5rem' }} title={c.repairNotes}>
                                  Notes: {c.repairNotes}
                                </div>
                              )}
                            </td>
                            <td>
                              <div className="table-meta">{new Date(c.createdAt).toLocaleDateString()}</div>
                            </td>
                            <td style={{ textAlign: 'center' }}>
                              {c.status === 'Resolved' && !c.rating ? (
                                <button type="button" onClick={() => setFeedbackComplaintId(c._id)} className="button button--ghost">
                                  Rate
                                </button>
                              ) : c.rating ? (
                                <span style={{ color: '#f59e0b', fontSize: '0.9rem' }}>
                                  {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                                </span>
                              ) : (
                                <span className="text-muted">-</span>
                              )}
                            </td>
                          </tr>
                          {c.images && c.images.length > 0 && (
                            <tr key={`${c._id}-images`}>
                              <td colSpan="5">
                                <ImageGallery images={c.images} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {feedbackComplaintId && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3 className="modal-card__header">Rate Resolution</h3>
            <form onSubmit={handleFeedbackSubmit} className="dashboard-form">
              <div className="form-group">
                <label className="form-label">Rating (1-5)</label>
                <div className="rating-row">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({ ...feedbackData, rating: star })}
                      className={`rating-button ${feedbackData.rating >= star ? 'rating-button--active' : 'rating-button--inactive'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Feedback Comments</label>
                <textarea
                  className="form-textarea"
                  placeholder="How was the service? (Optional)"
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({ ...feedbackData, feedback: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setFeedbackComplaintId(null)} className="button button--ghost">
                  Cancel
                </button>
                <button type="submit" className="button button--primary">
                  Submit Feedback
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;
