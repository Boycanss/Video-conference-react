const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//Membuat schema
const StreamSchema = new Schema({
    host: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const Stream = mongoose.model("streams", StreamSchema);

module.exports = Stream