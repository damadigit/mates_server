const mongoose = require('mongoose');
const {AbsenceRecordSchema} = require("./schemas");
const Schema = mongoose.Schema;

const AbsenceReportSchema = new Schema({
    currentTeam: String,
    modifiedDate: Date,
    createdDate: Date,
    approvedDate: Date,
    submittedDate: Date,
    status: {
        type: String,
        enum : ['onProgress','ready','approved'],
        default: 'onProgress'
    },
    submittedBy: String,
    approvedBy:String,


    // period: {
    //     startDate: Date, // 1/12/2020
    //     endDate: Date,
    //     periodType: String, // Month
    // },
    startDate: Date, // 1/12/2020
    endDate: Date,
    periodType: String, // Month
    records: [AbsenceRecordSchema]


})
module.exports = mongoose.model('AbsenceReport', AbsenceReportSchema);
