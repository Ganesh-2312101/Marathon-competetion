import React from 'react';

const StatCard = ({ title, value, icon: Icon, badgeText, accentColor = '#3b82f6' }) => {
  return (
    <div className="stat-card" style={{ '--accent-color': accentColor }}>
      <div className="stat-card-header">
        <span className="stat-card-title">{title}</span>
        {Icon && (
          <div className="stat-card-icon-wrapper">
            <Icon size={22} className="stat-card-icon" />
          </div>
        )}
      </div>
      <div className="stat-card-body">
        <h3 className="stat-card-value">{value !== undefined && value !== null ? value : 0}</h3>
        {badgeText && <span className="stat-card-badge">{badgeText}</span>}
      </div>
    </div>
  );
};

export default StatCard;
