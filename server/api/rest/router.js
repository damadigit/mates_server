

const moment = require("moment");
const _  = require("lodash");
const Router = require('koa-router');
const {getFinalHours} = require("../tikService");
const {postCatchelMessage} = require("../CatchelApi");

const router = new Router({ prefix: '/api' });

const enumerateDaysBetweenDates = function (startDate, endDate) {
    const now = moment(startDate); const dates = []

    while (now.isSameOrBefore(endDate)) {
        dates.push({date:moment(now),isRest:now.weekday()===0})
        now.add(1, 'days')
    }
    return dates
}


function timesheetGroupedByMemberTeam(timesheets,teams) {
    return _(timesheets)
        .groupBy(x => `${x.member.id}$${x.currentTeam}`)
        .map((r, key) => {
            const records = _.sortBy(r,'date')
            const present = records.filter(r => r.state && (r.state.toLowerCase() === 'present'))
            const presentAndLeave = records.filter(r => r.state && (r.state.toLowerCase() === 'present'||r.state.toLowerCase() === 'leave'))
            let restDays = 0
            if(presentAndLeave&&presentAndLeave.length>2) {
                const startDate = presentAndLeave[0].date
                const endDate = presentAndLeave[presentAndLeave.length -1]&&presentAndLeave[presentAndLeave.length - 1].date

                restDays =  (startDate && endDate && enumerateDaysBetweenDates(startDate,endDate).filter(d=>d.isRest).length)||0
                // if(key.includes("5fe92da7e9803400176992b8")){
                //     console.log("ddd",present,startDate,endDate,restDays)
                // }
            }
            const absentDays = records.filter(r => r.state && r.state.toLowerCase() === 'absent').length
            const leaveDays = records.filter(r => r.state && r.state.toLowerCase() === 'leave').reduce((sum, cv) => sum + (cv.duration ? cv.duration / 8 : 1), 0)
            const presentDays = present.length
            // const restDays = records.filter(r => r.state && (r.state.toLowerCase() === 'rest').length;
            const overtimes = _.mapValues(_.groupBy(records.filter(r => r.overtime&&(r.state && (r.state.toLowerCase() === 'present'))).map(r => r.overtime), 'otType'), ots => _.sumBy(ots, 'hrs'))
            let transportPayableDays = 0
            const team = teams.find(t => t.code === records[0].currentTeam)
            if (team && team.benefits && team.benefits.transportAllowance) {
                const decimalPart = leaveDays - Math.floor(+leaveDays)
                    // const defaultRestDays = 5;
                transportPayableDays += restDays + (presentDays +  Math.ceil(decimalPart))
            }

            return {
                id: records[0].member.id,
                name: records[0].member.fullName,
                member: records[0].member,
                currentTeam: records[0].currentTeam,
                absentDays: absentDays || undefined,
                leaveDays: leaveDays || undefined,
                payableDays: (presentDays + Math.ceil(leaveDays)) || undefined,
                transportPayableDays,
                //  overtimes: _.map(_.groupBy(records.filter(r => r.overtime).map(r => r.overtime), 'otType'), (o, otType) => { return { otType, hrs: _.sumBy(o, 'hrs') } })
                overtimes,
                restDays

            }
        })
        .value()
}
function groupedByMemberTimesheet(timesheets,momentTimesheet, members, teams, days) {
    const otPayableTeams = teams.filter(t=>t.benefits.extraOTAllowance).map(t=>t.code)
   const records =  _(timesheetGroupedByMemberTeam(timesheets, teams))
        .groupBy(x => x.member.id)
        .map((records, memberId) => {
            let overtimes = {}
            const items = records.map(r =>r.overtimes)
            _.each(items, function(item) {
                _.each(['Afterwork', 'Sunday', 'Night', 'HollyDay', 'Other'], function(type) {
                    overtimes[type] = (overtimes[type] || 0) + (item[type] || 0)
                })
            })



            const timesheetAtDate = momentTimesheet.find(t=>t.member.id===records[0].member.id)
         //   const member =  members.find(m=>m._id==records[0].member.id)
           // console.log(members)
            let member = members.find(m=>m.mateId.toString().replace(/\s+/g, '')===records[0].member.mateId.toString().replace(/\s+/g, ''))

            if(!member) {
                console.log(records[0])
                member= {mateId:''}
            }

            else if(member.extraOT) {



               const otPayableDays = records.length>1? _.sumBy(records.filter(r=>otPayableTeams.includes(r.currentTeam)), 'payableDays'):otPayableTeams.includes(records[0].currentTeam)?+days-(records[0].leaveDays||0)-(records[0].absentDays||0):0
                           //const otPayableDays =  _.sumBy(records.filter(r=>otPayableTeams.includes(r.currentTeam), 'payableDays')) //:otPayableTeams.includes(records[0].currentTeam)?moment(startDate).daysInMonth():0
              if(member.extraOT<72) {
                  overtimes.Other = +(member.extraOT * otPayableDays / days).toFixed(2)
              }
              else {
                  overtimes = {Other:+(member.extraOT * otPayableDays / days).toFixed(2)}
              }

            }
            return {
                id: records[0].member.id,
                fullName:member && member.fullName,
                mateId: member.mateId,
                member,
                status: member.status,
                team: timesheetAtDate && timesheetAtDate.currentTeam,
                currentTeam: records.length === 1 && records[0].currentTeam,
                leaveDays: _.sumBy(records, 'leaveDays') || undefined,
                absentDays: _.sumBy(records, 'absentDays') || undefined,
                payableDays: _.sumBy(records, 'payableDays') || undefined,
                transportPayableDays: _.sumBy(records, 'transportPayableDays') || 0,
                overtimes: _.mapValues(overtimes, o => o || undefined),
                //children: records.length>1 && records.map(r=>({...r,name:r.currentTeam, id:r.id+r.currentTeam}))
            }
        })
        .value();

   const ids = records.map(r=>r.id.toString());
   //console.log(ids)
  //  console.log(ids.includes('5fe1ceea3ea8ac275c66fc1e'))
   const idle = members.filter(m=>m.status==="Active"&&!ids.includes(m._id.toString())).map(m=>({
       id: m._id,
       member:m,
       mateId: m.mateId,
       fullName: m.fullName,
       team: 'Idle',
       payableDays: 0,
       overtimes: {}
   }))
    //return idle;
   // const inActive =  members.filter(m=>m.status!=='Active').map(m=>({
   //     id: m._id,
   //     fullName: m.fullName,
   //     mateId: m.mateId,
   //     member:m,
   //     status: 'inActive',
   //     overtimes: {}
   // }))
   return records.concat(idle) //.concat(inActive)

}

router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
});
router.get('/otSummery', async(ctx, res) => {
    //const Model = mongoose.model('OvertimeReport')r
    //console.log(ctx.model('OvertimeReport'))
    const {period='month', startDate} = ctx.request.query
    //console.log(startDate)
    const date = moment.utc(startDate).toDate()
    //console.log(moment.utc(startDate).format('MMMM/DD/yyyy'))
    const filedRecords =  await ctx.model('OvertimeReport').find({periodType:period, startDate: date,$or: [ { status: "approved" }] }).lean().exec()
   const members = await ctx.model('Member').find().exec()
    const withExtraOt = {
        currentTeam: 'Fixed',
        records: members.filter(m => m.extraOT).map(m => {
            return { other: m.extraOT, totalPayHours: m.extraOT, _id: m._id, autoGenerated: true, member: {..._.pick(m, ['id', 'mateId']),fullName: `${m.name} ${m.fatherName}`,} }
        })
    }
    const otRecords = [...filedRecords,withExtraOt]

    //console.log(otRecords)
    const absenceRecords =  await ctx.model('AbsenceReport').find({periodType:period, startDate: date,$or: [ { status: "approved" }] }).lean().exec()

    const data = _.flatten(otRecords.map(r => r.records.map(rec => ({ ...rec, id: rec._id, currentTeam: r.currentTeam }))))

    const absenceData = _.flatten(absenceRecords.map(r => r.records.map(rec => ({ ...rec, id: rec._id, currentTeam: r.currentTeam }))))

    //console.log(data)
    const merged = _(data) // start sequence
        .keyBy('id') // create a dictionary of the 1st array
        .merge(_.keyBy(absenceData, 'id')) // create a dictionary of the 2nd array, and merge it to the 1st
        .values() // turn the combined dictionary to array
        .value(); // get the value (array) out of the sequence

    const teams = await ctx.model('Team').find().exec()
     const  transportAllowableTeams = teams.filter(t => t.benefits && t.benefits.transportAllowance).map(t=>t.code)

    const result = _(merged)
        .groupBy(x => x.member.id)
        .map((record, id) => ({
            id,
            member: record[0].member,
            mateId:record[0].member.mateId,
            leaveDays: _.sumBy(record, 'leaveDays'),
            absentDays: _.sumBy(record,'absentDays'),
            daysWorked: _.sumBy(record, 'daysWorked'),
            transportDays: _.sumBy(record, 'daysWorked') &&_.sumBy(record.filter(r => transportAllowableTeams && transportAllowableTeams.includes(r.currentTeam)), 'daysWorked'),
            ["OT.afterWork"]: _.sumBy(record, 'afterWork'),
            ["OT.sunday"]: _.sumBy(record, 'sunday'),
            ["OT.night"]: _.sumBy(record, 'night'),
            ["OT.hollyDay"]: _.sumBy(record, 'hollyDay'),
            ["OT.other"]: _.sumBy(record, 'other'),
            totalPayHours: _.sumBy(record, 'totalPayHours'),
            children: record.length > 1 ? record : null
        }))
        .value()

    //  console.log(result, 're')
    ctx.body = result

    //ctx.body = otRecords
})

router.get('/teamSummery', async(ctx, res) => {
    //const Model = mongoose.model('OvertimeReport')
    //console.log(ctx.model('OvertimeReport'))
    const {period='month', startDate} = ctx.request.query

    const reports =  await ctx.model('TeamOrganiseRequest').find({periodType:period,periodStartDate:startDate,$or: [ { status: "approved" }] }).lean().exec()

    const data = _.flatten(reports ? reports.map(r => r.members.map(rec => ({ ...rec, requestedTeam: r.team }))) : [])

    const result=  _(data)
        .groupBy(x => x.id)
        .map((record, id) => ({
            id,
            fullName: record[0].fullName,
            mateId: record[0].mateId,
            currentTeam: record[0].currentTeam,
            team: record[0].requestedTeam,
            teamChange: record[0].requestedTeam !== record[0].currentTeam,
            children: record.length > 1 ? record : null
        }))
        .value()

    //  console.log(result, 're')
    ctx.body = result

    //ctx.body = otRecords
})

router.get('/members', async(ctx, res) => {
    const members =  await ctx.model('Member').find({status:'Active'}).lean().exec()
    ctx.body = members.map(r=>({...r,team:r.currentTeam}))
})


router.get('/timesheet',async (ctx,res)=>{
    const {atDate,startDate, endDate} = ctx.request.query



    // const timesheetInPeriod =  ctx.model('Timesheet').find({ date: { $gte: new Date(startDate), $lte:new Date(endDate)} }).exec()
    // const timesheetAtDate =  ctx.model('Timesheet').find({ date: { $gte: moment(new Date(atDate)).startOf('day'), $lte: new moment(new Date(atDate)).endOf('day')} }).exec()
    // const members =  ctx.model('Member').find({status: 'Active'}).select('_id name fatherName gFatherName fullName mateId employmentType').exec();
    // const teams =  ctx.model('Team').find({}).exec()
// console.log(moment(endDate).endOf('day'))
//     console.log(moment(startDate).startOf('day'))
    const calls = [
        ctx.model('Timesheet').find({ date: { $gte: moment(startDate).startOf('day'), $lte:moment(endDate).endOf('day')} }).exec(),
        ctx.model('Timesheet').find({ date: { $gte: moment(atDate).startOf('day'), $lte: new moment(atDate).endOf('day')} }).exec(),
        ctx.model('Member').find({}).select('_id name fatherName gFatherName fullName mateId employmentType extraOT status').exec(),
        ctx.model('Team').find({}).exec()
    ]
    const [timesheetInPeriod,timesheetAtDate,members,teams] = await Promise.all(calls)
    // const {data:hours=[]} = await  getFinalHours({startDate, endDate})
    const hours =[]
   // console.log(hours)
    // const members = await  ctx.model('Timesheet')
    // console.log(timesheetAtDate)
    const groupedTimesheet =  groupedByMemberTimesheet(timesheetInPeriod, timesheetAtDate, members, teams, moment(endDate).diff(moment(startDate),'days')+1 )

    groupedTimesheet.map(m=>{
        const   d = hours.find(h=>h.mateId.toLowerCase()===m.mateId.toLowerCase())
        if (d) {
            // m.hoursWorked = +hour.adustedFullPayHours.toFixed(2)
            m.monthlyHours = +d.fullExpectedHrs.toFixed(2)
            m.actualHoursWorked=+d.workHrs.toFixed(2)
            m.hoursWorked=+(d.adjustedFullPayHours||d.fullPayHours||d.payHrs||0).toFixed(2)

            // m.timeData = hour
        }
        return m
    })
    ctx.body = groupedTimesheet

})

router.get('/payrollMembers',async (ctx,res)=>{

   const newMembers = await ctx.model('MemberJoinRequest').find({requestStatus:'Approved', joinType:{$ne:'Transfer'}, payrollStatus:'Pending'}).exec();
    const inactiveMembers = await ctx.model('MemberLeftRequest').find({requestStatus:'Approved', leftType:'EndEmployment', payrollStatus:'Pending'}).exec();
    ctx.body = {newMembers,inactiveMembers}
})

router.post('/syncIndex', async (ctx,res)=>{
    const {model} = ctx.request.body
   ctx.body = await ctx.model(model).syncIndexes()
})


router.post('/timesheet', async(ctx, res) => {
   const {date,source,team,mateId} = ctx.request.body
    const d = moment(date)
   // console.log(mateId)
    const member = await ctx.model('Member').findOne({mateId}).exec()


    if(member)
    //const teamData = await ctx.model('Team').findOne({where:{code:}})
    {
       // console.log(member)
        const timesheet = {
            member: _.pick(member, ['id', 'fullName', 'mateId', 'employmentType']),
            source: source || 'tik',
            code: `${d.format('DD/MM/YY')}$${member.id}`,
            state: d.get('day') !== 0 ? 'present' : 'rest',
            currentTeam: team,
            date
        }
        await ctx.model('Timesheet').create(timesheet)
        ctx.body = timesheet
    }
    else {
        ctx.throw(404)
    }
})

router.post('/checkContractDateAndNotify', async (ctx,res)=>{
    const {days=3} = ctx.request.body
  //  const days = 5

    const startDate = moment().format('YYYY-MM-DD')
 const endDate  = moment().add(days, 'days').format('YYYY-MM-DD')
    const members =  await ctx.model('Member').find({ endDate: { $gte: startDate, $lte:endDate} })
  if(members.length) {
      const names = members.map(m => m.fullName).join('\r\n')
      const users = await ctx.model('User').find({roles: {$in: ["HRAdmin", "HROfficer"]}}).exec()
      const body = `Contract of ${members.length} members is about to expire in ${days} days
    \`${names}\``
      //console.log(body)
      const messagePromises = users.map(u => {
          const message = {
              to: u.phoneNumber,
              email: u.email,
              body,
              methods: ['TELEGRAM', 'EMAIL'],
              from: "Mates HCM",
              senderEmail:"catchel@truwrk.com",
              subject: 'Contact is about to Expire'
          }
          return postCatchelMessage(message)
      })

      const messageRes = await Promise.all(messagePromises)
      // console.log(messageRes)
      ctx.body = messageRes.map(r => r.data)
  }
  else {
      ctx.body = {message: `No Contact expires in ${days} days`}
  }

})
router.post('/acknowledgePayroll', async (ctx,res)=> {
    const {newMembers,inactiveMembers} = ctx.request.body
    if(newMembers&&newMembers.length)
    {
        const updates = newMembers.map(n=>({
            updateOne:{
                filter: { _id: n._id },
                update: {payrollStatus:n.payrollStatus}
            }
        }))

        await ctx.model('MemberJoinRequest').bulkWrite(updates)

    }

    if(inactiveMembers&&inactiveMembers.length)
    {
        const updates = inactiveMembers.map(n=>({
            updateOne:{
                filter: { _id: n._id },
                update: {payrollStatus:n.payrollStatus}
            }
        }))

        await ctx.model('MemberLeftRequest').bulkWrite(updates)
        const memberUpdate = inactiveMembers.map(n=>({
            updateOne:{
                filter: { _id: n.memberId },
                update: {payrollStatus:n.payrollStatus}
            }
        }))
        await ctx.model('Member').bulkWrite(memberUpdate)
    }

    ctx.body = {status:'done'}

})

    module.exports = router
