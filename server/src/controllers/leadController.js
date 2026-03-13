const Lead = require('../models/crm/Lead');
const LeadNote = require('../models/crm/LeadNote');

// @desc    Get all leads
// @route   GET /api/leads
// @access  Private
const getLeads = async (req, res, next) => {
  try {
    const leads = await Lead.find({ company_id: req.user.company_id }).populate(
      'assigned_to',
      'name email'
    );
    res.json(leads);
  } catch (error) {
    next(error);
  }
};

// @desc    Create a lead
// @route   POST /api/leads
// @access  Private
const createLead = async (req, res, next) => {
  try {
    const { name, email, phone, source, status, assigned_to, notes } = req.body;

    const lead = new Lead({
      company_id: req.user.company_id,
      name,
      email,
      phone,
      source,
      status,
      assigned_to: assigned_to || req.user._id,
      notes,
    });

    const createdLead = await lead.save();
    res.status(201).json(createdLead);
  } catch (error) {
    next(error);
  }
};

// @desc    Add note to lead
// @route   POST /api/leads/:id/notes
// @access  Private
const addLeadNote = async (req, res, next) => {
  try {
    const { note } = req.body;
    const lead = await Lead.findById(req.params.id);

    if (lead) {
      const leadNote = new LeadNote({
        lead_id: lead._id,
        user_id: req.user._id,
        note,
      });

      const createdNote = await leadNote.save();
      res.status(201).json(createdNote);
    } else {
      res.status(404);
      throw new Error('Lead not found');
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getLeads,
  createLead,
  addLeadNote,
};
