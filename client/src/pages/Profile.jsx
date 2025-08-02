import React, { useRef, useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { ChevronRight, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';



import './home.css';
import Pilaties2 from '../assets/img2.jpg';
import Pilaties3 from '../assets/img3.jpg';
import FlowerImage from '../assets/Flowers2.png';
import PilatesVideo from '../assets/pinterest.mp4';
import Intro from "./Intro.jsx";

const Home = () => {
  const videoRef = useRef(null);
  const [showIntro, setShowIntro] = useState(true);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    const timer = setTimeout(() => setShowIntro(false), 4000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container
      fluid
     className="px-3 px-md-5 py-5"
      style={{
        background: 'linear-gradient(135deg, rgb(252, 245, 248), rgb(234, 219, 229), rgb(230, 219, 226), rgb(237, 224, 233), rgb(239, 239, 246))',
     
      }}
    >
      <AnimatePresence>
        {showIntro ? (
          <Intro key="intro" />
        ) : (
          <div className="landing-page" key="landing">
       
            <Row>
              <Col xs={12} md={6} lg={4} className="mb-4">
            <div className="hero-left-text fade-in delay-1" style={{ padding: '20px', textAlign: isMobile ? 'center' : 'left' }}>


                <h1 style={{ fontSize: '28px', fontWeight: 600, lineHeight: '1.4' }}>Breathe. Strengthen. Glow.</h1>
               
               <span className="line2 fade-in delay-2">EXCELLENCE THE ACEUP ADVANTAGE</span>
                  <p className="fade-in delay-3">
                    Empowering mindful movement through <br /> personalized classes in a tranquil space
                  </p>
                  <div className="hero-buttons fade-in delay-4 mt-3">
                    <button className="glass-button me-2">
                     <Link style={{textDecoration: 'none', color: '#8d1f58'}} to='/booking'> Book Your First Class <ChevronRight size={16} /></Link>
                    </button>
                    <Link className="btn gallery-btn" to="/booking" style={{ color: '#73155a', textDecoration: 'none' }}>
                      Book Consult
                    </Link>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={6} lg={4}className="text-center">
                <div className="video-floating-card fade-in delay-1">
                  <video
                    ref={videoRef}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="video-thumb fade-in delay-2 w-100 rounded"
                  >
                    <source src={PilatesVideo} type="video/mp4" />
                  </video>
                  <div className="video-text fade-in delay-3 mt-2">
                    <p>Discover the winning edge with our comprehensive pilaties training programs.</p>
                    <div className="video-actions fade-in delay-4">
                      <button className="view-btn me-2">View</button>
                      <a className="readmore-link" href="#">Read More</a>
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

   
            <Row className="mb-5">
              <Col xs={12} md={6} lg={4} className="mb-4">
                <div className="card-bottom-left fade-in delay-1">
                  <img src={Pilaties3} alt="Court Booking" className="img-fluid rounded fade-in delay-2" />
                  <div className="card-content fade-in delay-3 mt-3">
                    <h4>Courtbookings</h4>
                    <p>Reserve your court time and unleash your pilaties passion on our premium courts.</p>
                    <button className="readmore-btn fade-in delay-4">Read More</button>
                  </div>
                </div>
              </Col>

              <Col xs={12} md={6} lg={4} className="mb-4">
                <div className="card-bottom-right fade-in delay-2">
                  <img src={Pilaties2} alt="Club" className="img-fluid rounded fade-in delay-3" />
                  <div className="card-content fade-in delay-4 mt-3">
                    <span className="badge fade-in delay-4">CLUB NOVELTY</span>
                    <h4 className="mt-2">Meet Our Game-Changer!</h4>
                    <p>Exciting news in our club! We’ve just introduced the latest addition...</p>
                    <div className="card-icon-btn fade-in delay-4">
                      <ArrowRight size={16} color="#fff" />
                    </div>
                  </div>
                </div>
              </Col>
            </Row>

   
            <Row className="justify-content-center text-center mb-5">
              <Col xs={12} md={6} lg={4}>
                <div className="floating-text-block">
                  <h4>Designing Elegance</h4>
                  <p>
                    Unleash your full pilaties potential with AceUp’s top-tier coaching and state-of-the-art facilities,
                    where champions are forged.
                  </p>
                  <a className="readmore-link" href="#">Read More</a>
                </div>
              </Col>
            </Row>

         
            <Row className="justify-content-center text-center">
              <Col xs={6} sm={4} md={3}>
                <div className="flower-centerpiece fade-in-on-load">
                  <img src={FlowerImage} alt="Flower" className="img-fluid" />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </AnimatePresence>
    </Container>
  );
};

export default Home; 