import React, { useState, useContext } from 'react';
import { Form, Container, Alert } from 'react-bootstrap';
import axios from 'axios';
import { AppContext } from '../context/AppContext';

function BookConsultation() {
  const { backendUrl } = useContext(AppContext);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    preferredDate: '',
    preferredTime: '',
    notes: ''
  });

  const [status, setStatus] = useState(null);

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    padding: '12px 20px',
    fontSize: '16px',
    width: '100%',
    color: 'black'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${backendUrl}/api/consultation/new`, formData);
      setStatus({ type: 'success', message: 'Consultation booked successfully!' });
      setFormData({
        userName: '',
        userEmail: '',
        userPhone: '',
        preferredDate: '',
        preferredTime: '',
        notes: ''
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Error booking consultation. Try again.' });
    }
  };

  return (
    <Container style={{ padding: '40px' }}>
      <h2 className="mb-4 text-center" style={{ color: '#8d1f58' }}>Book a Consultation</h2>
      {status && <Alert variant={status.type === 'success' ? 'success' : 'danger'}>{status.message}</Alert>}
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Control type="text" name="userName" placeholder="Your Name" value={formData.userName} onChange={handleChange} style={inputStyle} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="email" name="userEmail" placeholder="Your Email" value={formData.userEmail} onChange={handleChange} style={inputStyle} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="tel" name="userPhone" placeholder="Your Phone" value={formData.userPhone} onChange={handleChange} style={inputStyle} required />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="date" name="preferredDate" value={formData.preferredDate} onChange={handleChange} style={inputStyle} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control type="time" name="preferredTime" value={formData.preferredTime} onChange={handleChange} style={inputStyle} />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Control as="textarea" name="notes" placeholder="Notes (Optional)" value={formData.notes} onChange={handleChange} style={inputStyle} rows={3} />
        </Form.Group>
        <button type="submit" style={{ width: '100%', padding: '12px', backgroundColor: '#8d1f58', color: '#fff', border: 'none', borderRadius: '20px' }}>Book Consultation</button>
      </Form>
    </Container>
  );
}

export default BookConsultation;
