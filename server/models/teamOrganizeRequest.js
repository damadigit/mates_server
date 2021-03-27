const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamOrganiseRequestSchema = new Schema({
   team: String,
   dateSubmitted: Date,
   dateModified: Date,
   dateCreated: Date,
   submittedBy: String,
   periodType: String,
   periodStartDate: Date,
   periodEndDate: Date,
   status: {
      type: String,
      enum : ['onProgress','ready','approved'],
      default: 'onProgress'
   },
   members: [{
      id:String,
      fullName:String,
      mateId:String,
      name:String,
      fatherName:String,
      gFatherName:String,
      currentTeam: String,
      startDate: Date,
      endDate: Date,
      duration: Number,
      period: String,
      jobTitle: String,
      remark: String,
      extraOT: Number,
      earning: {
         salary: Number,
         wadge: Number,
         benefits: [{
            type:String,
            name:String,
            value:Number
         }]
      },
      employmentType: {
         type: String,
         enum : ['Casual','Contract','FullTime'],
        },
      joinType: {
         type: String,
         enum : ['Transfer','ReEmployment','Employment'],
        },
      daysWorked: Number,
      left: String,
      oldTeam: String


   }]
})
module.exports = mongoose.model('TeamOrganiseRequest', TeamOrganiseRequestSchema);
