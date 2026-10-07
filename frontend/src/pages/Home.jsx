import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Users, Zap, MapPin, Trophy, Target, ShieldCheck } from 'lucide-react';
import { fetchTotalStats } from '../services/api';

const Home = () => {
  const [stats, setStats] = useState({
    total: 0,
    under35: 0,
    totalDistricts: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const response = await fetchTotalStats();
        if (response.data && response.data.success) {
          setStats({
            total: response.data.total,
            under35: response.data.under35,
            totalDistricts: response.data.totalDistricts
          });
        }
      } catch (err) {
        console.error('Failed to load home page statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="home-page">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-overlay"></div>
        <div className="hero-content">
          <div className="hero-badge">
            <Trophy size={16} />
            <span>Official Tamil Nadu State Level Event</span>
          </div>

          <h1 className="hero-title">TAMIL NADU MARATHON 2026</h1>
          <p className="hero-subtitle">Register. Run. Inspire.</p>
          <p className="hero-description">
            Join thousands of runners across Tamil Nadu in the biggest athletic event of the year. 
            Test your endurance, champion fitness, and compete for victory.
          </p>

          <div className="hero-actions">
            <Link to="/register" className="btn btn-primary btn-hero">
              <span>REGISTER NOW</span>
              <ArrowRight size={20} />
            </Link>
            <Link to="/admin" className="btn btn-secondary btn-hero">
              <span>View Live Dashboard</span>
            </Link>
          </div>

          {/* Live Statistics Cards */}
          <div className="live-stats-container">
            <div className="live-stat-card">
              <div className="live-stat-icon red">
                <Users size={24} />
              </div>
              <div className="live-stat-info">
                <span className="live-stat-number">{loading ? '...' : stats.total}</span>
                <span className="live-stat-label">Total Participants</span>
              </div>
            </div>

            <div className="live-stat-card">
              <div className="live-stat-icon orange">
                <Zap size={24} />
              </div>
              <div className="live-stat-info">
                <span className="live-stat-number">{loading ? '...' : stats.under35}</span>
                <span className="live-stat-label">Under 35 Athletes</span>
              </div>
            </div>

            <div className="live-stat-card">
              <div className="live-stat-icon blue">
                <MapPin size={24} />
              </div>
              <div className="live-stat-info">
                <span className="live-stat-number">{loading ? '...' : stats.totalDistricts}</span>
                <span className="live-stat-label">Total Districts</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="features-section">
        <div className="section-container">
          <div className="section-header text-center">
            <h2>Marathon Categories</h2>
            <p>Select your distance and push your boundaries</p>
          </div>

          <div className="category-cards-grid">
            <div className="category-card">
              <div className="category-tag">Fun Run</div>
              <h3>5 KM</h3>
              <p>Ideal for beginners and fitness enthusiasts of all ages.</p>
            </div>

            <div className="category-card highlight">
              <div className="category-tag popular">Most Popular</div>
              <h3>10 KM</h3>
              <p>Great test of stamina for intermediate runners aiming for high speed.</p>
            </div>

            <div className="category-card">
              <div className="category-tag">Half Marathon</div>
              <h3>21 KM</h3>
              <p>Challenging endurance race designed for experienced athletes.</p>
            </div>

            <div className="category-card">
              <div className="category-tag pro">Full Marathon</div>
              <h3>42 KM</h3>
              <p>The ultimate state endurance test of willpower and marathon excellence.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
