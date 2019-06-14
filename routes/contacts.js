const express   = require('express');
const router    = express.Router();
const auth      = require('../middleware/auth');
const User      = require ('../models/User');
const Contact   = require ('../models/Contact');
const { check, validationResult } = require('express-validator/check');


// @route   GET api/contacts
// @desc    Get all users contacts
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const contacts = await Contact.find({ user: req.user.id }).sort({ date: -1 });
    res.json(contacts);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST api/contacts
// @desc    Add new contact
// @access  Private
router.post('/', [ auth, [
    check('name', 'Name is required').not().isEmpty()
  ]], 
  async (req, res) => {
  // Validation checks
  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }
  
  // Get data from body
  const { name, email, phone, type } = req.body;

  try {
    // Create a new contact
    const newContact = new Contact({
      name,
      email,
      phone,
      type,
      user: req.user.id
    });
    
    // Save to db
    const contact = await newContact.save();

    res.json(contact);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   PUT api/contacts/:id
// @desc    Update contact
// @access  Private
router.put('/:id', (req, res) => {
  res.send('Update contact');
});

// @route   DELETE api/contacts/:id
// @desc    Delete contact
// @access  Private
router.delete('/:id', (req, res) => {
  res.send('Delete contact');
});

module.exports = router;