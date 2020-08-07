

const mongoose = require('mongoose');
const {ExpenseSchema, OtherIncomeSchema,FamilyIncomeSchema, AssetSchema} = require('./visitSchemas.js')
const {EducationSchema, FamilySchema,StorySchema,PlaceSchema, SponsorSchema,AddressSchema,FileSchema} = require('./schemas.js')
const Schema = mongoose.Schema;

const VisitSchema = new Schema({
    homeId: String,
    takenBy: [{
        name: String
    }],
    date: Date,
    addressChange: Boolean,
    address: AddressSchema,

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
    place: PlaceSchema,
    story:StorySchema,
    record: { type: Schema.Types.ObjectId, ref: 'Record' }, //benefitiaries // childrens
    registrationId:String,
    families: [FamilySchema],
    expense: ExpenseSchema,
    income: {
        familyIncomes:[FamilyIncomeSchema],
        otherIncomes: [OtherIncomeSchema]
    },
    asset: {
        commonAssets:[String],
        otherAssets:[AssetSchema]
    },
    livingCondition: {
        utilities:[String],
        remark:String,
        photos:[String]
    },
    result: {
        estimatedExpense: Number,
        necessaryExpense: Number,
        estimatedIncome: Number,
        trueIncome: Number,
        expenseRemark : String,
        incomeRemark: String,
        incomeEdited: Number,
        expenseEdited: Number,
        finadoFund: Number,
        totalIncome: Number,
        remainingIncome: Number,
        remainingRemark: Number,

    },
    category: String,
    motivation: String,
    visitPhotos: [FileSchema]
})
module.exports = mongoose.model('Visit', VisitSchema);
