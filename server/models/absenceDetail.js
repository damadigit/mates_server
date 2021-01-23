const mongoose = require('mongoose');
const {OvertimeRecordSchema} = require("./schemas");
const Schema = mongoose.Schema;

const AbsenceDetailSchema = new Schema({
    currentTeam: String,
    modifiedDate: Date,
    createdDate: Date,
    startDate: Date,
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
