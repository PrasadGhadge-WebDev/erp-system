const express = require('express');
const router = express.Router();
const { getLeads, createLead, addLeadNote, getLeadNotes } = require('../controllers/leadController');
const { protect } = require('../middlewares/authMiddleware');

router.route('/').get(protect, getLeads).post(protect, createLead);
router.route('/notes').get(protect, getLeadNotes);
router.route('/:id/notes').post(protect, addLeadNote);

module.exports = router;
