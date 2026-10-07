import React from 'react';
import { useLocation, Link, Navigate } from 'react-router-dom';
import { CheckCircle, Trophy, User, ArrowRight, LayoutDashboard, Ticket } from 'lucide-react';

const Success = () => {
  const location = useLocation();
  const participant = location.state?.participant;

  if (!participant) {
    return <Navigate to="/register" replace />;
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-banner">
          <div className="success-icon-wrapper">
            <CheckCircle size={48} color="#ffffff" />
          </div>
          <h2>Registration Successful!</h2>
          <p>Your entry for TAMIL NADU MARATHON 2026 has been confirmed.</p>
        </div>

        <div className="ticket-header">
          <Ticket size={20} />
          <span>OFFICIAL REGISTRATION TICKET</span>
        </div>

        <div className="registration-id-box">
          <span className="reg-id-label">Registration ID</span>
          <h2 className="reg-id-code">{participant.registration_id}</h2>
        </div>

        <div className="details-grid">
          <div className="detail-item">
            <span className="detail-label">Participant Name</span>
            <span className="detail-value highlight">{participant.full_name}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Age & Category</span>
            <span className="detail-value">
              {participant.age} yrs ({participant.age_category})
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Under 35 Status</span>
            <span className={`detail-value badge-status ${participant.under_35 === 'YES' ? 'yes' : 'no'}`}>
              {participant.under_35}
            </span>
          </div>

          <div className="detail-item">
            <span className="detail-label">District</span>
            <span className="detail-value">{participant.district}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Marathon Category</span>
            <span className="detail-value category-tag">{participant.marathon_category}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Event Date</span>
            <span className="detail-value highlight-date">{participant.marathon_date || 'October 17, 2026'}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">T-Shirt Size</span>
            <span className="detail-value">{participant.tshirt_size}</span>
          </div>

          <div className="detail-item">
            <span className="detail-label">Mobile Number</span>
            <span className="detail-value">{participant.mobile}</span>
          </div>
        </div>

        <div className="success-actions">
          <Link to="/register" className="btn btn-secondary">
            <User size={18} />
            <span>Register Another</span>
          </Link>
          <Link to="/admin" className="btn btn-primary">
            <LayoutDashboard size={18} />
            <span>Go to Admin Dashboard</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Success;
