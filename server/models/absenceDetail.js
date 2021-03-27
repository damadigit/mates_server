const mongoose = require('mongoose');
const {OvertimeRecordSchema} = require("./schemas");
const Schema = mongoose.Schema;

const AbsenceDetailSchema = new Schema({
    status: {
        type: String,
        enum : ['onProgress','ready','approved'],
        default: 'onProgress'
    },
    currentTeam: {
        type: String,
        index: true
    },
    modifiedDate: Date,
    createdDate: Date,
    startDate: {
        type: Date,
        index: true,
    },
    endDate: Date,
    startTime: Date,
    endTime: Date,
    type: String,
    description: String,
    member: {
        id: String,
        fullName: String,
        mateId:String,
    },

})


module.exports = mongoose.model('AbsenceDetail', AbsenceDetailSchema);
