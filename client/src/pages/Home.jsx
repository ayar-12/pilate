import React, { useRef, useState, useEffect, useContext, useMemo } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, Row, Col , Modal, Button } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import CallMadeIcon from '@mui/icons-material/CallMade';
import './home.css';
import { Link as RouterLink } from 'react-router-dom';
import FlowerImage from '../assets/Flowers2.png';
import Intro from "./Intro.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { Typography, Box } from "@mui/material";

function Home() {
  const videoRef = useRef(null);
  const { courses, backendUrl, blog, blogs, homeData } = useContext(AppContext);

  // ---- ONE-TIME INTRO FLAG ----
  const hasSeenIntro = useMemo(() => localStorage.getItem('homeIntroSeen') === '1', []);
  const reduceMotion = useReducedMotion();
const playAnims = !hasSeenIntro && !reduceMotion; // first visit only, and skip if user prefers reduced motion

  const [showIntro, setShowIntro] = useState(() => !hasSeenIntro);
  const playAnims = !hasSeenIntro; // if they've seen it, skip all animations

  // prevent page scroll during fullscreen intro
  useEffect(() => {
    if (showIntro) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [showIntro]);


  const EASE = [0.22, 1, 0.36, 1]; // “back” bezier, feels natural
const SPRING = { type: "spring", stiffness: 220, damping: 28, mass: 0.8 };
const FAST   = { duration: 0.35, ease: EASE };
const MEDIUM = { duration: 0.55, ease: EASE };

const staggerContainer = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.08, delayChildren: 0.12 }
  }
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: SPRING }
};
  
  // show the intro once then mark as seen
  useEffect(() => {
    if (hasSeenIntro) { setShowIntro(false); return; }
    const t = setTimeout(() => {
      setShowIntro(false);
      localStorage.setItem('homeIntroSeen', '1');
    }, 4000); // adjust duration as you like
    return () => clearTimeout(t);
  }, [hasSeenIntro]);

  const [flashRed, setFlashRed] = useState(true);
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



  // Debug logging for homeData
  useEffect(() => {
    console.log("homeData in Home.jsx:", homeData);
    if (homeData?.video) console.log("Video URL:", homeData.video);
  }, [homeData, backendUrl]);

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

  useEffect(() => {
    if (videoUrl) console.log("✅ Final video URL:", videoUrl);
    else console.warn("⚠️ No video URL — check homeData or backendUrl");
  }, [videoUrl]);

  // image URL builder
  const getImageUrl = useMemo(() => {
    return (path) => {
      if (!path) return '';
      if (path.startsWith('http')) return path;
      return `${backendUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
    };
  }, [backendUrl]);

  // animation variants
  const staggerContainer = {
    hidden: {},
    show: {
      transition: { staggerChildren: 0.15, delayChildren: 0.2 },
    },
  };

  // pick current course safely
  const course = latestCourses[currentIndex];

  return (
    <Container fluid style={{ marginTop: '10px' }}>
      {/* ---- FULLSCREEN INTRO OVERLAY (ONE TIME) ---- */}
      <AnimatePresence>
        {showIntro && (
      <motion.div
  key="intro"
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={MEDIUM} // was 0.4 linear; now eased
  style={{ position: 'fixed', inset: 0, zIndex: 9999, background: '#fff',
           display: 'flex', alignItems: 'center', justifyContent: 'center' }}
>
            <Intro />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ---- MAIN CONTENT ---- */}
 <motion.div
  variants={staggerContainer}
  initial={playAnims ? "hidden" : false}
  animate={playAnims ? "show" : "show"}
  viewport={{ once: true, amount: 0.2 }}
>

        <AnimatePresence mode="wait">
          {!showIntro && (
            <>
           <motion.div
  initial={playAnims ? { opacity: 0, y: 30 } : false}
  animate={playAnims ? { opacity: 1, y: 0 } : undefined}
  transition={{ duration: 0.8 }}
>

                <Row>
                  <Col xs={12} md={6} lg={4} style={{ marginBottom: '15px' }}>
                    {homeData && (
                           <motion.div
  initial={playAnims ? { opacity: 0, y: 30 } : false}
  animate={playAnims ? { opacity: 1, y: 0 } : undefined}
  transition={{ duration: 0.8 }}
>
                        <div className="fade-in delay-1" style={{ marginLeft: '20px', maxWidth: '100%', zIndex: 2 }}>
                          <div style={{ maxWidth: '350px', wordWrap: 'break-word' }}>
                            <Typography
                              textShadow='1px 1px 2px rgba(0, 0, 0, 0.05)'
                              fontFamily='Poppins'
                              size='lg'
                              color='#8d1f58'
                              fontSize='40px'
                              fontStyle='bold'
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
                            <button className="glass-button me-2">
                              <Link style={{ textDecoration: 'none', color: '#8d1f58' }} to='/class'>
                                {homeData.button1} <ChevronRight size={16} />
                              </Link>
                            </button>
                        <Button
  component={RouterLink}
  to="/book-consultation"
  variant="outlined"
  size="large"
  sx={{
    px: 2.5,
    py: 1,
    borderRadius: '999px',
    textTransform: 'none',
    fontWeight: 600,
    borderColor: '#73155a',
    color: '#73155a',
    '&:hover': {
      bgcolor: '#73155a',
      color: '#fff',
      borderColor: '#73155a',
    },
  }}
>
  {homeData.button2}
</Button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </Col>

                  <Col xs={12} md={6} lg={4}>
                           <motion.div
  initial={playAnims ? { opacity: 0, y: 30 } : false}
  animate={playAnims ? { opacity: 1, y: 0 } : undefined}
  transition={{ duration: 0.8 }}
>
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
                      <div
                        style={{
                          position: 'relative',
                          top: 0,
                          left: 0,
                          height: '300px',
                          width: '100%',
                          border: 'none',
                          borderRadius: '20px',
                          overflow: 'hidden',
                          zIndex: 2,
                          padding: 0,
                          margin: 0,
                          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.23)',
                        }}
                      >
                        <video
                          src={videoUrl}
                          autoPlay
                          muted
                          loop
                          playsInline
                          onError={e => console.error('Video failed to load:', e.target.src)}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        >
                          <source src={videoUrl} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>

                        <div
                          style={{
                            position: 'absolute',
                            bottom: '20px',
                            left: '20px',
                            color: '#fff',
                          }}
                        >
                          <p style={{ margin: 0 }}>{homeData?.videoTitle || 'Explore our Pilates Programs'}</p>
                          <div style={{ marginTop: '10px' }}>
                            <button
                              style={{ borderRadius: '20px', background: '#8d1f58', width: '150px', color: '#fff' }}
                              className="view-btn me-2"
                              onClick={() => setShowModal(true)}
                            >
                              View
                            </button>
                          </div>
                        </div>

                        <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
                          <Modal.Header closeButton>
                            <Modal.Title style={{color: '#8d1f58'}}>{homeData?.videoTitle || 'Program Overview'}</Modal.Title>
                          </Modal.Header>
                          <Modal.Body>
                            <p style={{color: 'gray', fontSize: '14px'}}>{homeData?.videoDocumantion?.trim() || 'No description available'}</p>
                            <video
                              src={videoUrl}
                              controls
                              style={{ width: '100%', maxHeight: '400px', borderRadius: '12px', marginTop: '20px' }}
                              onError={(e) => { console.error('Modal video failed to load:', e); }}
                            >
                              <source src={videoUrl} type="video/mp4" />
                              Your browser does not support the video tag.
                            </video>
                          </Modal.Body>
                          <Modal.Footer>
                            <Button
                              style={{ borderRadius: '20px', background: '#8d1f58', width: '150px' }}
                              onClick={() => setShowModal(false)}
                            >
                              Close
                            </Button>
                          </Modal.Footer>
                        </Modal>
                      </div>
                    )}
                  </Col>
                </Row>
              </motion.div>

                      <motion.div
  initial={playAnims ? { opacity: 0, y: 30 } : false}
  animate={playAnims ? { opacity: 1, y: 0 } : undefined}
  transition={{ duration: 0.8 }}
>
                <Row style={{ marginTop: '20px'}}>
                  {/* --- COURSE CARD --- */}
                  {course && (
                    <Col xs={12} md={6} lg={4} className="p-0 m-0">
                           
                      <div
                        style={{
                          width: '100%',
                          position: 'relative',
                          height: '400px',
                          overflow: 'hidden',
                          borderRadius: '24px',
                          marginLeft: '10px',
                          marginBottom: '10px',
                          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.18)',
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
                            <div
                              key={i}
                              style={{
                                width: '28px',
                                height: '28px',
                                borderRadius: '50%',
                                background: i === currentIndex ? '#fff' : 'transparent',
                                color: i === currentIndex ? '#000' : '#fff',
                                border: '1px solid #fff',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontWeight: 'bold',
                                transition: 'all 0.3s ease',
                              }}
                            >
                              {i + 1}
                            </div>
                          ))}
                        </div>
                      </div>
                           
                        
                    </Col>
                  )}

                  {/* --- FUEL YOUR WORKOUT CARD --- */}
                  <Col xs={12} md={6} lg={4}>
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
                  </Col>

                 
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

                    <div
  style={{
    position: 'absolute',
    bottom: 10,
    left: '20px',
    background: 'rgba(255, 192, 203, 0.25)', // light pink overlay
    backdropFilter: 'blur(12px) saturate(180%)',
    WebkitBackdropFilter: 'blur(12px) saturate(180%)',
    borderRadius: '12px',
    padding: '10px 16px',
    fontSize: '12px',
    fontWeight: 600,
    color: '#8d1f58',
    width: 'calc(100% - 40px)',
    maxWidth: '240px',
    boxShadow: '0 4px 12px rgba(141, 31, 88, 0.3)', // pinkish shadow
    border: '1px solid rgba(255, 182, 193, 0.4)', // subtle pink border
    transition: 'all 0.3s ease-in-out',
  }}
>
  <p
    style={{
      color: 'white',
      textShadow: '0 4px 12px rgba(0, 0, 0, 0.4)',
      fontSize: '12px',
        fontFamily: 'Poppins',
    }}
  >
    {latestBlog.description?.split(' ').slice(0, 10).join(' ')}...
  </p>
</div>

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
  );
}

export default Home;

