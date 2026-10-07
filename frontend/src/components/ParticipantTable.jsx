import React, { useState } from 'react';
import { Search, Filter, RefreshCw } from 'lucide-react';

const VALID_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar'
];

const MARATHON_DATES = [
  'October 17, 2026',
  'October 18, 2026',
  'October 19, 2026',
  'October 20, 2026'
];

const ParticipantTable = ({ participants = [], loading = false, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDistrict, setSelectedDistrict] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedDate, setSelectedDate] = useState('');

  const filteredParticipants = participants.filter((p) => {
    const matchesName = (p.full_name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (p.registration_id || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesDistrict = !selectedDistrict || p.district === selectedDistrict;
    const matchesCategory = !selectedCategory || p.marathon_category === selectedCategory;
    const matchesDate = !selectedDate || p.marathon_date === selectedDate;

    return matchesName && matchesDistrict && matchesCategory && matchesDate;
  });

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedDistrict('');
    setSelectedCategory('');
    setSelectedDate('');
  };

  return (
    <div className="table-container-card">
      <div className="table-header-bar">
        <div className="table-title-group">
          <h3>Registered Participants</h3>
          <span className="participant-count-badge">
            Showing {filteredParticipants.length} of {participants.length}
          </span>
        </div>

        {onRefresh && (
          <button className="btn-refresh" onClick={onRefresh} title="Refresh Table">
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
        )}
      </div>

      {/* Filter & Search Bar */}
      <div className="table-filters-grid">
        <div className="search-input-wrapper">
          <Search size={18} className="search-icon" />
          <input
            type="text"
            placeholder="Search by Participant Name or Reg ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="filter-input"
          />
        </div>

        <div className="select-filter-wrapper">
          <Filter size={16} className="filter-icon" />
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="filter-select"
          >
            <option value="">All Districts</option>
            {VALID_DISTRICTS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </div>

        <div className="select-filter-wrapper">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            <option value="5 KM">5 KM</option>
            <option value="10 KM">10 KM</option>
            <option value="21 KM">21 KM</option>
            <option value="42 KM">42 KM</option>
          </select>
        </div>

        <div className="select-filter-wrapper">
          <select
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="filter-select"
          >
            <option value="">All Event Dates</option>
            {MARATHON_DATES.map((dt) => (
              <option key={dt} value={dt}>
                {dt}
              </option>
            ))}
          </select>
        </div>

        {(searchTerm || selectedDistrict || selectedCategory || selectedDate) && (
          <button className="btn-reset-filters" onClick={resetFilters}>
            Clear Filters
          </button>
        )}
      </div>

      {/* Table Data */}
      <div className="table-responsive">
        <table className="participants-table">
          <thead>
            <tr>
              <th>Reg ID</th>
              <th>Name</th>
              <th>Age</th>
              <th>Gender</th>
              <th>District</th>
              <th>Category</th>
              <th>Event Date</th>
              <th>Age Group</th>
              <th>Under 35</th>
              <th>T-Shirt</th>
              <th>Reg Date</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="11" className="table-status-cell">
                  Loading participants data...
                </td>
              </tr>
            ) : filteredParticipants.length === 0 ? (
              <tr>
                <td colSpan="11" className="table-status-cell">
                  No registered participants found matching your criteria.
                </td>
              </tr>
            ) : (
              filteredParticipants.map((p) => (
                <tr key={p.id || p.registration_id}>
                  <td className="font-mono text-primary">{p.registration_id}</td>
                  <td className="font-semibold">{p.full_name}</td>
                  <td>{p.age}</td>
                  <td>{p.gender}</td>
                  <td>{p.district}</td>
                  <td>
                    <span className="badge-category">{p.marathon_category}</span>
                  </td>
                  <td>
                    <span className="badge-date">{p.marathon_date || 'Oct 17, 2026'}</span>
                  </td>
                  <td>{p.age_category}</td>
                  <td>
                    <span className={`badge-under35 ${p.under_35 === 'YES' ? 'yes' : 'no'}`}>
                      {p.under_35}
                    </span>
                  </td>
                  <td>
                    <span className="badge-tshirt">{p.tshirt_size}</span>
                  </td>
                  <td className="text-muted text-sm">
                    {p.registration_date ? new Date(p.registration_date).toLocaleDateString() : 'N/A'}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ParticipantTable;
