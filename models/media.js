const mongoose = require("mongoose");

const picture = new mongoose.Schema({
    username: String,
    avatar: String,
});

module.exports = mongoose.model("picture", picture);