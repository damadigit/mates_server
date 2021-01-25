const mongoose = require('mongoose');
const {OvertimeRecordSchema} = require("./schemas");
const Schema = mongoose.Schema;

const OvertimeDetailSchema = new Schema({
    status: {
        type: String,
        enum : ['onProgress','ready','approved'],
        default: 'onProgress'
    },
    currentTeam: String,
    modifiedDate: Date,
    createdDate: Date,
    startDate: Date,
    endDate: Date,
    hrs: Number,
    days: Number,
    type:String,
    startTime: Date,
    endTime: Date,
    description: String,
    member: {
        id: String,
        fullName: String,
        mateId:String,
    },

})


module.exports = mongoose.model('OvertimeDetail', OvertimeDetailSchema);
