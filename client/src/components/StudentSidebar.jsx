import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { LogOut, AlertCircle, Plus, User as UserIcon } from 'lucide-react';

const StudentSidebar = () => {
  const { user, logout } = useContext(AuthContext);
  const location = useLocation();

  const navLinkClass = (path) =>
    `dashboard-nav__button${location.pathname === path ? ' dashboard-nav__button--active' : ''}`;

  return (
    <aside className="dashboard-sidebar">
      <div className="dashboard-sidebar__header">
        <h1 className="dashboard-sidebar__title">Hostel System</h1>
      </div>

      <div className="dashboard-sidebar__content">
        <div className="profile-card">
          <div className="profile-card__avatar">
            <UserIcon size={24} />
          </div>
          <h3 className="profile-card__name">{user?.name}</h3>
          <p className="profile-card__meta">
            {user?.hostel} - Room {user?.roomNumber}
          </p>
        </div>

        <nav className="dashboard-nav">
          <Link to="/student" className={navLinkClass('/student')}>
            <AlertCircle size={20} />
            My Complaints
          </Link>

          <Link to="/student/new-complaint" className={navLinkClass('/student/new-complaint')}>
            <Plus size={20} />
            New Complaint
          </Link>
        </nav>
      </div>

      <div className="dashboard-sidebar__footer">
        <button className="dashboard-logout" onClick={logout}>
          <LogOut size={20} />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default StudentSidebar;
