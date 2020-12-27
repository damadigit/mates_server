const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    code: String,
    name: String
})
module.exports = mongoose.model('Team', TeamSchema);
