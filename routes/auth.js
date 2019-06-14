const express   = require('express');
const router    = express.Router();
const bcrypt    = require('bcryptjs');
const { check, validationResult } = require('express-validator/check');
const jwt       = require('jsonwebtoken');

const User      = require ('../models/User');

// @route   GET api/auth
// @desc    Get the logged in user
// @access  Private
router.get('/', (req, res) => {
  res.send('Gets the logged in user');
});

// @route   POST api/auth
// @desc    Auth user and get token
// @access  Public
router.post('/', [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter your password').exists()
  ], 
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors
      return res.status(400).json({ errors: errors.array() });
    }

    // No validation erorrs
    const { email, password } = req.body;

    try {
      let user = await User.findOne({ email });

      // User doesn't exist
      if (!user) {
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // User exists, check password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        // Password incorrect
        return res.status(400).json({ msg: 'Invalid credentials' });
      }

      // Password is correct, sign token
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