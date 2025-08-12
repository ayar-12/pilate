import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ChevronRight } from "lucide-react";
import axios from 'axios';
import { useInView } from 'react-intersection-observer';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  Grid,
  Container,
  Chip,
  Divider,
  Card,
  CardMedia,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { AppContext } from '../context/AppContext';
import { motion } from 'framer-motion';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';

const BookingDetails = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { backendUrl, courses, isLoggedin } = useContext(AppContext);

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [openAlert, setOpenAlert] = useState(false);

  const { ref: videoRef, inView: videoInView } = useInView({ triggerOnce: true });
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const getImageUrl = (path) => {
    if (!path) return "/placeholder-image.png";
    if (path.startsWith("http")) return path;
    return `${backendUrl}/${path.replace(/^\/+/g, "")}`;
  };

  const normalizePath = (path) => path?.replace(/^\/+/g, '').replace(/^uploads\//, 'uploads/');

  const handleBookNow = () => {
    if (!isLoggedin) {
      setOpenAlert(true);
      return;
    }
    if (course) navigate(`/booking/${courseId}`);
  };

  useEffect(() => {
    const controller = new AbortController();

    const fetchCourseDetails = async () => {
      try {
        const res = await axios.get(`${backendUrl}/api/course/courses/${courseId}`, {
          signal: controller.signal
        });
        if (res.data.success) {
          const data = res.data.data;
          setCourse(data);
          if (data.video) {
            setVideoPreview(
              data.video.startsWith("http") ? data.video : `${backendUrl}/${normalizePath(data.video)}`
            );
          }
        }
      } catch (err) {
        if (err.name !== 'CanceledError') setError('Failed to load course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourseDetails();
    return () => controller.abort();
  }, [courseId, backendUrl]);

  if (loading)
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );

  if (error)
    return (
      <Container>
        <Alert severity="error">{error}</Alert>
      </Container>
    );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.4 }}
    >
      <Box sx={{ minHeight: "100vh", py: 6, padding: { xs: 1, sm: 1, md: 1 } }}>
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: 4,
            mt: 6,
            width: '100%',
          }}
        >
          {/* LEFT - HERO IMAGE */}
          <Box
            sx={{
              flex: 1,
              minWidth: 0,
              position: 'relative',
              height: { xs: 300, md: 650 },
              borderRadius: 4,
              overflow: 'hidden',
            }}
          >
            <img
              src={course.image}
              alt={course.title}
              style={{
                width: '100%',
                height: isMobile ? 300 : 650,
                objectFit: 'cover',
                borderRadius: '16px',
              }}
              onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
            />

            <Box
              sx={{
                position: 'absolute',
                top: 16,
                left: 16,
                background: '#fff',
                px: 2,
                py: 1,
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Typography fontWeight="bold" fontSize={14}>
                Target
              </Typography>
              <Typography fontSize={13}>Strength & control</Typography>
            </Box>

            <Box
              sx={{
                position: 'absolute',
                bottom: 16,
                right: 16,
                background: '#fff',
                px: 2,
                py: 1,
                borderRadius: '12px',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              }}
            >
              <Typography fontWeight="bold" fontSize={14}>
                Core Focus
              </Typography>
              <Typography fontSize={13}>Strength & control</Typography>
            </Box>
          </Box>

          {/* RIGHT - DETAILS */}
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography variant="subtitle1" color="text.secondary" sx={{ mb: 1 }}>
              Wellness & Fitness
            </Typography>

            <Typography
              variant="h4"
              sx={{ fontWeight: 'bold', color: '#8d1f58', mb: 2 }}
            >
              {course.title}
            </Typography>

            <Typography variant="h6" fontWeight={600} color="#bd84a1" sx={{ mb: 2 }}>
              OMR {course.price}
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ fontSize: 15, mb: 3 }}>
              {course.description}
            </Typography>

            <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
              <Chip label={`Coach: ${course.couchName}`} />
              <Chip label="Popular" variant="outlined" />
            </Box>

            <Divider sx={{ my: 3 }} />

            {course.timing?.length > 0 && (
              <>
                <Typography variant="h6" fontWeight={300} fontSize={14}>
                  Available Timings
                </Typography>
                <List>
                  {course.timing.map((t, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemText primary={`📅 ${t.date}`} secondary={`⏰ ${t.time}`} />
                    </ListItem>
                  ))}
                </List>
              </>
            )}

            <Button
              onClick={handleBookNow}
              variant="contained"
              fullWidth
              sx={{
                mt: 4,
                py: 1.5,
                borderRadius: '999px',
                backgroundColor: '#8d1f58',
                '&:hover': { backgroundColor: '#a13b65' },
              }}
            >
              Book Now
            </Button>
          </Box>
        </Box>

        {videoPreview && (
          <Box ref={videoRef} mt={10}>
            <Typography
              variant="h5"
              fontWeight="bold"
              color="#8d1f58"
              textAlign="center"
              sx={{ mb: 3 }}
            >
              Video Trailer
            </Typography>

            {videoInView && (
              <video
                ref={(ref) => (window.courseVideo = ref)}
                onClick={() => {
                  const v = window.courseVideo;
                  if (!v) return;
                  v.paused ? v.play() : v.pause();
                }}
                controls
                playsInline
                style={{
                  width: '100%',
                  maxHeight: '600px',
                  borderRadius: 20,
                  objectFit: 'cover',
                  boxShadow: '0 6px 24px rgba(0,0,0,0.1)',
                  cursor: 'pointer',
                }}
              >
                <source src={videoPreview} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            )}
          </Box>
        )}

        {courses && courses.length > 0 && (
          <Box mt={10}>
            <Typography
              variant="h6"
              color="#670D2F"
              sx={{ mb: 4, textAlign: 'center' }}
            >
              You Might Also Like
            </Typography>

            <Grid container spacing={4} justifyContent="center" alignItems="stretch">
              {courses
                .filter((c) => c._id !== courseId)
                .slice(0, 3)
                .map((course) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    key={course._id}
                    display="flex"
                    justifyContent="center"
                  >
                    <Box sx={{ width: 400, maxWidth: '100%' }}>
                      <Card
                        sx={{
                          position: 'relative',
                          width: '100%',
                          height: { xs: 240, sm: 300, md: 360 },
                          borderRadius: '16px',
                          overflow: 'hidden',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'flex-end',
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={getImageUrl(course.image)}
                          alt={course.title}
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                            zIndex: 0,
                          }}
                          onError={(e) => {
                            e.currentTarget.src = "/placeholder-image.png";
                          }}
                        />

                        <Box
                          sx={{
                            position: 'absolute',
                            inset: 0,
                            background:
                              'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15))',
                            backdropFilter: 'blur(3px)',
                            zIndex: 1,
                          }}
                        />

                        <CardContent
                          sx={{
                            position: 'relative',
                            zIndex: 2,
                            p: 3,
                            color: 'white',
                          }}
                        >
                          <Typography fontWeight="bold">{course.title}</Typography>

                          <Typography sx={{ fontSize: '13px', mt: 1 }}>
                            {course.description?.slice(0, 80)}...
                          </Typography>

                          <Typography sx={{ fontSize: '12px', mt: 1, color: '#f5f5f5' }}>
                            🕒{" "}
                            {Array.isArray(course.timing)
                              ? course.timing
                                  .map((slot) => `${slot.date} ${slot.time}`)
                                  .join(" | ")
                              : "No schedule"}
                          </Typography>

                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              mt: 2,
                              backgroundColor: "#670D2F",
                              borderRadius: 999,
                              fontWeight: "bold",
                              textTransform: "none",
                              px: 3,
                              py: 1,
                              fontSize: "14px",
                            }}
                            endIcon={<ChevronRight size={16} />}
                            component={Link}
                            to={`/booking-details/${course._id}`}
                          >
                            Book Now
                          </Button>
                        </CardContent>
                      </Card>
                    </Box>
                  </Grid>
                ))}
            </Grid>
          </Box>
        )}

        {/* Centered Alert Dialog (blurred backdrop, 20px radius) */}
        <Dialog
          open={openAlert}
          onClose={() => setOpenAlert(false)}
          BackdropProps={{
            sx: {
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              backgroundColor: 'rgba(0,0,0,0.25)',
            },
          }}
          PaperProps={{
            sx: {
              borderRadius: '20px',
              bgcolor: 'rgba(255,255,255,0.9)',
              backdropFilter: 'blur(6px)',
              WebkitBackdropFilter: 'blur(6px)',
              border: '1px solid rgba(255,255,255,0.5)',
              boxShadow: '0 12px 40px rgba(0,0,0,0.2)',
            },
          }}
        >
          <DialogTitle sx={{ fontWeight: 700, color: '#8d1f58' }}>
            Login required
          </DialogTitle>
          <DialogContent sx={{ pt: 0 }}>
            Please log in to book this course.
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenAlert(false)}>Close</Button>
            <Button
              variant="contained"
              onClick={() => {
                setOpenAlert(false);
                navigate('/login');
              }}
              sx={{ backgroundColor: '#8d1f58', '&:hover': { backgroundColor: '#a5326d' } }}
            >
              Go to Login
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </motion.div>
  );
};

export default BookingDetails;
