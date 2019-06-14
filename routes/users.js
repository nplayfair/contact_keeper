const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const jwt       = require('jsonwebtoken');

const User      = require ('../models/User');

// @route   POST api/users
// @desc    Register a user
// @access  Public
router.post('/', 
  [
    check('name', 'Please enter a name.').not().isEmpty(),
    check('email', 'Please include a valid email.').isEmail(),
    check('password', 'Please enter a password with at least 6 characters.').isLength({ min: 6})
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }
    
    // No validation errors
    const { name, email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      if (user) {
        // User already exists
        return res.status(400).json({ msg: 'User already exists.' })
      }

      user = new User({
        name,
        email,
        password
      });

      // Hash password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);

      // Save user to database
      await user.save();

      // Create token
      const payload = {
        user: {
          id: user.id
        }
      }

      jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: 360000
      }, (err, token) => {
        if (err) throw err;
        res.json({ token });
      });

    } catch (err) {
      console.error(err.message);
      res.send(500).send('Server error');
    }

});

module.exports = router;