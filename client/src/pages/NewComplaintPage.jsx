import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import api from '../api/axiosConfig';
import toast from 'react-hot-toast';
import { LogOut, PlusCircle } from 'lucide-react';
import ImageUpload from '../components/ImageUpload';
import StudentSidebar from '../components/StudentSidebar';
import './StudentDashboard.css';

const NewComplaintPage = () => {
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'Low',
    category: 'Other',
  });
  const [selectedImages, setSelectedImages] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const submitFormData = new FormData();
      submitFormData.append('title', formData.title);
      submitFormData.append('description', formData.description);
      submitFormData.append('priority', formData.priority);
      submitFormData.append('category', formData.category);

      selectedImages.forEach((image) => {
        submitFormData.append('images', image);
      });

      await api.post('/complaints', submitFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      toast.success('Complaint submitted successfully');
      setFormData({ title: '', description: '', priority: 'Low', category: 'Other' });
      setSelectedImages([]);
      navigate('/student');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit complaint');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="dashboard-page">
      <StudentSidebar />

      <main className="dashboard-main">
        <div className="dashboard-header--mobile">
          <div>
            <h1 className="dashboard-title">New Complaint</h1>
          </div>
          <button className="dashboard-logout" onClick={logout}>
            <LogOut size={20} />
          </button>
        </div>

        <div className="dashboard-page-header dashboard-page-header--compact">
          <h2 className="dashboard-title">New Complaint</h2>
        </div>
        <section className="dashboard-panel dashboard-panel--form">
          <div className="dashboard-panel__content">
            <form onSubmit={handleSubmit} className="dashboard-form">
              <div className="form-group">
                <label className="form-label">Issue Title</label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="E.g., Fan not working"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="form-group">
                <label className="form-label">Description</label>
                <textarea
                  required
                  className="form-textarea"
                  placeholder="Describe the issue in detail..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="dashboard-field-grid">
                <div className="form-group">
                  <label className="form-label">Category</label>
                  <select
                    className="form-select"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  >
                    <option value="Electrical">Electrical</option>
                    <option value="Plumbing">Plumbing</option>
                    <option value="Furniture">Furniture</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Priority</label>
                  <select
                    className="form-select"
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                </div>
              </div>

              <ImageUpload onFilesSelected={setSelectedImages} maxFiles={3} maxFileSize={5} />

              <button type="submit" className="button button--primary" disabled={submitting}>
                {submitting ? 'Submitting...' : 'Submit Complaint'}
              </button>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
};

export default NewComplaintPage;
