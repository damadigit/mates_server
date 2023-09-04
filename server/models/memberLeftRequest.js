const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const memberModel = require('./member')
const MemberLeftRequestSchema = new Schema({

    member: memberModel.schema.add({id:String, fullName:String}),
        effectiveDate: Date,
    lastWorkDate: Date,
    noticeDate: Date,
    leaveCompensation: Number,
    remainingLeaveDays: Number,
    serviceYears: Number,
    severancePay: Number,
    reasonType: {
        type: String,
        enum : ['Resigned', 'ContractEnded', 'Dismissed','Retired', 'LaidOff'],
        default: 'ContractEnded'
    },
    leftType: {
        type: String,
        enum : ['Transfer','EndEmployment'],
        default: 'Transfer'
    },
    remark: String,
    reason:String,
    team: String,
    endEmploymentLetter: String,
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


module.exports = mongoose.model('MemberLeftRequest', MemberLeftRequestSchema);
