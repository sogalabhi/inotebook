const express = require("express");
const User = require("../models/User")
var jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');

const router = express.Router();

router.post('/createuser', [
    body('name').isLength({ min: 3 }),
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: "Duplicate email" });
    }

    const saltRounds = 10;
    const myPlaintextPassword = req.body.password;

    bcrypt.genSalt(saltRounds, function (err, salt) {
        bcrypt.hash(myPlaintextPassword, salt, async function (err, hash) {
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            })
            var data = {
                user: { id: user.id }
            }
            var token = jwt.sign(data, 'shhhhh');

            res.json({ token })
        });
    });

})
router.post('/login', [
    body('email').isEmail(),
    body('password').isLength({ min: 5 }),
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
    }
    
    const match = await bcrypt.compare(password, user.password);
    if(!match){
        return res.status(400).json({ error: "Invalid credentials" });
    }
    var data = {
        user: { id: user.id }
    }
    var token = jwt.sign(data, 'shhhhh');

    res.json({ token })
    } catch (error) {
        return res.status(400).json({ error: "internal server error" });
    }

})

module.exports = router;