import React, { useEffect, useContext, useState } from "react";

import {
  Box,
  Grid,
  Typography,
  Button,
  Card,
  CardMedia,
  CardContent,
  IconButton,
Skeleton
} from "@mui/material";
import { motion } from 'framer-motion';
import { ChevronRight, Play, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";





const Class = () => {
  const { backendUrl, courses , classData} = useContext(AppContext);
const [loading, setLoading] = useState('true')



  const dailyQuotes = [
    "Move to feel, not to fix.",
    "Strong looks good on you.",
    "Breathe. Flow. Grow.",
    "This 20 minutes is just for you.",
    "Show up. The magic is in the showing up.",
    "Your energy creates your shape.",
    "Let the sweat wash the stress.",
  ];
  
  const dailyActions = [
    "Stretch for 10 minutes after your morning coffee.",
    "Do 20 bodyweight squats before your shower.",
    "Try a 15-min breath + flow yoga on YouTube.",
    "Put on your playlist and move for one song.",
    "Write down your top 3 fitness goals.",
    "Walk outside for 20 mins—no phone, just you.",
    "Hydrate and journal after your movement.",
  ];
  



const getImageUrl = (file) => {
  if (!file) return '';
  if (file.startsWith('http')) return file;

  // Remove leading "uploads/" if it exists to prevent double "/uploads/uploads/"
  const cleanedPath = file.replace(/^uploads\//, '');
  return `${backendUrl}/uploads/${cleanedPath}`;
};

  useEffect(() => {
  if (courses && courses.length > 0) {
    setLoading(false);
  }
}, [courses]);


  if (!courses || !Array.isArray(courses)) {
    return (
    <Box sx={{ minHeight: "60vh", display: "grid", placeItems: "center" }}>
        <Typography color="text.secondary">Loading courses…</Typography>
      </Box>
    );
  }

const getMediaUrl = (file) => {
  if (!file) return '';
  if (file.startsWith('http')) return file;

  const ext = file.split('.').pop().toLowerCase();
  const type = ['mp4', 'mov', 'webm'].includes(ext) ? 'videos' : 'images';
  const cleanedFile = file.replace(/^uploads\/(images|videos)\//, '');
  return `${backendUrl}/uploads/${type}/${cleanedFile}`;
};



  const today = new Date().getDay();
  const quote = dailyQuotes[today % dailyQuotes.length];
  const action = dailyActions[today % dailyActions.length];
  
    useEffect(() => {
      console.log("classData in Home.jsx:", classData);
      if (classData?.video) {
        console.log("Video URL:", `${backendUrl}/uploads/videos/${classData.video}`);
      }

    }, [classData, backendUrl]);
    
    useEffect(() => {
      console.log("IMAGE VALUE:", classData?.image);
      console.log("classData object:", classData);
      if (classData?.image) {
        const constructedUrl = getImageUrl(classData.image);
        console.log("Constructed image URL:", constructedUrl);
        console.log("Backend URL:", backendUrl);
      }
    }, [classData]);






  return (

  <Box sx={{ minHeight: "100vh", py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 3 } }}>
    <Box
        sx={{
          position: "relative",
          height: { xs: 280, sm: 360, md: 420 },
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 10px 30px rgba(0,0,0,0.18)",
          mb: { xs: 3, md: 4 },
        }}
      >

     <Box
          sx={{
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(247, 207, 216, 0.25)",
            backdropFilter: "blur(12px)",
            zIndex: 1,
          }}
        />

    <Box
          sx={{
            position: "relative",
            zIndex: 2,
            height: "100%",
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1.1fr 1fr" },
            gap: { xs: 2, md: 3 },
            alignItems: "center",
            px: { xs: 2, sm: 3, md: 4 },
          }}
        >
 
     <Box>
            <Box
              sx={{
                display: "inline-block",
                px: 1.5,
                py: 0.75,
                bgcolor: "#670D2F",
                color: "#cbc9cb",
                borderRadius: "20px",
                fontSize: { xs: 12, sm: 13 },
                mb: { xs: 1.5, md: 2 },
              }}
            >
  {classData?.span || 'Join Us Today'}
</Box>


    <Typography
              sx={{
                color: "#8d1f58",
                fontWeight: 800,
                fontFamily: "Poppins, system-ui, -apple-system, Segoe UI, Roboto",
                fontSize: { xs: 24, sm: 32, md: 40 },
                lineHeight: 1.1,
                mb: 1,
              }}
            >
         {classData?.headTitle || 'Achieve balance in mind, body, and soul.'} 
      </Typography>
            <Typography sx={{ color: "#393E46", fontSize: { xs: 13, sm: 14 } }}>

      {classData?.subHeadTitle || '' }
      </Typography>
    </Box>

    {courses.length > 0 && (
      
<Card
              sx={{
                position: "relative",
                width: "100%",
                height: { xs: 200, sm: 260, md: 320 },
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 12px 32px rgba(0,0,0,0.21)",
              }}
            >
              <CardMedia
                component="img"
                loading="lazy"
                decoding="async"
                image={getImageUrl(courses[0].image)}
                alt={courses[0].title}
                sx={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }}
                onError={(e) => (e.currentTarget.src = "/placeholder-image.png")}
              />

<Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15))",
                }}
              />
              <CardContent
                sx={{
                  position: "relative",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  color: "white",
                }}
              >
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <IconButton
          sx={{
            backgroundColor: 'rgba(255, 255, 255, 0.2)',
            backdropFilter: 'blur(4px)',
            color: 'white',
          }}
        >
          <Play size={20} />
        </IconButton>
        <ArrowUpRight
          className="arrow-icon"
          size={24}
          style={{ opacity: 0, transition: 'opacity 0.3s' }}
        />
      </Box>

   <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      bgcolor: "rgba(255,255,255,.2)",
                      color: "rgba(255,255,255,.9)",
                      px: 1,
                      py: 0.25,
                      borderRadius: "16px",
                      display: "inline-block",
                      mb: 0.75,
                    }}
                  >
          Newest Class
        </Typography>

        <Typography sx={{ fontWeight: 700, fontSize: { xs: 16, sm: 18 } }}>
                    {courses[0].title}
                  </Typography>

                  <Typography sx={{ fontSize: { xs: 11.5, sm: 12.5 }, mt: 0.75 }}>
                    {courses[0].description?.slice(0, 100)}…
                  </Typography>

                  <Typography sx={{ fontSize: 11.5, mt: 0.5, opacity: 0.9 }}>
                    🕒{" "}
                    {Array.isArray(courses[0].timing)
                      ? courses[0].timing.map((s) => `${s.date} ${s.time}`).join(" | ")
                      : "No schedule"}
                  </Typography>

                  <Button
                    variant="contained"
                    size="small"
                    sx={{
                      mt: 1.25,
                      bgcolor: "#670D2F",
                      borderRadius: 999,
                      textTransform: "none",
                      px: 2.25,
                      py: 0.5,
                      fontSize: 13,
                    }}
                    endIcon={<ChevronRight size={16} />}
                    component={Link}
                    to={`/booking-details/${courses[0]._id}`}
                  >
                    Book Now
                  </Button>
                </Box>
              </CardContent>
            </Card>
          )}
        </Box>
      </Box>

  

<Grid container spacing={2.5} alignItems="stretch">
  {/* Video */}
  {classData?.video && (
    <Grid item xs={12} md={3}>
      <Card
        sx={{
          position: 'relative',
          borderRadius: 2.5,
          overflow: 'hidden',
          height: { xs: 260, sm: 300, md: 360 },
          width: '100%',
        }}
      >
        <Box
          component="video"
          src={getMediaUrl(classData.video)}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          sx={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
        />
        <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.4), rgba(0,0,0,.15))' }} />
        <CardContent sx={{ position:'relative', color:'#fff', height:'100%', display:'flex', flexDirection:'column', justifyContent:'flex-end', p:2.5 }}>
          <Box sx={{ display:'inline-flex', alignItems:'center', gap:1, mb:1.25 }}>
            <IconButton size="small" sx={{ bgcolor:'rgba(255,255,255,.25)', color:'#fff' }}>
              <Play size={16} />
            </IconButton>
            <Typography variant="caption" sx={{ bgcolor:'rgba(255,255,255,.2)', px:1, py:.25, borderRadius:999 }}>
              View video
            </Typography>
          </Box>
          <Typography sx={{ fontWeight:700 }}>{classData.title}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )}

  {/* Image */}
  {classData?.image && (
    <Grid item xs={12} md={3}>
      <Card
        sx={{
          position:'relative',
          borderRadius:2.5,
          overflow:'hidden',
          height: { xs: 260, sm: 300, md: 360 },
          width:'100%',
        }}
      >
        <CardMedia
          component="img"
          image={getImageUrl(classData.image)}
          alt={classData?.subTitle || 'Image'}
          loading="lazy"
          decoding="async"
          sx={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover', objectPosition:'center' }}
          onError={(e)=> (e.currentTarget.src='/placeholder-image.png')}
        />
        <Box sx={{ position:'absolute', inset:0, background:'linear-gradient(to top, rgba(0,0,0,.3), transparent)' }} />
        <CardContent sx={{ position:'relative', color:'#fff', height:'100%', display:'flex', alignItems:'flex-end', p:2.5 }}>
          <Typography sx={{ fontWeight:700 }}>{classData.subTitle}</Typography>
        </CardContent>
      </Card>
    </Grid>
  )}

  {/* Quote */}
  <Grid item xs={12} md={6}>
    <Card
      sx={{
        position:'relative',
        borderRadius:3,
        overflow:'hidden',
        height: { xs: 260, sm: 300, md: 360 },
        width:'100%',
        bgcolor:'#670D2F',
        color:'#fff',
      }}
    >
      <CardContent sx={{ height:'100%', display:'flex', flexDirection:'column', justifyContent:'space-between', p:3 }}>
        <Box sx={{ display:'flex', justifyContent:'flex-end' }}>
          <ArrowUpRight size={22} />
        </Box>
        <Box>
          <Typography sx={{ fontWeight:800, lineHeight:1.35, mb:1.25, fontSize:{ xs:22, sm:24, md:26 } }}>
            {quote}
          </Typography>
          <Typography sx={{ opacity:.95, fontSize:{ xs:14, sm:15 } }}>
            {action}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
</Grid>


<br />

      <Box sx={{ textAlign: "center", py: { xs: 3, md: 4 } }}>
        <Typography variant="h5" sx={{ fontWeight: 800, color: "#670D2F" }}>
          Book Your Session Now ✨
        </Typography>
        <Typography variant="body2" sx={{ fontStyle: "italic" }}>
          Let’s move with intention and joy 💖
        </Typography>
      </Box>
 
<Grid container spacing={4} justifyContent="center" alignItems="stretch">


  {courses.length > 0 ? (
    courses.map((course) => {
      const imageUrl = getImageUrl(course.image);

      return (
        <Grid item xs={12} sm={6} md={4} key={course._id} display="flex" justifyContent="center">
          <Box sx={{ width: 400 }}>
            <Card
              sx={{
                position: 'relative',
      width: '100%',
      height: { xs: 240, sm: 300, md: 360 },
                borderRadius: '16px',
                overflow: 'hidden',
              
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <CardMedia
                component="img"
                image={imageUrl}
                alt={course.title}
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  zIndex: 0,
                }}
                onError={(e) => {
                  e.target.src = "/placeholder-image.png";
                }}
              />

              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.45), rgba(0,0,0,0.15))',
                  backdropFilter: 'blur(3px)',
                  zIndex: 1,
                }}
              />

              <CardContent
                sx={{
                  position: 'relative',
                  zIndex: 2,
                  p: 3,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  color: 'white',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <IconButton
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      backdropFilter: 'blur(4px)',
                      color: 'white',
                    }}
                  >
                    <Play size={20} />
                  </IconButton>
                  <ArrowUpRight
                    className="arrow-icon"
                    size={24}
                    style={{ opacity: 0, transition: 'opacity 0.3s' }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      backgroundColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'rgba(255,255,255,0.8)',
                      px: 1.5,
                      py: 0.5,
                      borderRadius: '20px',
                      backdropFilter: 'blur(4px)',
                      display: 'inline-block',
                      mb: 1,
                    }}
                  >
                    View Video
                  </Typography>

                  <Typography variant="h6" fontWeight="bold">
                    {course.title}
                  </Typography>

                 
                  <Typography sx={{ fontSize: '12px', mt: 1, color: '#f5f5f5' }}>
                    🕒{" "}
                    {Array.isArray(course.timing)
                      ? course.timing.map((slot) => `${slot.date} ${slot.time}`).join(" | ")
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
    fontSize: "14px"
  }}
  endIcon={<ChevronRight size={16} />}
  component={Link}
  to={`/booking-details/${course._id}`}
>
  Book Now
</Button>

                </Box>
              </CardContent>
            </Card>
          </Box>
        </Grid>
      );
    })
  ) : (
    <Typography variant="h6" color="textSecondary">
      No courses available at the moment
    </Typography>
  )}
</Grid>


    </Box>


  
  );
};

export default Class;
