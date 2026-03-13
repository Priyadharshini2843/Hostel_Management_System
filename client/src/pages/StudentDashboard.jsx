import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, User as UserIcon, AlertCircle, Clock, CheckCircle } from 'lucide-react';

const StudentDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [complaints, setComplaints] = useState([]);
  const [formData, setFormData] = useState({ title: '', description: '', priority: 'Low' });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/complaints', formData);
      toast.success('Complaint submitted successfully');
      setFormData({ title: '', description: '', priority: 'Low' });
      fetchComplaints(); // Refresh list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    }
  };

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
      case 'High': return 'text-red-500 bg-red-50';
      case 'Medium': return 'text-orange-500 bg-orange-50';
      case 'Low': return 'text-green-500 bg-green-50';
      default: return 'text-gray-500 bg-gray-50';
    }
  };

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <aside className="w-64 bg-card border-r border-gray-200 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-primary flex items-center gap-2">
            Hostel System
          </h1>
        </div>
        <div className="p-6 flex-1">
          <div className="flex flex-col items-center text-center p-4 bg-gray-50 rounded-xl mb-6 shadow-sm border border-gray-100">
            <div className="w-16 h-16 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-3">
              <UserIcon size={24} />
            </div>
            <h3 className="font-semibold text-text-main">{user?.name}</h3>
            <p className="text-sm text-text-muted">{user?.hostel} - Room {user?.roomNumber}</p>
          </div>
          <nav className="space-y-2">
            <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg bg-primary/10 text-primary font-medium transition-colors">
              <AlertCircle size={20} />
              My Complaints
            </button>
          </nav>
        </div>
        <div className="p-4 border-t border-gray-200">
          <button 
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        <header className="mb-8 flex justify-between items-center md:hidden">
            <h1 className="text-xl font-bold text-primary">Hostel System</h1>
            <button onClick={logout} className="p-2 text-red-500"><LogOut size={20}/></button>
        </header>
        
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-text-main">Student Dashboard</h2>
          <p className="text-text-muted mt-1">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 p-6 sticky top-8">
              <h3 className="text-xl font-bold mb-4 text-text-main">File a Complaint</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Issue Title</label>
                  <input 
                    type="text" required
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    placeholder="E.g., Fan not working"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Description</label>
                  <textarea 
                    required rows="4"
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
                    placeholder="Describe the issue in detail..."
                    value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-text-main mb-1">Priority</label>
                  <select 
                    className="w-full px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm bg-white"
                    value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
                <button 
                  type="submit" 
                  className="w-full bg-primary hover:bg-primary-hover text-white font-medium py-2.5 rounded-lg transition-colors shadow-sm"
                >
                  Submit Complaint
                </button>
              </form>
            </div>
          </div>

          {/* List Section */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-6 border-b border-gray-200">
                <h3 className="text-xl font-bold text-text-main">History</h3>
              </div>
              
              {loading ? (
                <div className="p-12 text-center text-text-muted">Loading complaints...</div>
              ) : complaints.length === 0 ? (
                <div className="p-12 text-center text-text-muted flex flex-col items-center">
                  <CheckCircle size={48} className="text-emerald-400 mb-4 opacity-50" />
                  <p>Great! You have no submitted complaints.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50 text-text-muted text-sm border-b border-gray-200">
                        <th className="px-6 py-4 font-medium">Issue</th>
                        <th className="px-6 py-4 font-medium">Assigned To</th>
                        <th className="px-6 py-4 font-medium">Status & Notes</th>
                        <th className="px-6 py-4 font-medium">Date</th>
                        <th className="px-6 py-4 font-medium text-center">Feedback</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {complaints.map(c => (
                        <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-medium text-text-main">{c.title}</div>
                            <div className="text-sm text-text-muted mt-1 max-w-xs truncate">{c.description}</div>
                            <span className={`mt-2 inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium ${getPriorityColor(c.priority)}`}>
                              {c.priority} Priority
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm">
                            {c.assignedTo?.name || <span className="text-gray-400 italic">Unassigned</span>}
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(c.status)}`}>
                              {c.status}
                            </span>
                            {c.repairNotes && <div className="text-xs text-text-muted mt-1 max-w-[150px] truncate" title={c.repairNotes}>Notes: {c.repairNotes}</div>}
                          </td>
                          <td className="px-6 py-4 text-sm text-text-muted">
                            {new Date(c.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {c.status === 'Resolved' && !c.rating ? (
                              <button
                                onClick={() => setFeedbackComplaintId(c._id)}
                                className="text-primary hover:text-primary-hover text-sm font-medium transition-colors border border-primary text-primary px-3 py-1 rounded-md"
                              >
                                Rate
                              </button>
                            ) : c.rating ? (
                              <div className="flex items-center justify-center gap-1 text-amber-500 text-sm">
                                {'★'.repeat(c.rating)}{'☆'.repeat(5 - c.rating)}
                              </div>
                            ) : (
                              <span className="text-gray-400 text-xs">-</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Feedback Modal */}
      {feedbackComplaintId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-in fade-in zoom-in duration-200">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Rate Resolution</h3>
            <form onSubmit={handleFeedbackSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating (1-5)</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setFeedbackData({...feedbackData, rating: star})}
                      className={`text-2xl transition-colors focus:outline-none ${feedbackData.rating >= star ? 'text-amber-500' : 'text-gray-300 hover:text-amber-300'}`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Feedback Comments</label>
                <textarea 
                  className="w-full border-gray-300 rounded-lg shadow-sm focus:border-primary focus:ring-primary py-2 px-3 text-sm border min-h-[100px]"
                  placeholder="How was the service? (Optional)"
                  value={feedbackData.feedback}
                  onChange={(e) => setFeedbackData({...feedbackData, feedback: e.target.value})}
                />
              </div>
              <div className="pt-4 flex justify-end gap-3 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setFeedbackComplaintId(null)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-primary hover:bg-primary-hover border border-transparent rounded-lg shadow-sm transition-colors"
                >
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
