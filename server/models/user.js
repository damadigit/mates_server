const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    userName: String,
    password: String,
    token: String,
    name:String,
    fatherName:String,
    roles: [String],
    teams: [String]
})
module.exports = mongoose.model('User', UserSchema);
