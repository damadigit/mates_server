


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
    bankAccount: {
        bankName:String,
        accountNumber:String
    },
    currentTeam: String,
    employmentType: String,
    startDate: Date,
    endDate:Date,
    duration: Number,
    period: String,
    position:String,
    citizenShip:String,
    extraOT: Number,
    leaveInfo: {
        remainingDays:Number,
        daysTaken:Number,
        totalDaysTaken:Number,

    },
    Address: AddressSchema,
    jobTitle: String,
    earning: {
        salary: Number,
        wadge: Number,
        benefits: [{
            benefitType:String,
            name:String,
            value:Number
        }]
    },
    joinType: {
        type: String,
        enum : ['Transfer','ReEmployment','Employment'],
        default: 'Transfer'
    },

    status: {
        type: String,
        enum : ['Active','Terminated','Retired', 'Laid Off'],
        default: 'Active'
    },








});

// ApplicationSchema.

module.exports = mongoose.model('Member', MemberSchema);
