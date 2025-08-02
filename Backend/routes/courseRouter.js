const express = require('express');
const router = express.Router();
const { userAuth, verifyAdmin } = require('../middleware/userAuth');
const upload = require('../middleware/upload');
const {
  getAllCourses,
  getSingleCourse,
    createCourse,
    updateCourse,
  deleteCourse,
  searchCourses
} = require('../controller/courseController');


router.get('/courses', getAllCourses);
router.get('/courses/:id', getSingleCourse);
router.get('/search', searchCourses);

router.post('/courses', userAuth, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), createCourse);
router.put('/courses/:id', userAuth, verifyAdmin, upload.fields([
  { name: 'image', maxCount: 1 },
  { name: 'video', maxCount: 1 }
]), updateCourse);
router.delete('/courses/:id', userAuth, verifyAdmin, deleteCourse);

module.exports = router;

