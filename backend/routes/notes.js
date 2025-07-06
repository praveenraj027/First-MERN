const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Notes = require('../models/Notes');
const { body, validationResult } = require('express-validator');


// ROUTE 1: Get all the notes using: Get "/api/auth/getuser". Login required

router.get('/fetchallnotes', fetchuser, async (req, res) => {
    try {
        const notes = await Notes.find({ user: req.user.id })
        res.json(notes)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }

});

// ROUTE 2: Add the notes using: Post "/api/auth/addnotes". Login required

router.post('/addnotes', fetchuser, [
    body('title', "Title should be of more than 3 characters").isLength({ min: 3 }),
    body('description', "Description must be atleast of 5 characters").isLength({ min: 5 }),
], async (req, res) => {
    try {


        const { title, description, tag } = req.body;

        // If there are errors, return Bad request
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const note = new Notes({
            title, description, tag, user: req.user.id
        })
        const savedNotes = await note.save();

        res.json(savedNotes)
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
});



module.exports = router;