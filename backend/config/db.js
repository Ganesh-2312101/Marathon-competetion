const mysql = require('mysql2/promise');
require('dotenv').config();

// Memory store fallback if MySQL connection fails
let isFallbackMode = false;
let memoryParticipants = [
  {
    id: 1,
    registration_id: 'MAR2026-00001',
    full_name: 'Karthik Raja',
    age: 24,
    gender: 'Male',
    mobile: '9876543210',
    district: 'Chennai',
    medium: 'Tamil',
    marathon_category: '10 KM',
    marathon_date: 'October 17, 2026',
    age_category: '18-25',
    under_35: 'YES',
    tshirt_size: 'L',
    registration_date: new Date().toISOString()
  },
  {
    id: 2,
    registration_id: 'MAR2026-00002',
    full_name: 'Priya Anbarasan',
    age: 29,
    gender: 'Female',
    mobile: '9123456789',
    district: 'Coimbatore',
    medium: 'English',
    marathon_category: '21 KM',
    marathon_date: 'October 18, 2026',
    age_category: '26-35',
    under_35: 'YES',
    tshirt_size: 'M',
    registration_date: new Date().toISOString()
  },
  {
    id: 3,
    registration_id: 'MAR2026-00003',
    full_name: 'Senthil Kumar',
    age: 42,
    gender: 'Male',
    mobile: '9443322110',
    district: 'Madurai',
    medium: 'Tamil',
    marathon_category: '42 KM',
    marathon_date: 'October 19, 2026',
    age_category: '36-45',
    under_35: 'NO',
    tshirt_size: 'XL',
    registration_date: new Date().toISOString()
  },
  {
    id: 4,
    registration_id: 'MAR2026-00004',
    full_name: 'Deepa Subramanian',
    age: 48,
    gender: 'Female',
    mobile: '9988776655',
    district: 'Tiruchirappalli',
    medium: 'English',
    marathon_category: '5 KM',
    marathon_date: 'October 20, 2026',
    age_category: 'Above 45',
    under_35: 'NO',
    tshirt_size: 'S',
    registration_date: new Date().toISOString()
  }
];

let pool;

async function initDB() {
  try {
    const rootConn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      port: process.env.DB_PORT || 3306
    });

    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME || 'marathon_registration'}\`;`);
    await rootConn.end();

    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'marathon_registration',
      port: process.env.DB_PORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS participants (
        id INT AUTO_INCREMENT PRIMARY KEY,
        registration_id VARCHAR(20) NOT NULL UNIQUE,
        full_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(20) NOT NULL,
        mobile VARCHAR(15) NOT NULL,
        district VARCHAR(100) NOT NULL,
        medium VARCHAR(20) NOT NULL,
        marathon_category VARCHAR(20) NOT NULL,
        marathon_date VARCHAR(50) NOT NULL,
        age_category VARCHAR(20) NOT NULL,
        under_35 VARCHAR(10) NOT NULL,
        tshirt_size VARCHAR(10) NOT NULL,
        registration_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    await pool.query(createTableQuery);

    // Auto-migration: ensure marathon_date column exists if table was previously created
    try {
      await pool.query(`ALTER TABLE participants ADD COLUMN marathon_date VARCHAR(50) NOT NULL DEFAULT 'October 17, 2026'`);
    } catch (e) {
      // Column might already exist
    }

    console.log('✅ MySQL Connected successfully & Database schema verified!');
    isFallbackMode = false;
  } catch (err) {
    console.warn('⚠️ Could not connect to MySQL Database:', err.message);
    console.warn('⚠️ Operating in memory fallback mode so the application stays fully functional without MySQL running locally.');
    isFallbackMode = true;
  }
}

function getPool() {
  return pool;
}

function getIsFallbackMode() {
  return isFallbackMode;
}

function getMemoryStore() {
  return memoryParticipants;
}

module.exports = {
  initDB,
  getPool,
  getIsFallbackMode,
  getMemoryStore
};
