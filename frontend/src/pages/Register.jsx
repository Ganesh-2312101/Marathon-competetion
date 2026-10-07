import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Phone, MapPin, Award, Shirt, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { registerParticipant } from '../services/api';

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

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    full_name: '',
    age: '',
    gender: '',
    mobile: '',
    district: '',
    marathon_category: '',
    marathon_date: '',
    tshirt_size: ''
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.full_name.trim()) {
      newErrors.full_name = 'Full Name is required.';
    }

    const ageNum = parseInt(formData.age, 10);
    if (!formData.age || isNaN(ageNum)) {
      newErrors.age = 'Age is required.';
    } else if (ageNum < 18 || ageNum > 100) {
      newErrors.age = 'Age must be between 18 and 100 years.';
    }

    if (!formData.gender) {
      newErrors.gender = 'Gender selection is required.';
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = 'Mobile Number is required.';
    } else if (!/^\d{10}$/.test(formData.mobile.trim())) {
      newErrors.mobile = 'Mobile number must be exactly 10 digits.';
    }

    if (!formData.district) {
      newErrors.district = 'District selection is required.';
    }

    if (!formData.marathon_category) {
      newErrors.marathon_category = 'Marathon Category selection is required.';
    }

    if (!formData.marathon_date) {
      newErrors.marathon_date = 'Marathon Date selection is required.';
    }

    if (!formData.tshirt_size) {
      newErrors.tshirt_size = 'T-Shirt Size selection is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      return;
    }

    setSubmitting(true);

    try {
      const response = await registerParticipant({
        full_name: formData.full_name,
        age: parseInt(formData.age, 10),
        gender: formData.gender,
        mobile: formData.mobile,
        district: formData.district,
        marathon_category: formData.marathon_category,
        marathon_date: formData.marathon_date,
        tshirt_size: formData.tshirt_size
      });

      if (response.data && response.data.success) {
        navigate('/success', { state: { participant: response.data.data } });
      } else {
        setServerError(response.data?.message || 'Registration failed. Please try again.');
      }
    } catch (err) {
      console.error('Registration Error:', err);
      setServerError(
        err.response?.data?.message || 'Server connection error. Please ensure Node.js server is running.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-page">
      <div className="form-container">
        <div className="form-header">
          <h2>Marathon Participant Registration</h2>
          <p>Complete the form below to register for TAMIL NADU MARATHON 2026</p>
        </div>

        {serverError && (
          <div className="alert alert-error">
            <AlertCircle size={20} />
            <span>{serverError}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate className="registration-form">
          {/* Full Name */}
          <div className="form-group">
            <label htmlFor="full_name">
              <User size={16} /> Full Name <span className="required">*</span>
            </label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              placeholder="e.g. Ganesh M"
              value={formData.full_name}
              onChange={handleChange}
              className={errors.full_name ? 'input-error' : ''}
            />
            {errors.full_name && <span className="error-message">{errors.full_name}</span>}
          </div>

          <div className="form-row-2">
            {/* Age */}
            <div className="form-group">
              <label htmlFor="age">
                <Calendar size={16} /> Age (18 - 100) <span className="required">*</span>
              </label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="e.g. 24"
                min="18"
                max="100"
                value={formData.age}
                onChange={handleChange}
                className={errors.age ? 'input-error' : ''}
              />
              {errors.age && <span className="error-message">{errors.age}</span>}
            </div>

            {/* Gender */}
            <div className="form-group">
              <label htmlFor="gender">
                Gender <span className="required">*</span>
              </label>
              <select
                id="gender"
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={errors.gender ? 'input-error' : ''}
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <span className="error-message">{errors.gender}</span>}
            </div>
          </div>

          <div className="form-row-2">
            {/* Mobile Number */}
            <div className="form-group">
              <label htmlFor="mobile">
                <Phone size={16} /> Mobile Number <span className="required">*</span>
              </label>
              <input
                type="tel"
                id="mobile"
                name="mobile"
                placeholder="10-digit mobile number"
                maxLength="10"
                value={formData.mobile}
                onChange={handleChange}
                className={errors.mobile ? 'input-error' : ''}
              />
              {errors.mobile && <span className="error-message">{errors.mobile}</span>}
            </div>

            {/* District */}
            <div className="form-group">
              <label htmlFor="district">
                <MapPin size={16} /> District <span className="required">*</span>
              </label>
              <select
                id="district"
                name="district"
                value={formData.district}
                onChange={handleChange}
                className={errors.district ? 'input-error' : ''}
              >
                <option value="">Select District</option>
                {VALID_DISTRICTS.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
              {errors.district && <span className="error-message">{errors.district}</span>}
            </div>
          </div>

          <div className="form-row-3">
            {/* Marathon Category */}
            <div className="form-group">
              <label htmlFor="marathon_category">
                <Award size={16} /> Marathon Category <span className="required">*</span>
              </label>
              <select
                id="marathon_category"
                name="marathon_category"
                value={formData.marathon_category}
                onChange={handleChange}
                className={errors.marathon_category ? 'input-error' : ''}
              >
                <option value="">Select Distance</option>
                <option value="5 KM">5 KM</option>
                <option value="10 KM">10 KM</option>
                <option value="21 KM">21 KM</option>
                <option value="42 KM">42 KM</option>
              </select>
              {errors.marathon_category && <span className="error-message">{errors.marathon_category}</span>}
            </div>

            {/* Marathon Date Selection */}
            <div className="form-group">
              <label htmlFor="marathon_date">
                <Clock size={16} /> Preferred Event Date <span className="required">*</span>
              </label>
              <select
                id="marathon_date"
                name="marathon_date"
                value={formData.marathon_date}
                onChange={handleChange}
                className={errors.marathon_date ? 'input-error' : ''}
              >
                <option value="">Select Event Date</option>
                {MARATHON_DATES.map((dateStr) => (
                  <option key={dateStr} value={dateStr}>
                    {dateStr}
                  </option>
                ))}
              </select>
              {errors.marathon_date && <span className="error-message">{errors.marathon_date}</span>}
            </div>

            {/* T-Shirt Size */}
            <div className="form-group">
              <label htmlFor="tshirt_size">
                <Shirt size={16} /> T-Shirt Size <span className="required">*</span>
              </label>
              <select
                id="tshirt_size"
                name="tshirt_size"
                value={formData.tshirt_size}
                onChange={handleChange}
                className={errors.tshirt_size ? 'input-error' : ''}
              >
                <option value="">Select Size</option>
                <option value="S">S</option>
                <option value="M">M</option>
                <option value="L">L</option>
                <option value="XL">XL</option>
                <option value="XXL">XXL</option>
              </select>
              {errors.tshirt_size && <span className="error-message">{errors.tshirt_size}</span>}
            </div>
          </div>

          <div className="form-footer">
            <button type="submit" className="btn btn-primary btn-submit" disabled={submitting}>
              {submitting ? (
                <span>Registering Participant...</span>
              ) : (
                <>
                  <CheckCircle2 size={20} />
                  <span>Submit Registration</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
