    const express = require('express');
    const router = express.Router();
    const User = require('../models/User')
    const { body, validationResult } = require('express-validator');
    const bcrypt = require('bcryptjs');
    var jwt = require('jsonwebtoken');
    var fetchuser = require('../middleware/fetchuser')


    const JWT_SECRET = "Piyaisperfectinallaspects";


    // ROUTE 1 Create a user using POST "/api/auth/createuser" . Doesn't require auth


    router.post('/createuser', [
        body('name', "Enter a valid name").isLength({ min: 3 }),
        body('email', "Enter a valid email").isEmail(),
        body('password', "Enter a valid password").isLength({ min: 5 })
    ], async (req, res) => {


        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
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
                user: {
                    id: user.id,
                }
            }

            const authtoken = jwt.sign(data, JWT_SECRET);
            // console.log(authtoken); 

            res.json({ authtoken })
        } catch (error) {
            console.error(error.message);
            res.status(500).send("Kuchh toh galat hua hai")
        }

    });

    //ROUTE 2 Authenticate a user using POST "/api/auth/login" . No login required
    router.post('/login', [
        body('email', 'Enter a valid Email').isEmail(),
        body('password', 'Enter a valid password').isLength({ min: 5 })
    ], async (req, res) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        try {
            let user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ error: "Please enter valid credentials" })
            }
            const passwordCompare = await bcrypt.compare(password, user.password);
            if (!passwordCompare) {
                return res.status(400).json({ error: "Please enter valid credentials" })
            }

            
            const data = {
                user: {
                    id: user.id,
                }
            }
            const authtoken = jwt.sign(data, JWT_SECRET);
            res.json({ authtoken })
        } catch {
            console.error(error.message);
            res.status(500).sent("Internal server error");
        }
    })

    //ROUTE 3 Get logged in user details using POST "/api/auth/getuser" . Login required

    router.post('/getuser', fetchuser, async (req, res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select("-password");
        res.send(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal server error");
    }
    })

    module.exports = router;