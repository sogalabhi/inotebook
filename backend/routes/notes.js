const express = require("express");
const Note = require("../models/Notes")
const { body, validationResult } = require('express-validator');
const fetchuser = require("../middleware/fetchuser");
const Notes = require("../models/Notes");

const router = express.Router();

//Create a note
router.post('/createnote', [
    body('title').isLength({ min: 3 }),
    body('desc').isLength({ min: 5 }),
    body('desc').isLength({ min: 1 }),
], fetchuser, async (req, res) => {
    try {
        let user = req.user.id;
        let { title, desc, tag } = req.body;
        const note = new Note({
            title,
            desc,
            tag,
            user
        })
        const saveNote = await note.save();
        res.json({ saveNote })
    } catch (error) {
        res.status(500).send({ error })
    }
})

//Read all notes
router.get('/allnotes', fetchuser, async (req, res) => {
    try {
        let user = req.user.id;
        const notes = await Notes.find({ user });
        res.json(notes);
    } catch (error) {
        res.status(500).send({ error })
    }
})

//Update a note
router.put('/updatenote/:id', fetchuser, async (req, res) => {
    try {
        let user = req.user.id;
        let { title, desc, tag } = req.body;
        let newNote = {}
        if (title) { newNote.title = title }
        if (desc) { newNote.desc = desc }
        if (tag) { newNote.tag = tag }

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Note not found") }

        if (note.user.toString() !== user) {
            return res.status(401).send("not allowed")
        }

        note = await Note.findByIdAndUpdate(req.params.id, { $set: newNote }, { new: true });
        res.send({note});
    } catch (error) {
        res.status(500).send({ error })
    }
})

//Delete a note
router.delete('/deletenote/:id', fetchuser, async (req, res) => {
    try {
        let user = req.user.id;

        let note = await Notes.findById(req.params.id);
        if (!note) { return res.status(404).send("Note not found") }

        if (note.user.toString() !== user) {
            return res.status(401).send("not allowed")
        }

        note = await Note.findByIdAndDelete(req.params.id);
        res.send({note});
    } catch (error) {
        res.status(500).send({ error })
    }
})

module.exports = router;