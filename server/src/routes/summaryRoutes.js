const express = require('express');
const { getSummary } = require('../controllers/summaryController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', protect, getSummary);

module.exports = router;
