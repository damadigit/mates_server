

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {EducationSchema, FamilySchema,StorySchema,PlaceSchema} = require('./schemas.js')









const ApplicationSchema = new Schema({
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
    photo: String,
    currentEducation: EducationSchema,
    previousEducations: [EducationSchema],
    families: [FamilySchema],
    place: PlaceSchema,
    story: StorySchema,
    date: Date,
    status: {
        type: String,
        enum: ['Pending', 'Waiting', 'Rejected', 'Accepted'],
        default: 'Pending'
    },
    processedBy: String,
    createdDate: {
        type: Date,
        default: Date.now
    }






});

// ApplicationSchema.

module.exports = mongoose.model('Application', ApplicationSchema);
