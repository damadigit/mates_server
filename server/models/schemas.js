const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const AddressSchema =  new Schema({
    phones: [{
        phoneType:String,
        number:String
    }],
    email: String,
    city: String,
    subcity:String,
    woreda: String,
    houseNumber: String,
    locationText: String,
    remark: String
})
const EducationSchema = new Schema({
    level: String,
    schoolName: String,
    schoolType: String,
    isDistance: Boolean,
    grade: Number,
    yearStart: Number,
    yearEnd: Number,
    active: Boolean,
    distance: String

});


const FamilySchema = new Schema({
    relationship: String,
    name: String,
    fatherName: String,
    gFatherName: String,
    gender: String,
    birthDate: Date,
    health: {
        generalCondition: String,
        remark: String,
        history: [String]
    },
    profession: String,
    isIncomeProvider: Boolean,
    monthlyIncome: Number,
    currentEducation: EducationSchema,
    livingTogether: Boolean,
    address: AddressSchema


})


const SponsorSchema = new Schema({
    name: String,
    fatherName: String,
    gFatherName: String,
    gender: String,
    address: AddressSchema


})

const FileSchema = new Schema({
    filePath: String,
    title: String,
    date: Date,
    description: String

})


const PlaceSchema = new Schema ({
    type: String,
    name: String,
    monthlyCost: Number,
    address: AddressSchema,
    numberOfPeople: String,
    livingConditions: [{
        name: String,
        available: Boolean
    }],
    photos: [FileSchema],
    remark: String,

})

const StorySchema = new Schema ( {
    story: String,
    governmentApproved: String,
    photos: [FileSchema],
    files: [FileSchema]

})

module.exports = {EducationSchema, FamilySchema,PlaceSchema,AddressSchema,StorySchema,SponsorSchema}
