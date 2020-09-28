const mongoose = require("mongoose")

const TodoSchema = new mongoose.Schema({ title: String, isCompleted: Boolean });
const userSchema = new mongoose.Schema({
    email: {type: String, required: true, unique: true},
    password: {type: String, minlength: 5},
    firstName: {type: String, required: true},
    lastName: {type: String, required: true},
    todo: [TodoSchema]
})

module.exports = User = mongoose.model("user", userSchema);