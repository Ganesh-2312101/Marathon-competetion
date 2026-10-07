const { getPool, getIsFallbackMode, getMemoryStore } = require('../config/db');

async function generateRegistrationId() {
  const prefix = 'MAR2026-';
  let nextNum = 1;

  if (getIsFallbackMode()) {
    const memory = getMemoryStore();
    if (memory.length > 0) {
      const numbers = memory.map(p => {
        const parts = (p.registration_id || '').split('-');
        return parts.length > 1 ? parseInt(parts[1], 10) || 0 : 0;
      });
      const maxNum = Math.max(...numbers, 0);
      nextNum = maxNum + 1;
    }
  } else {
    try {
      const pool = getPool();
      const [rows] = await pool.query(
        `SELECT registration_id FROM participants ORDER BY id DESC LIMIT 1`
      );

      if (rows.length > 0 && rows[0].registration_id) {
        const lastRegId = rows[0].registration_id;
        const parts = lastRegId.split('-');
        if (parts.length > 1) {
          const lastNum = parseInt(parts[1], 10);
          if (!isNaN(lastNum)) {
            nextNum = lastNum + 1;
          }
        }
      }
    } catch (err) {
      console.error('Error fetching max registration_id:', err);
    }
  }

  const paddedNum = String(nextNum).padStart(5, '0');
  return `${prefix}${paddedNum}`;
}

function calculateAgeCategory(age) {
  const numAge = Number(age);
  if (numAge >= 18 && numAge <= 25) {
    return '18-25';
  } else if (numAge >= 26 && numAge <= 35) {
    return '26-35';
  } else if (numAge >= 36 && numAge <= 45) {
    return '36-45';
  } else {
    return 'Above 45';
  }
}

function calculateUnder35(age) {
  const numAge = Number(age);
  return numAge < 35 ? 'YES' : 'NO';
}

module.exports = {
  generateRegistrationId,
  calculateAgeCategory,
  calculateUnder35
};
