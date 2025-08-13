import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { AnimatePresence, motion, useReducedMotion, MotionConfig } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link, Link as RouterLink } from "react-router-dom";
import { Container, Row, Col , Modal, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import CallMadeIcon from '@mui/icons-material/CallMade';
import './home.css';

import FlowerImage from '../assets/Flowers2.png';
import Intro from "./Intro.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { Typography, Box } from "@mui/material";

function Home() {
  
  const { courses, backendUrl, blog, blogs, homeData } = useContext(AppContext);


  const hasSeenIntro = useMemo(() => localStorage.getItem('homeIntroSeen') === '1', []);
  const reduceMotion = useReducedMotion();
  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro);
  const playAnims = !hasSeenIntro && !reduceMotion; // first visit only, honor reduced motion
const bgVideoRef = useRef(null);


const openVideo = () => {
  try { bgVideoRef.current?.pause(); } catch {}
  setShowModal(true);
};
const closeVideo = () => {
  setShowModal(false);
  try { bgVideoRef.current?.play(); } catch {}
};

  // prevent page scroll during fullscreen intro
  useEffect(() => {
    if (showIntro) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showIntro]);

  // ====== FAST, PROFESSIONAL ANIMATION PRESETS ======
  const EASE   = [0.2, 0.8, 0.2, 1];              // crisp ease-out
  const FAST   = { duration: 0.20, ease: EASE };   // snappy
  const MEDIUM = { duration: 0.28, ease: EASE };   // short fade
  // keep spring only where needed; otherwise pure time-based for polish
  const staggerContainer = {
    hidden: {},
    show: { transition: { staggerChildren: 0.04, delayChildren: 0.06 } }
  };
  // minimal travel = less “showy”, more “product”
  const quickUp = {
    hidden: { opacity: 0, y: 8, willChange: 'transform, opacity' },
    show:   { opacity: 1, y: 0, willChange: 'auto', transition: FAST }
  };

  // show the intro once then mark as seen
  useEffect(() => {
    if (hasSeenIntro) { setShowIntro(false); return; }
    const t = setTimeout(() => {
      setShowIntro(false);
      localStorage.setItem('homeIntroSeen', '1');
    }, 2500); // shorter intro window for a pro feel
    return () => clearTimeout(t);
  }, [hasSeenIntro]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
  const [showModal, setShowModal] = useState(false);
  const [modalData, setModalData] = useState(null);

  // latest 3 courses
  const latestCourses = useMemo(() => {
    if (!courses || courses.length === 0) return [];
    return [...courses].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
  }, [courses]);

  // latest blog
  const latestBlog = useMemo(() => (blogs && blogs.length > 0 ? blogs[0] : null), [blogs]);

  // course carousel
  useEffect(() => {
    if (latestCourses.length === 0) return;
    const i = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % latestCourses.length);
    }, 3000);
    return () => clearInterval(i);
  }, [latestCourses.length]);

  // video URL
  const videoUrl = useMemo(() => {
    if (!homeData?.video) return '';
    if (homeData.video.startsWith('http')) return homeData.video;
    return `${backendUrl}/${homeData.video.replace(/^\/+/, '')}`;
  }, [homeData?.video, backendUrl]);

  // image URL builder
  const getImageUrl = useMemo(() => {
    return (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${backendUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
    };
  }, [backendUrl]);

  // pick current course safely
  const course = latestCourses[currentIndex];

  return (
    <MotionConfig transition={FAST}>
      <Container fluid style={{ marginTop: '10px' }}>
        {/* ---- FULLSCREEN INTRO OVERLAY (ONE TIME) ---- */}
        <AnimatePresence>
          {showIntro && (
            <motion.div
              key="intro"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25, ease: EASE }} // faster fade
              style={{
                position: 'fixed',
                inset: 0,
                zIndex: 9999,
                background: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <Intro />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ---- MAIN CONTENT ---- */}
        <motion.div
          variants={staggerContainer}
          initial={playAnims ? "hidden" : false}
          animate="show"
          viewport={{ once: true, amount: 0.15 }}
        >
          <AnimatePresence mode="wait">
            {!showIntro && (
              <>
                <motion.div variants={quickUp} initial={playAnims ? "hidden" : false} animate="show">
                  <Row>
                    <Col xs={12} md={6} lg={4} style={{ marginBottom: '15px' }}>
                      {homeData && (
                        <motion.div variants={quickUp} initial={playAnims ? "hidden" : false} animate="show">
                          <div className="fade-in delay-1" style={{ marginLeft: '20px', maxWidth: '100%', zIndex: 2 }}>
                            <div style={{ maxWidth: '350px', wordWrap: 'break-word' }}>
                              <Typography
                                textShadow='1px 1px 2px rgba(0, 0, 0, 0.05)'
                               
                                size='lg'
                                color='#8d1f58'
                                fontSize='40px'
                                fontStyle='bold'
                                 fontFamily='Poppins'
                                fontWeight='bold'
                              >
                                {homeData.title}
                              </Typography>
                              <span
                                style={{
                                  fontSize: '13px',
                                  textTransform: 'uppercase',
                                  fontWeight: '700',
                                  background: 'linear-gradient(90deg, #8145646e, #aa3869ff)',
                                  WebkitBackgroundClip: 'text',
                                  WebkitTextFillColor: 'transparent',
                                  letterSpacing: '1.2px',
                                  marginBottom: '12px',
                                }}
                              >
                                {homeData.subTitle}
                              </span>
                              <p
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  color: '#7e868dff',
                                  lineHeight: '1.6',
                                  letterSpacing: '0.3px',
                                  maxWidth: '500px',
                                  margin: '16px 0',
                                  fontFamily: "'Inter', sans-serif",
                                  fontStyle: 'italic'
                                }}
                              >
                                {homeData.description}
                              </p>
                            </div>

                            <div style={{ display: 'flex', gap: '12px' }} className="hero-buttons fade-in delay-4 mt-3">
                              <motion.button
                                whileHover={{ y: -1 }}
                                whileTap={{ scale: 0.99 }}
                                transition={FAST}
                                className="glass-button me-2"
                                style={{ transform: 'translateZ(0)' }}
                              >
                                <Link style={{ textDecoration: 'none', color: '#8d1f58' }} to='/class'>
                                  {homeData.button1} <ChevronRight size={16} />
                                </Link>
                              </motion.button>

                              
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </Col>

                    <Col xs={12} md={6} lg={4}>
                      <motion.div variants={quickUp} initial={playAnims ? "hidden" : false} animate="show">
                        <div className="flower-centerpiece">
                          <div className="relative-image-wrapper">
                            <img src={FlowerImage} alt="Flower" className="img-fluid" style={{ width: '100%', height: 'auto' }} />

                            {homeData?.hTitle1 && (
                              <div className="floating-blur-card card-top-left mobile-card-top">
                                <div className="point">{homeData.hTitle1}</div>
                                <p>{homeData.hSubTitle1}</p>
                              </div>
                            )}

                            {homeData?.hTitle2 && (
                              <div className="floating-blur-card card-top-right mobile-card-bottom">
                                <div className="point">{homeData.hTitle2}</div>
                                <p>{homeData.hSubTitle2}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    </Col>

             <Col xs={12} md={6} lg={4} style={{ marginBottom: 0, paddingBottom: 0 }}>
  {homeData?.video && (
    <>
      <div
        onClick={openVideo}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') && openVideo()}
        style={{
          position: 'relative',
          height: 300,
          width: '100%',
          borderRadius: 20,
          overflow: 'hidden',
          boxShadow: '0 2px 8px rgba(0,0,0,.23)',
          cursor: 'pointer',
        }}
      >
        <video
          ref={bgVideoRef}
          src={videoUrl}
          autoPlay
          muted
          loop
          playsInline
          onError={(e) => console.error('Video failed to load:', e.target.src)}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        <div style={{ position: 'absolute', bottom: 20, left: 20, color: '#fff' , fontSize: '15px',
                                fontStyle:'bold',
                                 fontFamily: 'Poppins',
                                }}>
          <p style={{ margin: 0 }}>
            {homeData?.videoTitle || 'Explore our Pilates Programs'}
          </p>

          <div className="hero-buttons fade-in delay-4 mt-3" style={{ display: 'flex', gap: 12 }}>
            {/* Link styled as a button; stops click from opening the modal */}
            <motion.div whileHover={{ y: -1 }} whileTap={{ scale: 0.99 }} transition={FAST}>
              <Link
                to="/book-consultation"
                onClick={(e) => e.stopPropagation()}
                className="glass-button me-2"
                style={{
                  textDecoration: 'none',
                  color: '#8d1f58',
                  display: 'inline-flex',
                  alignItems: 'center',
                  padding: '8px 14px',
                  borderRadius: 20,
                  background: '#FEFCF0',
                }}
              >
                {homeData.button2}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Modal OUTSIDE the clickable card */}
      <Modal show={showModal} onHide={closeVideo} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title style={{ color: '#8d1f58' }}>
            {homeData?.videoTitle || 'Program Overview'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p style={{ color: 'gray', fontSize: 14 }}>
            {homeData?.videoDocumantion?.trim() || 'No description available'}
          </p>
          <video
            src={videoUrl}
            controls
            autoPlay
            style={{ width: '100%', maxHeight: '70vh', borderRadius: 12, marginTop: 12 }}
            onError={(e) => console.error('Modal video failed to load:', e)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            style={{ borderRadius: 20, background: '#8d1f58', width: 150 }}
            onClick={closeVideo}
          >
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )}
</Col>

                  </Row>
                </motion.div>

                <motion.div variants={quickUp} initial={playAnims ? "hidden" : false} animate="show">
                  <Row style={{ marginTop: '20px'}}>
                    {/* --- COURSE CARD --- */}
                    {course && (
                      <Col xs={12} md={6} lg={4} className="p-0 m-0">
                        <motion.div
                          whileHover={{ scale: 1.005 }}
                          transition={FAST}
                          style={{
                            width: '100%',
                            position: 'relative',
                            height: '400px',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            marginLeft: '10px',
                            marginBottom: '10px',
                            boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
                            transform: 'translateZ(0)'
                          }}
                          className="card-bottom-left fade-in delay-1"
                        >
                          <img
                            src={getImageUrl(course.image)}
                            alt={course.title}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              display: 'block',
                            }}
                          />

                          <Link
                            to={`/booking-details/${course._id}`}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: '#fff',
                              borderRadius: '50%',
                              padding: '6px',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              zIndex: 10,
                            }}
                          >
                            <CallMadeIcon style={{ fontSize: '14px', color: '#8d1f58' }} />
                          </Link>

                          <div
                            style={{
                              position: 'absolute',
                              top: '20px',
                              left: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '12px',
                            }}
                          >
                            {course.timing?.slice(0, 2).map((slot, i) => (
                              <div
                                key={i}
                                style={{
                                  background: 'rgba(140, 26, 87, 0.46)',
                                  backdropFilter: 'blur(5px)',
                                  WebkitBackdropFilter: 'blur(5px)',
                                  color: '#fff',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  padding: '6px 12px',
                                  borderRadius: '999px',
                                  boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
                                  whiteSpace: 'nowrap',
                                  border: '1px solid rgba(255,255,255,0.2)',
                                }}
                              >
                                {slot.date} — {slot.time}
                              </div>
                            ))}
                          </div>

                          {/* Glass info bar for course */}
                          <div
                            style={{
                              position: 'absolute',
                              bottom: 10,
                              left: '20px',
                              background: 'rgba(255, 255, 255, 0.32)',
                              backdropFilter: 'blur(12px)',
                              WebkitBackdropFilter: 'blur(12px)',
                              borderRadius: '12px',
                              padding: '10px 16px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#8d1f58',
                              width: '220px',
                              height: '62px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                            }}
                          >
                            <div
                              style={{
                                fontSize: '14px',
                                fontWeight: '700',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                                whiteSpace: 'nowrap',
                              }}
                            >
                              {course.title}
                            </div>
                            <p style={{ color: 'white', textShadow: '0 4px 12px rgba(0, 0, 0, 0.43)' }}>
                              {course.couchName}
                            </p>
                          </div>

                          <div
                            style={{
                              position: 'absolute',
                              bottom: '20px',
                              right: '20px',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '10px',
                            }}
                          >
                            {latestCourses.map((_, i) => (
                              <motion.div
                                key={i}
                                animate={{ opacity: i === currentIndex ? 1 : 0.55 }}
                                transition={FAST}
                                style={{
                                  width: 28, height: 28, borderRadius: '50%',
                                  background: i === currentIndex ? '#fff' : 'transparent',
                                  color: i === currentIndex ? '#000' : '#fff',
                                  border: '1px solid #fff',
                                  fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                  fontWeight: 'bold'
                                }}
                              >
                                {i + 1}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      </Col>
                    )}

                    {/* --- FUEL YOUR WORKOUT CARD --- */}
                    <Col xs={12} md={6} lg={4}>
                      <motion.div whileHover={{ y: -1 }} transition={FAST}>
                        <Box
                          sx={{
                            position: 'relative',
                            right: { xs: 1, md: 5 },
                            width: { xs: '60%', md: '60%' },
                            marginBottom: { xs: 3, md: 0 },
                            borderRadius: '16px',
                            overflow: 'hidden',
                            zIndex: 2,
                            backgroundColor: '#8d1f58',
                            backgroundImage: `
                              url('https://www.transparenttextures.com/patterns/glitter.png'),
                              linear-gradient(to right, #8d1f58, #a5326d)
                            `,
                            backgroundBlendMode: 'overlay',
                            backdropFilter: 'blur(12px)',
                            WebkitBackdropFilter: 'blur(12px)',
                            border: '1px solid rgba(255, 255, 255, 0.3)',
                            padding: '15px',
                            boxShadow: '5px 14px 12px rgba(0,0,0,0.15)'
                          }}
                          className="floating-text-block fade-in delay-2"
                        >
                          <h4 style={{ color: '#e4d7deff', fontWeight: 'bold', fontSize: '20px' }}>
                            Fuel Your Workout
                          </h4>
                          <p style={{ color: '#ede6ecff', fontSize: '12px', marginTop: '12px' }}>
                            Discover quick, high-protein meals to power your recovery and boost performance.
                          </p>

                          <Link
                            to="/workout-meals"
                            style={{
                              background: '#FEFCF0',
                              color: '#8d1f58',
                              width: '100px',
                              height: '30px',
                              borderRadius: '16px',
                              textDecoration: 'none',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontWeight: 'bold',
                              fontSize: '14px',
                              marginTop: '20px',
                            }}
                          >
                            Meals
                          </Link>
                        </Box>
                      </motion.div>
                    </Col>

                    {/* --- LATEST BLOG --- */}
                    {latestBlog && (
                      <Col xs={12} md={6} lg={4} className="p-0 m-0">
                        <Box
                          style={{
                            position: 'relative',
                            width: '100%',
                            height: '400px',
                            overflow: 'hidden',
                            borderRadius: '24px',
                            marginRight: '20px',
                            marginBottom: '20px',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.23)',
                            marginLeft: '10px'
                          }}
                        >
                          <img
                            src={getImageUrl(latestBlog.image)}
                            alt={latestBlog.title}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                          />

                          <Link
                            to={`/blog-details/${latestBlog._id}`}
                            style={{
                              position: 'absolute',
                              top: '20px',
                              right: '20px',
                              background: '#fff',
                              borderRadius: '50%',
                              padding: '6px',
                              width: '28px',
                              height: '28px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              textDecoration: 'none',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                              zIndex: 10,
                            }}
                          >
                            <CallMadeIcon style={{ fontSize: '14px', color: '#8d1f58' }} />
                          </Link>

                          <div
                            style={{
                              position: 'absolute',
                              top: '20px',
                              left: '20px',
                              padding: '6px 12px',
                              borderRadius: '8px',
                              fontSize: '13px',
                              fontWeight: '700',
                              color: '#8d1f58',
                              maxWidth: '75%',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                              zIndex: 5,
                              fontFamily: "Druk Wide Bold"
                            }}
                          >
                            {latestBlog.title}
                          </div>

                          {/* Pink glass description with crisp hover */}
                          <motion.div
                            initial={playAnims ? { opacity: 0, y: 6 } : false}
                            animate={{ opacity: 1, y: 0, transition: FAST }}
                            whileHover={{
                              boxShadow: '0 6px 18px rgba(141, 31, 88, 0.35)',
                              backgroundColor: 'rgba(255, 192, 203, 0.32)',
                            }}
                            transition={FAST}
                            style={{
                              position: 'absolute',
                              bottom: 10,
                              left: '20px',
                              background: 'rgba(255, 192, 203, 0.25)',
                              backdropFilter: 'blur(12px) saturate(180%)',
                              WebkitBackdropFilter: 'blur(12px) saturate(180%)',
                              borderRadius: '12px',
                              padding: '10px 16px',
                              fontSize: '12px',
                              fontWeight: 600,
                              color: '#8d1f58',
                              width: 'calc(100% - 40px)',
                              maxWidth: '240px',
                              boxShadow: '0 4px 12px rgba(141, 31, 88, 0.3)',
                              border: '1px solid rgba(255, 182, 193, 0.4)',
                              transition: 'box-shadow 0.2s ease, background-color 0.2s ease',
                              transform: 'translateZ(0)'
                            }}
                          >
                            <p
                              style={{
                                color: 'white',
                                textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
                                fontSize: '12px',
                                fontFamily: 'Poppins',
                                margin: 0
                              }}
                            >
                              {latestBlog.description?.split(' ').slice(0, 10).join(' ')}...
                            </p>
                          </motion.div>
                        </Box>
                      </Col>
                    )}
                  </Row>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </motion.div>
      </Container>
    </MotionConfig>
  );
}

export default Home;
