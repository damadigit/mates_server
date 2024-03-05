


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//const {EducationSchema,FamilySchema,AddressSchema} = require('./schemas.js')
const {MemberSchema : Ms} = require('./schemas.js')

const MemberSchema = new Schema (Ms)

// ApplicationSchema.

MemberSchema.virtual('fullName').
get(function() { return `${this.name||''} ${this.fatherName||''} ${this.gFatherName||''}`; }).
set(function(v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const nameArray = v.split(' ')
    const name = nameArray.length&&nameArray[0]//v.substring(0, v.indexOf(' '));
    const fatherName = nameArray.length>=1&&nameArray[1] //v.substring(v.indexOf(' ') + 1);
    const gFatherName = nameArray.length>=2&&nameArray[2] // v.substring(v.indexOf(' ') + 2);
    this.set({ name, fatherName, gFatherName });
});


MemberSchema.pre('save', async function(next){
    this.currentTeam =  this.currentTeam || this.joinTeam
    this.mateId = this.mateId? this.mateId.toLowerCase().replace(/\s+/g, '') : this.mateId
})

module.exports = mongoose.model('Member', MemberSchema);
