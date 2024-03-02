const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const {MemberSchema} = require('./schemas.js')
const MemberUpdateRequestSchema = new Schema({

    member: MemberSchema,
    memberId: String,
    fullName:String,
    salary: Number,
    jobTitle: String,
    remark: String,
    contractEndDate: Date,
    adjustmentPercent: Number,
    updateTypes: [String],
    additionalEarnings: [{
        type:{type:String},
        name:String,
        value:Number
    }],
    updateEmploymentLetter: String,
    requestStatus: {
        type:String,
        enum : ['Pending','Approved','Rejected'],
        default: 'Pending'
    },
    payrollStatus:  {
        type:String,
        enum : ['Pending','Applied','Avoided'],
        default: 'Pending'
    },
    approvedOn: Date,
    approvedBy: String,
    createdBy : String,
    effectiveDate: {
        type: Date,
        default: new Date()
    }

   },{timestamps:true})





// const MemberLeftRequestSchema = new Schema({
//     memberId:String,
//     fullName:String,
//     mateId:String,
//     endDate: Date,
//     remark: String,
//     team: String,
//    })


// MemberLeftRequestSchema.pre('save', async function(next){
//      const month = moment.utc(this.endDate).startOf('month').format('yyyy-MM-DD')
//         const OrganizeRequest = await mongoose.model('TeamOrganiseRequest').findOne({periodType: 'month', team: this.team, periodStartDate: month})
//     //console.log(OrganizeRequest)
//     if(OrganizeRequest)
//         {
//             // console.log(this.memberId,OrganizeRequest.members)
//             // console.log(OrganizeRequest.members.length)
//             // console.log(this.memberId,OrganizeRequest.members)
//             const member  = OrganizeRequest.members.find(m=>m.id===this.memberId)
//             member.left = this._id;
//             member.status = 'removed'
//             member.endDate = this.endDate
//          const startDate = moment.utc(member.startDate||'1990/1/1')
//             const endDate = moment.utc(member.endDate)
//             const sd = moment.max(startDate,moment(this.endDate).startOf('month'))
//             const ed = moment.min(endDate,moment(this.endDate).endOf('month'))
//
//             member.daysWorked = ed.diff(sd,'days') + 2
//             //console.log(member.daysWorked, endDate)
//             OrganizeRequest.status= "ready";
//             await OrganizeRequest.save();
//         }
//         else {
//             const members = await mongoose.model('Member').find({currentTeam: this.team}).lean();
//
//             const request = {status:"ready", periodType: 'month', team: this.team, periodStartDate: month, members:members.filter(m=>m.id !== this.memberId)}
//             await mongoose.model('TeamOrganiseRequest').create(request)
//
//
//         }
//
//
//
//
//     next()
// })


module.exports = mongoose.model('MemberUpdateRequest', MemberUpdateRequestSchema);
