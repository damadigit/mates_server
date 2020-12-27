const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamOrganiseRequestSchema = new Schema({
   team: String,
   dateSubmitted: Date,
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
      id: String,
      fullName:String,
      mateId:String,
      name:String,
      fatherName:String,
      gFatherName:String,
      currentTeam: String

   }]
})
module.exports = mongoose.model('TeamOrganiseRequest', TeamOrganiseRequestSchema);
