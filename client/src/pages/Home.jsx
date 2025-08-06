import React, { useRef, useState, useEffect, useContext } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Container, Row, Col } from 'react-bootstrap';
import { useMediaQuery } from 'react-responsive';
import CallMadeIcon from '@mui/icons-material/CallMade';
import './home.css';

import FlowerImage from '../assets/Flowers2.png';
import Intro from "./Intro.jsx";
import { AppContext } from "../context/AppContext.jsx";
import { Typography, Box } from "@mui/material";
import { Modal, Button } from 'react-bootstrap';


function Home() {
    const videoRef = useRef(null);
    const { courses, backendUrl , blog, blogs, homeData } = useContext(AppContext);
    const [flashRed, setFlashRed] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);  
    const [showIntro, setShowIntro] = useState(true);
    const isMobile = useMediaQuery({ query: '(max-width: 768px)' });
    const [showModal, setShowModal] = useState(false);
    const [modalData, setModalData] = useState(null);

 
  
    useEffect(() => {
      const interval = setInterval(() => {
        setFlashRed(prev => !prev);
      }, 1000);
    
 return () => clearInterval(interval);
    }, []);

    useEffect(() => {
      console.log("homeData in Home.jsx:", homeData);
      if (homeData?.video ) {
        console.log("Video URL:", `${backendUrl}/uploads/videos/${homeData.video}`);
      }
    }, [homeData, backendUrl]);
    
  
    useEffect(() => {
      const timer = setTimeout(() => setShowIntro(false), 4000);
      return () => clearTimeout(timer);
    }, []);
  
  
    const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

  
    const latestCourses = [...courses]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Make sure they're sorted
    .slice(0, 3); 

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % latestCourses.length);
    }, 3000); 

    return () => clearInterval(interval);
  }, [latestCourses.length]);

    
const videoUrl = homeData.video.startsWith('http')
  ? homeData.video
  : `${backendUrl}/${homeData.video.startsWith('/') ? homeData.video.slice(1) : homeData.video}`;


const getImageUrl = (path) => {
  if (!path) return '';
  if (path.startsWith('http')) return path;
  return `${backendUrl}/${path.startsWith('/') ? path.slice(1) : path}`;
};

  if (latestCourses.length === 0) return null;

  const course = latestCourses[currentIndex];

  const latestBlog = blogs && blogs.length > 0 ? blogs[0] : null;

  
    
  return (
   <Container fluid  style={{marginTop: '10px'}}>

    <motion.div
      variants={staggerContainer}
      initial="hidden"
      whileInView="show"
      viewport={{ once: false, amount: 0.3 }}
    >
    <AnimatePresence>
        {showIntro ? (
          <Intro key="intro" />
        ) : (
          <>
          <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
    <Row>



 <Col xs={12} md={6} lg={4} style={{marginBottom: '15px'}}>
    
 {homeData && (
    <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.2 }}
  >
 <div className="fade-in delay-1" style={{ marginLeft: '20px', maxWidth: '100%', zIndex: 2 }}>
   <div style={{ maxWidth: '350px', wordWrap: 'break-word' }}>
     <Typography text-shadow= '1px 1px 2px rgba(0, 0, 0, 0.05)' fontFamily='Poppins' size='lg' color='#8d1f58' fontSize='40px' fontStyle='bold' fontWeight='bold'>
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
     <Link className="btn gallery-btn" to="/book-consultation" style={{ color: '#73155a', textDecoration: 'none' }}>
     {homeData.button2} 
                       </Link>
                     </div>
                   </div>

                   </motion.div>
 )}
      </Col>


           

    
               <Col xs={12} md={6} lg={4} >
                   <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true, amount: 0.2 }}
  >
  <div className="flower-centerpiece">
    <div className="relative-image-wrapper">
      <img src={FlowerImage} alt="Flower" className="img-fluid" style={{ width: '100%', height: 'auto' }} />
      
      {homeData?.hTitle1 && (

  <div  className="floating-blur-card card-top-left mobile-card-top">
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
        height: '100%',
        width: '100%',
        height: '300px',
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
  ref={videoRef}
  src={videoUrl}
  autoPlay
  muted
  loop
  playsInline
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
          <button  style={{ borderRadius: '20px', background: '#8d1f58', width: '150px' , color: '#fff'}} className="view-btn me-2" onClick={() => setShowModal(true)}>
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
  ref={videoRef}
  src={videoUrl}
  autoPlay
  muted
  loop
  playsInline
  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
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
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}>
    <Row style={{ marginTop: '20px'}}>
    <Col xs={12} md={6} lg={4} className="p-0 m-0">
  <div
    style={{
      width: {sx: 100, md: '100%'},
      position: 'relative',
     
      height: '400px',
      overflow: 'hidden',
      borderRadius: '24px',
      marginLeft: '10px',
      marginBottom: '10px',
      boxShadow: '10 2px 6px rgba(0, 0, 0, 0.18)',
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

       <p
  style={{
    position: 'absolute',
    bottom: '60px',
    left: '22px',
    padding: '6px 12px',
    height: '28px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    textDecoration: 'none',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
    zIndex: 10,
    fontWeight: 700,
     backgroundColor: flashRed
    ? 'rgba(195, 94, 151, 0.56)' // soft pinkish blush tone
    : '#ffffff',
  color: flashRed ? '#f0edefff' : '#8d1f58', // brand accent or elegant plum
    border: '1px solid #8d1f58',
    borderRadius: '20px',
    transition: 'all 0.3s ease-in-out',
  }}
>
  New Class
</p>

   
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


<Col xs={12} md={6} lg={4} >
<Box
  sx={{
    position: 'relative',
    right: { xs: 10, md: 40 },
    width: { xs: '80%', md: '50%' },
    marginBottom: { xs: 6, md: 0 },
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
          width: {sx: 100, md: '100%'},
        height: '400px',
        overflow: 'hidden',
        borderRadius: '24px',
        marginRight: '20px',
        marginBottom: '20px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.23)',
        marginLeft: {sx: 10}
      }}
    >
      <img
        src={getImageUrl(latestBlog.image)}
        alt={latestBlog.title}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: 'block',
        }}
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
          background: 'rgba(255, 255, 255, 0.32)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          borderRadius: '12px',
          padding: '10px 16px',
          fontSize: '12px',
          fontWeight: 600,
          color: '#8d1f58',
          width: 'calc(100% - 40px)',
          maxWidth: '240px',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.27)',
        }}
      >
      <p style={{ color: 'white', textShadow: '0 4px 12px rgba(0, 0, 0, 0.59)', fontSize: '12px' }}>
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
  )
}

export default Home
