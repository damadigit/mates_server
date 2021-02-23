const moment = require("moment");
const _  = require("lodash");
const Router = require('koa-router');

const router = new Router({ prefix: '/api' });
router.get('/', (ctx, next) => {
    ctx.body = 'Hello World!';
});
router.get('/otSummery', async(ctx, res) => {
    //const Model = mongoose.model('OvertimeReport')
    //console.log(ctx.model('OvertimeReport'))
    const {period='month', startDate} = ctx.request.query
    console.log(startDate)
    const date = moment.utc(startDate).toDate()
    const otRecords =  await ctx.model('OvertimeReport').find({periodType:period, startDate: date,$or: [{ status: "ready" }, { status: "approved" }] }).lean().exec()
    console.log(otRecords)
    const absenceRecords =  await ctx.model('AbsenceReport').find({periodType:period, startDate: date,$or: [{ status: "ready" }, { status: "approved" }] }).lean().exec()

    const data = _.flatten(otRecords.map(r => r.records.map(rec => ({ ...rec, id: rec._id, currentTeam: r.currentTeam }))))

    const absenceData = _.flatten(absenceRecords.map(r => r.records.map(rec => ({ ...rec, id: rec._id, currentTeam: r.currentTeam }))))

    //console.log(data)
    const merged = _(data) // start sequence
        .keyBy('id') // create a dictionary of the 1st array
        .merge(_.keyBy(absenceData, 'id')) // create a dictionary of the 2nd array, and merge it to the 1st
        .values() // turn the combined dictionary to array
        .value(); // get the value (array) out of the sequence

    const result = _(merged)
        .groupBy(x => x.member.id)
        .map((record, id) => ({
            id,
            member: record[0].member,
            mateId:record[0].member.mateId,
            leaveDays: _.sumBy(record, 'leaveDays'),
            absentDays: _.sumBy(record,'absentDays'),
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

    const reports =  await ctx.model('TeamOrganiseRequest').find({periodType:period,periodStartDate:startDate,$or: [{ status: "ready" }, { status: "approved" }] }).lean().exec()

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
    const members =  await ctx.model('Member').find().lean().exec()

    ctx.body = members.map(r=>({...r,team:r.currentTeam}))
})

module.exports = router
