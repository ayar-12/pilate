import React from 'react';
import { motion } from 'framer-motion';
import FlowerImage from '../assets/Flowers2.png';
import './home.css';

const Intro = () => {
  return (
    <div className="intro-background">
      <motion.img
        src={FlowerImage}
        alt="flower"
        className="flower-image"
        initial={{ y: '100vh', scale: 1, opacity: 0 }}
        animate={{ y: 0, scale: 1.3, opacity: 1 }}
        exit={{ scale: 3, opacity: 0 }}
        transition={{
          duration: 4,
          ease: [0.4, 0, 0.2, 1],
        }}
      />
    </div>
  );
};

export default Intro;
