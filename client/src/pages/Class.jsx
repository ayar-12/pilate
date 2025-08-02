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

const fullSection = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.25, 0.1, 0.25, 1],
    },
  },
};

const staggerContainer = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemMotion = {
  hidden: { opacity: 0, y: 20, scale: 0.98 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};


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
    const cleanPath = file.replace(/^uploads\/images\//, '');
  return `${backendUrl}/uploads/images/${cleanPath}`;
  };
  
  useEffect(() => {
  if (courses && courses.length > 0) {
    setLoading(false);
  }
}, [courses]);


  if (!courses || !Array.isArray(courses)) {
    return (
      <Box sx={{ minHeight: "100vh", py: 6, mt: 6 }}>
        <Typography variant="h6" color="textSecondary" textAlign="center">
          Loading courses...
        </Typography>
      </Box>
    );
  }

const getMediaUrl = (file) => {
  if (!file) return '';
  if (file.startsWith('http')) return file;

  const ext = file.split('.').pop().toLowerCase();
  const type = ['mp4', 'mov', 'webm', 'png', 'jpeg'].includes(ext) ? 'videos' : 'images';
  const cleanPath = file.replace(/^uploads\/(images|videos)\//, '');
  return `${backendUrl}/uploads/${type}/${cleanPath}`;
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

<motion.div
  initial={{ opacity: 0, y: 50 }}
  whileInView={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.6, ease: 'easeOut' }}
  viewport={{ once: false, amount: 0.3 }}
>
    <Box sx={{ minHeight: "100vh", py:6, padding: { xs: 1, sm: 1, md: 1 },}}>


<motion.div
  variants={staggerContainer}
  initial="hidden"
  whileInView="show"
  viewport={{ once: false, amount: 0.3 }}
>
<Box
  sx={{
    position: 'relative',
    height: '400px',
    mx: 2.5,
    mt: 0,
    borderRadius: '16px',
    overflow: 'hidden',
    backgroundPosition: 'center',
    boxShadow: '0 10px 30px rgba(0, 0, 0, 0.18)',
    backgroundSize: 'cover',

  }}
>

  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(247, 207, 216, 0.25)', 
      backdropFilter: 'blur(12px)', 

      zIndex: 1,
    }}
  />

  <Box
    sx={{
      position: 'relative',
      zIndex: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      height: '100%',
      px: { xs: 2, sm: 3, md: 4 }

    }}
  >
 
    <Box sx={{ maxWidth: '500px' }}>

    <Box
  sx={{
    display: 'inline-block',
    px: 2,
    py: 1,
    backgroundColor: '#670D2F',
    color: '#cbc9cb',
    borderRadius: '20px',
    fontSize: '14px',
    mb: 13,
    backdropFilter: 'blur(4px)',
  }}
>
  {classData?.span || 'Join Us Today'}
</Box>


   <Typography      mb='3' text-shadow= '1px 1px 2px rgba(0, 0, 0, 0.05)' fontFamily='Poppins' size='lg' color='#8d1f58' fontSize='40px' fontWeight='bold' >
         {classData?.headTitle || 'Achieve balance in mind, body, and soul.'} 
      </Typography>
      <Typography
        sx={{
          color: '#393E46',
          fontSize: '14px',
          mb: 3,
        }}
      >
      {classData?.subHeadTitle || '' }
      </Typography>
    </Box>

    {courses.length > 0 && (
      
  <Card
    sx={{
      position: 'relative',
      width: '100%',
      height: { xs: 240, sm: 300, md: 360 },
      borderRadius: '16px',
      overflow: 'hidden',
      cursor: 'pointer',
      boxShadow: '0 12px 32px rgba(0, 0, 0, 0.21)',
      '&:hover .arrow-icon': {
        opacity: 1,
      },
    }}
  >
    <CardMedia
      component="img"
      image={getImageUrl(courses[0].image)}
      alt={courses[0].title}
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
          Newest Class
        </Typography>

        <Typography variant="h6" fontWeight="bold" sx={{fontFamily: 'Magical Childhood, cursive', fontSize: '14px'}}>
          {courses[0].title}
        </Typography>

        <Typography sx={{ fontSize: '13px', mt: 1 }}>
          {courses[0].description?.slice(0, 100)}...
        </Typography>

        <Typography sx={{ fontSize: '12px', mt: 1, color: '#f5f5f5' }}>
          🕒{" "}
          {Array.isArray(courses[0].timing)
            ? courses[0].timing.map((slot) => `${slot.date} ${slot.time}`).join(" | ")
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
</motion.div>



      <Grid container spacing={3} sx={{ px: 2.5, mt: 4 }} alignItems="stretch">

      {classData && (
  <Grid item xs={12} md={4}>
    <Card
      sx={{
         position: 'relative',
      width: '100%',
      height: { xs: 240, sm: 300, md: 360 },
        borderRadius: '16px',
        overflow: 'hidden',
        cursor: 'pointer',
        '&:hover .arrow-icon': {
          opacity: 1,
        },
      }}
    >

{classData?.video && (
  <video
  src={getMediaUrl(classData.video, 'videos')}

    autoPlay
    muted
    loop
    playsInline
    style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: 0,
    }}
    onError={() => console.error("Video failed to load")}
  />
)}

      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.4), rgba(0,0,0,0.15))',
          backdropFilter: 'blur(2px)',
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <IconButton
          sx={{
  position: 'absolute',
  top: 12,
  left: 12,
  zIndex: 10,
  backgroundColor: 'rgba(255,255,255,0.2)',
  backdropFilter: 'blur(6px)',
}}
          >
            <Play size={20} />
          </IconButton>
          <ArrowUpRight
            className="arrow-icon"
            size={24}
            style={{
              opacity: 0,
              transition: 'opacity 0.3s',
            }}
          />
        </Box>

        <Box>
          <Box
            sx={{
              display: 'inline-block',
              fontSize: '12px',
              color: 'rgba(255, 255, 255, 0.8)',
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              px: 1.5,
              py: 0.5,
              borderRadius: '20px',
              backdropFilter: 'blur(4px)',
              mb: 2,
            }}
          >
            View video
          </Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 'bold',
              lineHeight: 1.7,
              fontFamily: 'Magical Childhood, cursive',
            }}
          >
    {classData.title}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  </Grid>
      )}
      
   {classData?.image && (
  <Grid item xs={12} md={4}>
    <Card
      sx={{
        position: 'relative',
      width: '115%',
      height: { xs: 240, sm: 300, md: 360 },
        borderRadius: '16px',
        overflow: 'hidden',
        backgroundImage: `url(${getImageUrl(classData.image) })`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to top, rgba(0,0,0,0.3), transparent)',
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
          justifyContent: 'flex-end',
          color: 'white',
        }}
      >
        <Typography variant="h6" fontWeight="bold" sx={{ fontFamily: 'Magical Childhood, cursive' }}>
          {classData.subTitle}
        </Typography>
      </CardContent>
    </Card>
    
  </Grid>
)}

        <Grid item xs={12} md={4}>
        <Card
  sx={{
    position: 'relative',
    marginLeft: { xs: 0, sm: 5, md: 6.5 },
      width: '109%',
      height: { xs: 240, sm: 300, md: 360 },
    borderRadius: '24px',
    overflow: 'hidden',
    background: '#670D2F',
    backdropFilter: 'blur(16px)',
    WebkitBackdropFilter: 'blur(16px)',
    boxShadow: '0 12px 32px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255,255,255,0.2)',
    p: 3,
  }}
>
  <CardContent
    sx={{
      position: 'relative',
      zIndex: 2,
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      color: '#111827',
    }}
  >
    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
      <ArrowUpRight size={22} color="#f0f0f0ff" />
    </Box>

    <Box
  sx={{
    position: 'absolute',
    top: '16px',
    left: '16px',
    fontSize: '12px',
    color: '#670D2F',
    backgroundColor: 'rgba(255, 255, 255, 0.89)',
    px: 1.5,
    py: 0.6,
    borderRadius: '999px',
    backdropFilter: 'blur(4px)',
    fontWeight: 500,
    boxShadow: '0 2px 6px rgba(0,0,0,0.05)',
    zIndex: 3,
  }}
>
  {new Date().toLocaleDateString('en-US', { weekday: 'long' })}
</Box>


    <Box>
      <Typography
        variant="h5"
        sx={{
          fontWeight: 700,
          mb: 1.5,
          lineHeight: 1.4,
          fontFamily: 'Playfair Display',
          color: '#e9e2e5ff',
        }}
      >
        {quote}
      </Typography>

      <Typography
        variant="body2"
        sx={{ color: '#e8dfe3ff', mb: 2 }}
      >
          {action}
      </Typography>
    </Box>
  </CardContent>
</Card>


</Grid>

      </Grid>


<br />

<Box sx={{textAlign: 'center',  padding: 5, }}>
  
       <Typography variant="h4" sx={{ fontFamily: 'Poppins' , fontWeight: 'bold', color: '#670D2F', textAlign: 'center', mb: 1 }}>
  Book Your Session Now ✨
</Typography>
<Typography variant="body2" sx={{ textAlign: 'center', fontStyle: 'italic' }}>
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
</motion.div>

  
  );
};

export default Class;