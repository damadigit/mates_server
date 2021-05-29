const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const _ = require('lodash')
const {AddressSchema} = require("./schemas");
const MemberJoinRequestSchema = new Schema({
    memberId:String,
    photo: String,
    fullName:String,
    mateId:String,
    name:String,
    fatherName:String,
    gFatherName:String,
    gender: String,
    birthDate: String,
    placeOfBirth: String,
    joinTeam: String,
    currentTeam: String,
    employmentType: {
        type: String,
        enum : ['Casual','Contract','FullTime'],
        default: 'FullTime'
    },
    startDate: Date,
    endDate: Date,
    duration: Number,
    period: String,
    jobTitle: String,
    joinRemark: String,
    extraOT: Number,
    earning: {
        rate: Number,
        period: {
            type: String,
            enum : ['day','week','month'],
            default: 'month'
        },
        additionalEarnings: [{
            type:{type:String},
            name:String,
            value:Number
        }]
    },
    joinType: {
        type: String,
        enum : ['Transfer','ReEmployment','Employment'],
        default: 'Transfer',
        index: true,
    },
    bankAccounts: [{
        type:{type:String},
        value: String
    }],
    address: AddressSchema,
    citizenship: String,
    martialStatus: String,
    requestStatus: {
        type:String,
        enum : ['Pending','Approved','Rejected'],
        default: 'Pending'
    },
    tinNo: String,
    pensionNo:String,
    motherName: String,
    joinLetter: String,
    payrollStatus:  {
        type:String,
        enum : ['Pending','Applied','Avoided'],
        default: 'Pending'
    },
    contractType: {
        type: String,
        enum : ['FixedTerm','Permanent','Piecework'],
        default: 'FixedTerm'
    },
},{    timestamps: true})

const enumerateDaysBetweenDates = function(startDate, endDate) {
    const now = moment(startDate); const dates = []

    while (now.isSameOrBefore(endDate)) {
        dates.push(moment(now))
        now.add(1, 'days')
    }
    return dates
}

MemberJoinRequestSchema.pre('save', async function(next){

    if(this.team)
     {
        this.fullName = `${this.name || ''} ${this.fatherName || ''}`
        const member = {...this.toObject()}
        member.fullName = `${this.name || ''} ${this.fatherName || ''}`
        // console.log(member)
        member.id = this.memberId || this._id
        if (!this.memberId) {
            member.status = "new"
        }

        const startDate = moment.utc(member.startDate || '1990/1/1')
        const endDate = moment.utc(member.endDate)
        const sd = moment.max(startDate, moment(this.startDate).startOf('month'))
        const ed = moment.min(endDate, moment(this.startDate).endOf('month').add(1, 'day'))

        const dates = enumerateDaysBetweenDates(sd, ed)
        const timesheet = []
        dates.map(d => {
            timesheet.push({
                member: _.pick(member, ['id', 'fullName', 'mateId', 'employmentType']),
                code: `${d.format('DD/MM/YY')}$${member.id}`,
                date: d,
                state: d.get('day') !== 0 ? 'present' : 'rest',
                currentTeam: this.team
            })
        })
        //console.log(timesheet)
        await mongoose.model('Timesheet').insertMany(timesheet)
    }
    //
  // //  member.daysWorked = ed.diff(sd,'days') + 1
  //    const month = moment(this.startDate).startOf('month').format('yyyy-MM-DD')
  //       const OrganizeRequest = await mongoose.model('TeamOrganiseRequest').findOne({periodType: 'month', team: this.team, periodStartDate: month})
  //   //console.log(OrganizeRequest)
  //   if(OrganizeRequest)
  //       {
  //           OrganizeRequest.members = [...OrganizeRequest.members, member]
  //           OrganizeRequest.status= "ready";
  //           await OrganizeRequest.save();
  //       }
  //       else {
  //           const members = await mongoose.model('Member').find({currentTeam: this.team}).lean();
  //
  //           const request = {status:"ready", periodType: 'month', team: this.team, periodStartDate: month, members:[...members.map(m=>({...m,id:m._id, fullName:`${m.name||''} ${m.fatherName||''}`})),member]}
  //           await mongoose.model('TeamOrganiseRequest').create(request)
  //
  //
  //       }




    next()
})


module.exports = mongoose.model('MemberJoinRequest', MemberJoinRequestSchema);
