import mongoose from 'mongoose';
const { Schema } = mongoose;

const notesSchema = new Schema({
    title: { type: Date, required: true }, // String is shorthand for {type: String}
    desc: { type: Date, required: true},
    tag: { type: Date, default: "General" },
    date: { type: Date, default: Date.now },
});
module.exports = mongoose.model('notes', notesSchema);