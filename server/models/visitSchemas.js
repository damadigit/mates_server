const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const {EducationSchema} = require('./schemas')
const ExpenseSchema = new Schema ( {
    schoolFees: [
        {
            nameOfChild: String,
            school:EducationSchema,
            fee: Number
        }


    ],
    rent: {
        houseType: String,
        remark: String,
        photo: String,
        fee: Number,
    },
    utilityExpenses: [
        {
        name: String,

            remark:String,
            lastFee: Number,
           fee: Number,

            usage: Number
        }

    ],
    foodExpenses: [
        {
            name: String,
            usage: Number,
            unit: String,

            unitPrice: Number,

            fee: Number
        }
    ],
    medicalExpenses: [
        {
            relationship: String,

            name: String,

            fee: Number,

            age: Number,

            remark: String,
            unableToWork: Boolean,

            description: String
        }
    ],
    otherExpenses: [
        {
            description: String,

            name: String,

            fee: Number,
            necessary : Boolean
        }
    ]
})

const FamilyIncomeSchema = new Schema ({
    relationship: String,
    providerName: String,
    work: String,
    workPlace: String,
    description: String,
    income: Number
})

const OtherIncomeSchema = new Schema ({
    description: String,
    remark: String,
    income: Number
})

const AssetSchema = new Schema ({
    type: String,
    description: String,
    isNecessary: Boolean,
    isExpensive: Boolean,
    value: Number,

})
module.exports = {ExpenseSchema, OtherIncomeSchema,FamilyIncomeSchema, AssetSchema}
