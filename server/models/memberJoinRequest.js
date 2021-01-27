const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const MemberJoinRequestSchema = new Schema({
    member: {
        id: String,
        fullName:String,
        mateId:String,
        name:String,
        fatherName:String,
        gFatherName:String,
        currentTeam: String,
        oldTeam: String

    },
    team: String,
    startDate: Date,
    endDate: Date,
    duration: Number,
    period: String,
    jobTitle: String
})

MemberJoinRequestSchema.pre('save', async function(next){
   //  console.log(this)


        const month = moment(this.startDate).startOf('month').format('yyyy-MM-DD')
        const OrganizeRequest = await mongoose.model('TeamOrganiseRequest').findOne({periodType: 'month', team: this.team, periodStartDate: month})
    //console.log(OrganizeRequest)
    if(OrganizeRequest)
        {
            OrganizeRequest.members = [...OrganizeRequest.members, this.member]
            OrganizeRequest.status= "ready";
            await OrganizeRequest.save();
        }
        else {
            const members = await mongoose.model('Member').find({currentTeam: this.team})

            const OR = {status:"ready", periodType: 'month', team: this.team, periodStartDate: month, members:[...members,this.member]}
            await mongoose.model('TeamOrganiseRequest').create(OR)


        }




    next()
})


module.exports = mongoose.model('MemberJoinRequest', MemberJoinRequestSchema);
