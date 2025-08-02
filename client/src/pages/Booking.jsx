import React, { useState, useEffect, useContext } from 'react';
import { Container, Row, Col, Form, Alert } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { AppContext } from '../context/AppContext';
import 'bootstrap/dist/css/bootstrap.min.css';
import './home.css';
import { ArrowRight } from "lucide-react";

function Booking() {
  const { courseId } = useParams();
  const { backendUrl } = useContext(AppContext);
  const [course, setCourse] = useState(null);
  const [formData, setFormData] = useState({
    userName: '',
    userEmail: '',
    userPhone: '',
    time: '8:00 AM',
    courseId: courseId
  });

  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (courseId) {
      axios.get(`${backendUrl}/api/course/courses/${courseId}`)
        .then(res => {
          const data = res.data.data;
          setCourse(data);
          setFormData(prev => ({
            ...prev,
            courseId: courseId,
            courseName: data.title,
            coursePrice: data.price,
            courseDetails: {
              title: data.title,
              instructor: data.couchName || "N/A",
              duration: data.duration || "N/A",
              description: data.description || "N/A"
            }
          }));
        })
        .catch(err => console.error("Error fetching course:", err));
    }
  }, [courseId, backendUrl]);

  const inputStyle = {
    background: 'rgba(255, 255, 255, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.25)',
    borderRadius: '20px',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    color: '#fff',
    padding: '12px 20px',
    fontSize: '16px',
    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.1), 0 4px 10px rgba(0, 0, 0, 0.1)',
    outline: 'none',
    appearance: 'none',
    width: '100%',
    fontFamily: 'Lora'
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();

    if (!formData.userName || !formData.userEmail || !formData.userPhone) {
      setStatus({ type: 'error', message: 'Please fill in all required fields.' });
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/api/booking/new-booking`, formData);
      setStatus({ type: 'success', message: 'Booking successful! 🎉' });
      setFormData({ 
        userName: '', 
        userEmail: '', 
        userPhone: '', 
        time: '8:00 AM',
        courseId: courseId 
      });
    } catch (err) {
      setStatus({ type: 'error', message: 'Booking failed. Please try again.' });
    }
  };

  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    if (imagePath.startsWith('http')) return imagePath;
    const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
    return `${backendUrl}/${cleanPath}`;
  };

  return (
    <Container fluid className="p-0 m-0">
      <Row className="g-0" style={{ minHeight: '100vh' }}>
        <Col md={8} className="position-relative">
            <div className="card-bottom-right2">
              <span className="badge">{course ? course.couchName : 'Loading'}</span>
              <div className="p-3">
                <br />
              <p style={{color: '#777676ff',  fontFamily:'Magical Childhood, cursive'}} className="mt-3">
                {course ? course.title : 'Loading...'}
              </p>
              <p style={{ color: '#333432ff', fontSize: '14px' }}>{course ? course.description : 'Loading course details...'}</p>
             
              </div>
            </div>
          {course && course.image ? (
            <img
              src={getImageUrl(course.image)}
              alt={course.title}
              style={{
                width: '100%',
                height: '800px',
                objectFit: 'cover',
                borderRadius: '12px',
              }}
              onError={(e) => {
                e.target.src = 'https://via.placeholder.com/800x400?text=Image+Not+Found';
              }}
            />
          ) : (
            <div style={{
              width: '100%',
              height: '800px',
              backgroundColor: '#f5f5f5',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              Loading image...
          </div>
          )}
        </Col>

        <Col md={4} className="position-relative d-flex align-items-center justify-content-center" style={{ overflow: 'hidden', padding: '40px' }}>
          <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', zIndex: 1 }} />
          <div style={{ zIndex: 2, width: '100%', maxWidth: '350px', color: '#fff' }}>
            <Form onSubmit={handleBooking}>
              <h2 className="h2 mb-4 text-center" style={{ color: '#8d1f58' }}>
                Book Your Session
              </h2>

              {status && (
                <Alert variant={status.type === 'success' ? 'success' : 'danger'}>
                  {status.message}
                </Alert>
              )}

              <Form.Group className="mb-3">
                <Form.Control
    
                  type="text"
                  name="userName"
                  value={formData.userName}
                  onChange={handleChange}
                  placeholder="Enter your name"
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="userEmail"
                  value={formData.userEmail}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="tel"
                  placeholder="Enter your phone"
                  name="userPhone"
                  value={formData.userPhone}
                  onChange={handleChange}
                  style={inputStyle}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Select
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  style={inputStyle}
                >
                  {course?.timing?.map((t, idx) => (
                    <option key={idx} value={t.time}>
                      {t.date} — {t.time}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>

              <button 
                style={{ 
                  borderRadius: '20px', 
                  background: '#8d1f58', 
                  color: 'rgb(240, 237, 237)',
                  width: '100%',
                  padding: '10px',
                  border: 'none',
                  cursor: 'pointer'
                }}
                type="submit"
              >
                Book Now
              </button>
            </Form>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Booking;
