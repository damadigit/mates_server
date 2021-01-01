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
    const otRecords =  await ctx.model('OvertimeReport').find({$or: [{ status: "ready" }, { status: "approved" }] }).lean().exec()
    const absenceRecords =  await ctx.model('AbsenceReport').find({$or: [{ status: "ready" }, { status: "approved" }] }).lean().exec()

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

module.exports = router
