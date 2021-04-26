const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TimesheetSchema = new Schema({
    code: {
        type: String,
        unique:true,
        index: true,
    },
    member: {
        id: String,
        fullName: String,
        mateId:String,
        employmentType:String,
    },
    date: {
        type: Date,
        index: true,
    },
    status: {
        type: String,
        enum : ['onProgress','ready','approved'],
        default: 'onProgress'
    },
    currentTeam: String,
    teams:[String],
    state:String, //absent leave work
    remark:String,
    overtime: {
        otType:String,
        hrs: Number,
        description:String
    },
},{    timestamps: true})
module.exports = mongoose.model('Timesheet', TimesheetSchema);
