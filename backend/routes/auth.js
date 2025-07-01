const express = require('express');
const router = express.Router();
const User = require('../models/User')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');


const JWT_SECRET = "Piyaisperfectinallaspects";


// Create a user using POST "/api/auth/createuser" . Doesn't require auth


router.post('/createuser', [
    body('name', "Enter a valid name").isLength({ min: 3 }),
    body('email', "Enter a valid email").isEmail(),
    body('password', "Enter a valid password").isLength({ min: 5 })
], async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
try{
    let user = await User.findOne({ email: req.body.email });
    if (user) {
        return res.status(400).json({ error: "Sorry a user with this email already exists" })
    }
// Password hashing
const salt = await bcrypt.genSalt(10);
const hashedPassword = await bcrypt.hash(req.body.password, salt);

    user = await User.create({
        name: req.body.name,
        password: hashedPassword,
        email: req.body.email
    });

    const data = {
        user:{
            id: user.id,
        }
    }

const authtoken = jwt.sign(data, JWT_SECRET);
// console.log(authtoken);

    res.json({authtoken})
} catch(error){
    console.error(error.message);
    res.status(500).send("Kuchh toh galat hua hai")
}

});

module.exports = router;