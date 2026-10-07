import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Registration API
export const registerParticipant = (data) => api.post('/participants/register', data);

// Get All Participants
export const fetchParticipants = () => api.get('/participants');

// Dashboard APIs
export const fetchTotalStats = () => api.get('/dashboard/total');
export const fetchAgeWiseStats = () => api.get('/dashboard/age-wise');
export const fetchMediumWiseStats = () => api.get('/dashboard/medium-wise');
export const fetchUnder35Stats = () => api.get('/dashboard/under35');
export const fetchDistrictWiseStats = () => api.get('/dashboard/district-wise');
export const fetchMarathonWiseStats = () => api.get('/dashboard/marathon-wise');
export const fetchDateWiseStats = () => api.get('/dashboard/date-wise');

export default api;
