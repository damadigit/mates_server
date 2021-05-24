const _  = require("lodash");
const getChanges = async (members, ctx) => {
    const activeMembers =  await ctx.model('Members').find({status:'Active'}).lean().exec();
    const mateIds = members.map(m=>m.mateId)
    const newMembers = activeMembers.filter(m=>!mateIds.includes(m.mateId))
    const activeMateIds = activeMembers.map(m=>m.mateId)
    const removedMembers = members.map(m=>!activeMembers.includes(m.mateId))
}

module.exports = {
   getChanges
}
