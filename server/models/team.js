const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
    code: String,
    name: String,
    benefits: {
        transportAllowance: Boolean,
        extraOTAllowance: Boolean,
    },
    tikService: Boolean,
    status: {
        type: String,
        enum : ['Active','Dissolved','Hold'],
        default: 'Active'
    },
})
module.exports = mongoose.model('Team', TeamSchema);
