// routes/consultation.js
const express = require('express');
const router = express.Router();
const { createConsultation, getAllConsultations } = require('../controller/consultatonController.js');
const { verifyAdmin } = require('../middleware/userAuth.js');

router.post('/new', createConsultation);
router.get('/all', getAllConsultations, verifyAdmin)


module.exports = router;
