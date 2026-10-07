const express = require('express');
const router = express.Router();
const { registerParticipant, getAllParticipants } = require('../controllers/participantController');

// POST /api/participants/register
router.post('/register', registerParticipant);

// GET /api/participants
router.get('/', getAllParticipants);

module.exports = router;
