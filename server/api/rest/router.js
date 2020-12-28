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

    const data = _.flatten(otRecords.map(r => r.records.map(rec => ({ ...rec, id: rec._id, currentTeam: r.currentTeam }))))
    console.log(data)
    const result = _(data)
        .groupBy(x => x.member.id)
        .map((record, id) => ({
            id,
            member: record[0].member,
            mateId:record[0].member.mateId,
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
