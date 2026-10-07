import React, { useState, useEffect } from 'react';
import { Users, Zap, Shield, MapPin, BarChart3, RefreshCw, Calendar, Award } from 'lucide-react';
import StatCard from '../components/StatCard';
import ParticipantTable from '../components/ParticipantTable';
import {
  fetchTotalStats,
  fetchAgeWiseStats,
  fetchUnder35Stats,
  fetchDistrictWiseStats,
  fetchMarathonWiseStats,
  fetchDateWiseStats,
  fetchParticipants
} from '../services/api';

const Dashboard = () => {
  const [totals, setTotals] = useState({
    total: 0,
    under35: 0,
    above35: 0
  });

  const [ageWise, setAgeWise] = useState([]);
  const [under35Stats, setUnder35Stats] = useState([]);
  const [marathonWise, setMarathonWise] = useState([]);
  const [dateWise, setDateWise] = useState([]);
  const [districtWise, setDistrictWise] = useState([]);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAllDashboardData = async () => {
    setLoading(true);
    try {
      const [
        totalRes,
        ageRes,
        under35Res,
        districtRes,
        marathonRes,
        dateRes,
        participantsRes
      ] = await Promise.all([
        fetchTotalStats(),
        fetchAgeWiseStats(),
        fetchUnder35Stats(),
        fetchDistrictWiseStats(),
        fetchMarathonWiseStats(),
        fetchDateWiseStats(),
        fetchParticipants()
      ]);

      if (totalRes.data && totalRes.data.success) {
        setTotals({
          total: totalRes.data.total,
          under35: totalRes.data.under35,
          above35: totalRes.data.above35
        });
      }

      if (ageRes.data && ageRes.data.success) setAgeWise(ageRes.data.data);
      if (under35Res.data && under35Res.data.success) setUnder35Stats(under35Res.data.data);
      if (districtRes.data && districtRes.data.success) setDistrictWise(districtRes.data.data);
      if (marathonRes.data && marathonRes.data.success) setMarathonWise(marathonRes.data.data);
      if (dateRes.data && dateRes.data.success) setDateWise(dateRes.data.data);
      if (participantsRes.data && participantsRes.data.success) setParticipants(participantsRes.data.data);
    } catch (err) {
      console.error('Error loading dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllDashboardData();
  }, []);

  const getMaxVal = (arr, key) => Math.max(...arr.map((item) => item[key] || 0), 1);

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header */}
        <div className="dashboard-header">
          <div>
            <h2>Admin Analytics Dashboard</h2>
            <p>Real-time Tamil Nadu Marathon 2026 registration metrics and participant management</p>
          </div>
          <button className="btn btn-secondary" onClick={loadAllDashboardData} disabled={loading}>
            <RefreshCw size={16} className={loading ? 'spin' : ''} />
            <span>Refresh Data</span>
          </button>
        </div>

        {/* Primary Stat Cards */}
        <div className="stats-grid-3">
          <StatCard
            title="TOTAL PARTICIPANTS"
            value={totals.total}
            icon={Users}
            badgeText="Registered"
            accentColor="#3b82f6"
          />
          <StatCard
            title="UNDER 35"
            value={totals.under35}
            icon={Zap}
            badgeText={`${totals.total > 0 ? Math.round((totals.under35 / totals.total) * 100) : 0}% of Total`}
            accentColor="#10b981"
          />
          <StatCard
            title="35 AND ABOVE"
            value={totals.above35}
            icon={Shield}
            badgeText={`${totals.total > 0 ? Math.round((totals.above35 / totals.total) * 100) : 0}% of Total`}
            accentColor="#f59e0b"
          />
        </div>

        {/* Charts Grid */}
        <div className="charts-grid-2">
          {/* Age-Wise Breakdown */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-title">
                <BarChart3 size={18} color="#3b82f6" />
                <h4>AGE-WISE CATEGORIZATION</h4>
              </div>
            </div>
            <div className="chart-bars-wrapper">
              {ageWise.map((item) => {
                const max = getMaxVal(ageWise, 'count');
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={item.age_category} className="chart-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-label">{item.age_category}</span>
                      <span className="bar-value">{item.count}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill blue-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Event Date Breakdown */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-title">
                <Calendar size={18} color="#ec4899" />
                <h4>EVENT DATE-WISE CATEGORIZATION</h4>
              </div>
            </div>
            <div className="chart-bars-wrapper">
              {dateWise.map((item) => {
                const max = getMaxVal(dateWise, 'count');
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={item.marathon_date} className="chart-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-label">{item.marathon_date}</span>
                      <span className="bar-value">{item.count}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill pink-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Under-35 Breakdown */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-title">
                <Zap size={18} color="#10b981" />
                <h4>UNDER 35 CATEGORIZATION</h4>
              </div>
            </div>
            <div className="chart-bars-wrapper">
              {under35Stats.map((item) => {
                const max = getMaxVal(under35Stats, 'count');
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={item.under_35} className="chart-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-label">Under 35: {item.under_35}</span>
                      <span className="bar-value">{item.count}</span>
                    </div>
                    <div className="bar-track">
                      <div
                        className={`bar-fill ${item.under_35 === 'YES' ? 'green-fill' : 'orange-fill'}`}
                        style={{ width: `${percent}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Marathon-Wise Breakdown */}
          <div className="chart-card">
            <div className="chart-card-header">
              <div className="chart-title">
                <Award size={18} color="#f59e0b" />
                <h4>MARATHON CATEGORY BREAKDOWN</h4>
              </div>
            </div>
            <div className="chart-bars-wrapper">
              {marathonWise.map((item) => {
                const max = getMaxVal(marathonWise, 'count');
                const percent = Math.round((item.count / max) * 100);
                return (
                  <div key={item.marathon_category} className="chart-bar-row">
                    <div className="bar-label-group">
                      <span className="bar-label">{item.marathon_category}</span>
                      <span className="bar-value">{item.count}</span>
                    </div>
                    <div className="bar-track">
                      <div className="bar-fill orange-fill" style={{ width: `${percent}%` }}></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* District-Wise Breakdown Full Card */}
        <div className="chart-card full-width-chart">
          <div className="chart-card-header">
            <div className="chart-title">
              <MapPin size={18} color="#ef4444" />
              <h4>DISTRICT-WISE PARTICIPATION</h4>
            </div>
          </div>
          {districtWise.length === 0 ? (
            <p className="no-data-text">No district data available yet.</p>
          ) : (
            <div className="district-grid">
              {districtWise.map((d) => (
                <div key={d.district} className="district-stat-box">
                  <span className="district-name">{d.district}</span>
                  <span className="district-count">{d.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Participant Table */}
        <ParticipantTable
          participants={participants}
          loading={loading}
          onRefresh={loadAllDashboardData}
        />
      </div>
    </div>
  );
};

export default Dashboard;
