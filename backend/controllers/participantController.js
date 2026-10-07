const { getPool, getIsFallbackMode, getMemoryStore } = require('../config/db');
const { generateRegistrationId, calculateAgeCategory, calculateUnder35 } = require('../utils/registrationId');

const VALID_DISTRICTS = [
  'Ariyalur', 'Chengalpattu', 'Chennai', 'Coimbatore', 'Cuddalore', 'Dharmapuri',
  'Dindigul', 'Erode', 'Kallakurichi', 'Kanchipuram', 'Kanyakumari', 'Karur',
  'Krishnagiri', 'Madurai', 'Mayiladuthurai', 'Nagapattinam', 'Namakkal', 'Nilgiris',
  'Perambalur', 'Pudukkottai', 'Ramanathapuram', 'Ranipet', 'Salem', 'Sivagangai',
  'Tenkasi', 'Thanjavur', 'Theni', 'Thoothukudi', 'Tiruchirappalli', 'Tirunelveli',
  'Tirupathur', 'Tiruppur', 'Tiruvallur', 'Tiruvannamalai', 'Tiruvarur', 'Vellore',
  'Viluppuram', 'Virudhunagar'
];

const VALID_DATES = [
  'October 17, 2026',
  'October 18, 2026',
  'October 19, 2026',
  'October 20, 2026'
];

// Register a new participant
const registerParticipant = async (req, res) => {
  try {
    const {
      full_name,
      age,
      gender,
      mobile,
      district,
      medium,
      marathon_category,
      marathon_date,
      tshirt_size
    } = req.body;

    // Backend Validation
    if (!full_name || typeof full_name !== 'string' || full_name.trim() === '') {
      return res.status(400).json({ success: false, message: 'Full name is required.' });
    }

    const numAge = parseInt(age, 10);
    if (isNaN(numAge) || numAge < 18 || numAge > 100) {
      return res.status(400).json({ success: false, message: 'Age must be a valid number between 18 and 100.' });
    }

    if (!gender || !['Male', 'Female', 'Other'].includes(gender)) {
      return res.status(400).json({ success: false, message: 'Valid gender selection is required.' });
    }

    if (!mobile || !/^\d{10}$/.test(String(mobile).trim())) {
      return res.status(400).json({ success: false, message: 'Mobile number must be a valid 10-digit number.' });
    }

    if (!district || !VALID_DISTRICTS.includes(district.trim())) {
      return res.status(400).json({ success: false, message: 'Valid Tamil Nadu district is required.' });
    }

    if (!marathon_category || !['5 KM', '10 KM', '21 KM', '42 KM'].includes(marathon_category)) {
      return res.status(400).json({ success: false, message: 'Valid marathon category (5 KM, 10 KM, 21 KM, 42 KM) is required.' });
    }

    if (!marathon_date || !VALID_DATES.includes(marathon_date.trim())) {
      return res.status(400).json({ success: false, message: 'Valid marathon date (October 17, 18, 19, or 20) is required.' });
    }

    if (!tshirt_size || !['S', 'M', 'L', 'XL', 'XXL'].includes(tshirt_size)) {
      return res.status(400).json({ success: false, message: 'Valid T-shirt size (S, M, L, XL, XXL) is required.' });
    }

    // Automatic Calculations
    const age_category = calculateAgeCategory(numAge);
    const under_35 = calculateUnder35(numAge);
    const registration_id = await generateRegistrationId();
    const registration_date = new Date();

    const participantData = {
      registration_id,
      full_name: full_name.trim(),
      age: numAge,
      gender,
      mobile: String(mobile).trim(),
      district: district.trim(),
      medium: medium || 'N/A',
      marathon_category,
      marathon_date: marathon_date.trim(),
      age_category,
      under_35,
      tshirt_size,
      registration_date
    };

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      const newId = memory.length > 0 ? Math.max(...memory.map(p => p.id)) + 1 : 1;
      const savedParticipant = { id: newId, ...participantData, registration_date: registration_date.toISOString() };
      memory.unshift(savedParticipant);

      return res.status(201).json({
        success: true,
        message: 'Registration successful!',
        data: savedParticipant
      });
    }

    const pool = getPool();
    const insertQuery = `
      INSERT INTO participants 
      (registration_id, full_name, age, gender, mobile, district, medium, marathon_category, marathon_date, age_category, under_35, tshirt_size)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const [result] = await pool.query(insertQuery, [
      registration_id,
      full_name.trim(),
      numAge,
      gender,
      String(mobile).trim(),
      district.trim(),
      medium || 'N/A',
      marathon_category,
      marathon_date.trim(),
      age_category,
      under_35,
      tshirt_size
    ]);

    const createdParticipant = {
      id: result.insertId,
      ...participantData
    };

    return res.status(201).json({
      success: true,
      message: 'Registration successful!',
      data: createdParticipant
    });

  } catch (error) {
    console.error('Error in registerParticipant:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error during registration. Please try again.'
    });
  }
};

// Get all participants
const getAllParticipants = async (req, res) => {
  try {
    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      return res.json({ success: true, count: memory.length, data: memory });
    }

    const pool = getPool();
    const [rows] = await pool.query('SELECT * FROM participants ORDER BY id DESC');
    return res.json({ success: true, count: rows.length, data: rows });
  } catch (error) {
    console.error('Error fetching participants:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch participants.' });
  }
};

// GET /api/dashboard/total
const getTotalStats = async (req, res) => {
  try {
    let total = 0;
    let under35 = 0;
    let above35 = 0;
    let totalDistricts = 0;

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      total = memory.length;
      under35 = memory.filter(p => p.under_35 === 'YES').length;
      above35 = memory.filter(p => p.under_35 === 'NO').length;
      const uniqueDistricts = new Set(memory.map(p => p.district));
      totalDistricts = uniqueDistricts.size;
    } else {
      const pool = getPool();
      const [totalRow] = await pool.query('SELECT COUNT(*) as total FROM participants');
      const [under35Row] = await pool.query("SELECT COUNT(*) as count FROM participants WHERE under_35 = 'YES'");
      const [above35Row] = await pool.query("SELECT COUNT(*) as count FROM participants WHERE under_35 = 'NO'");
      const [districtsRow] = await pool.query('SELECT COUNT(DISTINCT district) as count FROM participants');

      total = totalRow[0].total;
      under35 = under35Row[0].count;
      above35 = above35Row[0].count;
      totalDistricts = districtsRow[0].count;
    }

    return res.json({
      success: true,
      total,
      under35,
      above35,
      totalDistricts
    });
  } catch (error) {
    console.error('Error fetching total stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch total stats.' });
  }
};

// GET /api/dashboard/age-wise
const getAgeWiseStats = async (req, res) => {
  try {
    const categories = ['18-25', '26-35', '36-45', 'Above 45'];
    let data = [];

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      data = categories.map(cat => ({
        age_category: cat,
        count: memory.filter(p => p.age_category === cat).length
      }));
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT age_category, COUNT(*) as count FROM participants GROUP BY age_category'
      );
      const countMap = {};
      rows.forEach(r => { countMap[r.age_category] = r.count; });
      data = categories.map(cat => ({
        age_category: cat,
        count: countMap[cat] || 0
      }));
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching age-wise stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch age-wise stats.' });
  }
};

// GET /api/dashboard/medium-wise (stub for backwards compatibility)
const getMediumWiseStats = async (req, res) => {
  return res.json({ success: true, data: [] });
};

// GET /api/dashboard/under35
const getUnder35Stats = async (req, res) => {
  try {
    const options = ['YES', 'NO'];
    let data = [];

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      data = options.map(opt => ({
        under_35: opt,
        count: memory.filter(p => p.under_35 === opt).length
      }));
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT under_35, COUNT(*) as count FROM participants GROUP BY under_35'
      );
      const countMap = {};
      rows.forEach(r => { countMap[r.under_35] = r.count; });
      data = options.map(opt => ({
        under_35: opt,
        count: countMap[opt] || 0
      }));
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching under35 stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch under35 stats.' });
  }
};

// GET /api/dashboard/district-wise
const getDistrictWiseStats = async (req, res) => {
  try {
    let data = [];

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      const countMap = {};
      memory.forEach(p => {
        countMap[p.district] = (countMap[p.district] || 0) + 1;
      });
      data = Object.keys(countMap).map(d => ({ district: d, count: countMap[d] }));
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT district, COUNT(*) as count FROM participants GROUP BY district ORDER BY count DESC'
      );
      data = rows;
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching district-wise stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch district-wise stats.' });
  }
};

// GET /api/dashboard/marathon-wise
const getMarathonWiseStats = async (req, res) => {
  try {
    const categories = ['5 KM', '10 KM', '21 KM', '42 KM'];
    let data = [];

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      data = categories.map(cat => ({
        marathon_category: cat,
        count: memory.filter(p => p.marathon_category === cat).length
      }));
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT marathon_category, COUNT(*) as count FROM participants GROUP BY marathon_category'
      );
      const countMap = {};
      rows.forEach(r => { countMap[r.marathon_category] = r.count; });
      data = categories.map(cat => ({
        marathon_category: cat,
        count: countMap[cat] || 0
      }));
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching marathon-wise stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch marathon-wise stats.' });
  }
};

// GET /api/dashboard/date-wise
const getDateWiseStats = async (req, res) => {
  try {
    let data = [];

    if (getIsFallbackMode()) {
      const memory = getMemoryStore();
      data = VALID_DATES.map(date => ({
        marathon_date: date,
        count: memory.filter(p => p.marathon_date === date).length
      }));
    } else {
      const pool = getPool();
      const [rows] = await pool.query(
        'SELECT marathon_date, COUNT(*) as count FROM participants GROUP BY marathon_date'
      );
      const countMap = {};
      rows.forEach(r => { countMap[r.marathon_date] = r.count; });
      data = VALID_DATES.map(date => ({
        marathon_date: date,
        count: countMap[date] || 0
      }));
    }

    return res.json({ success: true, data });
  } catch (error) {
    console.error('Error fetching date-wise stats:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch date-wise stats.' });
  }
};

module.exports = {
  registerParticipant,
  getAllParticipants,
  getTotalStats,
  getAgeWiseStats,
  getMediumWiseStats,
  getUnder35Stats,
  getDistrictWiseStats,
  getMarathonWiseStats,
  getDateWiseStats
};
