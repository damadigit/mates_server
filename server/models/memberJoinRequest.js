const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const MemberJoinRequestSchema = new Schema({
    memberId:String,
    fullName:String,
    mateId:String,
    name:String,
    fatherName:String,
    gFatherName:String,
    team: String,
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
    joinType: {
        type: String,
        enum : ['Transfer','ReEmployment','Employment'],
        default: 'Transfer'
    }
})

MemberJoinRequestSchema.pre('save', async function(next){

    this.fullName = `${this.name||''} ${this.fatherName||''}`
    const member = {...this.toObject()}
   member.fullName = `${this.name||''} ${this.fatherName||''}`
   // console.log(member)
    member.id = this.memberId || this._id

    const startDate = moment.utc(member.startDate||'1990/1/1')
    const endDate = moment.utc(member.endDate)
    const sd = moment.max(startDate,moment(this.startDate).startOf('month'))
    const ed = moment.min(endDate,moment(this.startDate).endOf('month'))

    member.daysWorked = ed.diff(sd,'days') + 2
     const month = moment(this.startDate).startOf('month').format('yyyy-MM-DD')
        const OrganizeRequest = await mongoose.model('TeamOrganiseRequest').findOne({periodType: 'month', team: this.team, periodStartDate: month})
    //console.log(OrganizeRequest)
    if(OrganizeRequest)
        {
            OrganizeRequest.members = [...OrganizeRequest.members, member]
            OrganizeRequest.status= "ready";
            await OrganizeRequest.save();
        }
        else {
            const members = await mongoose.model('Member').find({currentTeam: this.team}).lean();

            const request = {status:"ready", periodType: 'month', team: this.team, periodStartDate: month, members:[...members.map(m=>({...m,id:m._id, fullName:`${m.name||''} ${m.fatherName||''}`})),member]}
            await mongoose.model('TeamOrganiseRequest').create(request)


        }




    next()
})


module.exports = mongoose.model('MemberJoinRequest', MemberJoinRequestSchema);
