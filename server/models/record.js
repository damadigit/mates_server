


const mongoose = require('mongoose');
const {EducationSchema, FamilySchema,StorySchema,PlaceSchema, SponsorSchema,AddressSchema} = require('./schemas.js')
const Schema = mongoose.Schema;



const RecordSchema = new Schema({
    application: { type: Schema.Types.ObjectId, ref: 'Application' },
    registrationId: String,
    homeId: String,
    official: {
        type:Boolean,
        default: true
    },
    name: String,
    photo: String,
    fatherName: String,
    gFatherName: String,
    gender: String,
    birthDate: Date,
    placeOfBirth: String,
    address: AddressSchema,
    health: {
        generalCondition: String,
        remark: String,
        history: [String]
    },
    currentEducation: EducationSchema,
    previousEducations: [EducationSchema],
    families: [FamilySchema],
    place: PlaceSchema,
    story: StorySchema,
    date: Date,
    status: String,
    processedBy: String,
    sponsor:SponsorSchema,
    createdDate: {
        type: Date,
        default: Date.now
    }


});


RecordSchema.pre('save', async function(next){
   // console.log(this)
    this.homeId = this.registrationId
   if(this.application) {
       const Application = await mongoose.model('Application').findById(this.application);
       Application.status= "Accepted";
       await Application.save();

   }
   next()
})

module.exports = mongoose.model('Record', RecordSchema);
