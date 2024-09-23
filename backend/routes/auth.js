const express = require("express");
const User = require("../models/User")
const router = express.Router();
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

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

            res.json({token})
        });
    });

})

module.exports = router;