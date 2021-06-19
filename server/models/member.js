


const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {EducationSchema, FamilySchema,AddressSchema} = require('./schemas.js')


const MemberSchema = new Schema({
    mateId: {
        type: String,
        unique:true
    },
    name: String,
    fatherName: String,
    gFatherName: String,
    gender: String,
    birthDate: Date,
    placeOfBirth: String,
    health: {
        generalCondition: String,
        remark: String,
        history: [String]
    },
    photo: String,
    currentEducation: EducationSchema,
    previousEducations: [EducationSchema],
    families: [FamilySchema],
    createdDate: {
        type: Date,
        default: Date.now
    },
    tinNo:String,
    pensionNo:String,
    bankAccounts: [{
        type:{type:String},
        value: String
    }],
    joinTeam: String,
    currentTeam: String,
    employmentType: {
        type: String,
        enum : ['Casual','PartTime','FullTime'],
        index: true,
        default: 'FullTime'
    },
    contractType: {
        type: String,
        enum : ['FixedTerm','Permanent','Piecework'],
        default: 'FixedTerm'
    },
    startDate: Date,
    endDate:Date,
    duration: Number,
    period: String,
    position:String,
    joinRemark: String,
    citizenship:String,
    extraOT: Number,
    leaveInfo: {
        remainingDays:Number,
        daysTaken:Number,
        totalDaysTaken:Number,

    },
    address: AddressSchema,
    jobTitle: String,
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
        default: 'Employment'
    },
    martialStatus: String,
    status: {
        type: String,
        enum : ['Active','Resigned', 'ContractEnded', 'Dismissed','Retired', 'LaidOff'],
        default: 'Active'
    },
    annualLeaveBalance: Number,
    motherName: String,
    joinRequests: [ { type: Schema.Types.ObjectId, ref: 'MemberJoinRequest' }],
    payrollStatus:  {
        type:String,
        enum : ['Pending','Applied','Avoided'],
        default: 'Pending'
    },

}, {timestamps:true});

// ApplicationSchema.

MemberSchema.virtual('fullName').
get(function() { return `${this.name||''} ${this.fatherName||''} ${this.gFatherName||''}`; }).
set(function(v) {
    // `v` is the value being set, so use the value to set
    // `firstName` and `lastName`.
    const nameArray = v.split(' ')
    const name = nameArray.length&&nameArray[0]//v.substring(0, v.indexOf(' '));
    const fatherName = nameArray.length>1&&nameArray[1] //v.substring(v.indexOf(' ') + 1);
    const gFatherName = nameArray.length>2&&nameArray[2] // v.substring(v.indexOf(' ') + 2);
    this.set({ name, fatherName, gFatherName });
});


module.exports = mongoose.model('Member', MemberSchema);
