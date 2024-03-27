
const mongoose = require('mongoose');
const _ = require('lodash')
const { schemaComposer, toInputObjectType } = require('graphql-compose');
 const buildSchema  = require('./mongooseQL')

const {ModelTC:MemberModelTC} = buildSchema('Member',schemaComposer)
const {ModelTC:TeamModelTC} = buildSchema('Team',schemaComposer)
const  {ModelTC:UserModelTC} = buildSchema('User',schemaComposer)
 buildSchema('OvertimeReport',schemaComposer)
buildSchema('AbsenceReport',schemaComposer)
buildSchema('TeamOrganiseRequest',schemaComposer)
buildSchema('Template',schemaComposer)


const {ModelTC:MemberJoinRequestTC} = buildSchema('MemberJoinRequest',schemaComposer)
const {ModelTC:MemberLeftRequestTC} = buildSchema('MemberLeftRequest',schemaComposer)
const {ModelTC:MemberUpdateRequestTC} = buildSchema('MemberUpdateRequest',schemaComposer)
const {ModelTC:OvertimeDetailModelTC} = buildSchema('OvertimeDetail',schemaComposer)
buildSchema('AbsenceDetail',schemaComposer)

const  {ModelTC:TimesheetModelTC}  = buildSchema('Timesheet',schemaComposer)
MemberModelTC.addFields( {
     fullName:'String',
         // { // set `id` name for new field
         //  type: 'String', // set type MongoID
         //  resolve: (source) => `${source.name||''} ${source.fatherName||''}`, // write resolve method, which returns _id value for the current field
         //  projection: { name: true, fatherName: true }, // add information, that need to reques _id field from database, when you request `id` field
         // },
     age:
         { // set `id` name for new field
          type: 'Int', // set type MongoID
          resolve: (source) => new Date().getFullYear() - new Date(source.birthDate).getFullYear(), // write resolve method, which returns _id value for the current field
          projection: { birthDate: true }, // add information, that need to reques _id field from database, when you request `id` field
         }

    }

);



TeamModelTC.setResolver('findMany', TeamModelTC.getResolver('findMany')
    .addFilterArg({
        name: 'codesIn',
        type: '[String]',
        query: (query, value, resolveParams) => {

            query.code = {$in:value}
        },
    }) )

// OvertimeDetailModelTC.setResolver('updateMany', OvertimeDetailModelTC.getResolver('updateMany')
//     .addFilterArg({
//         name: 'ids',
//         type: '[String]',
//         query: (query, value, resolveParams) => {
//
//             query._id = {$in:value}
//         },
//     }) )


const LoginInputTC = schemaComposer.createObjectTC({
    name: 'UserLoginInput',
    fields: {
        userName: 'String!',
        password: 'String!'
    }
});

const LoggedInTC = schemaComposer.createObjectTC({
        name: 'LoggedInData',
        fields: {
            token: 'String!',
        }
    }
)


UserModelTC.addResolver({
    name: `login`,
    kind: 'mutation',
    type: LoggedInTC,
    args: {input:toInputObjectType(LoginInputTC)},
   // args: toInputObjectType(LoginInputTC),
    resolve: async ({ source, args, context, info }) => {
        // const user = await User.findOne(args.record).exec();
        // if (!user) user = await User.create(args.record);
        // console.log(args)
        const User = mongoose.model("User")
        const user = await User.findOne({userName:args.input.userName, password:args.input.password}).exec();
       if(user!==null){
           return {
               token:user.token
           }
       }
       else throw (new Error("Invalid Credentials"))
    },
});

const ApproveMemberJoinTC = schemaComposer.createObjectTC({
    name: 'ApproveMemberJoin',
    fields: {
        _id: 'String!',
        addMember: 'Boolean!',
        addPayroll: 'Boolean!',
        approvedBy: 'String'

    }
});

const ApproveMemberUpdateTC = schemaComposer.createObjectTC({
    name: 'ApproveMemberUpdate',
    fields: {
        _id: 'String!',
        updateMember: 'Boolean!',
        updatePayroll: 'Boolean!',
        approvedBy: 'String'

    }
});

const ApproveMemberLeftTC = schemaComposer.createObjectTC({
    name: 'ApproveMemberLeft',
    fields: {
        _id: 'String!',
        setInactive: 'Boolean!',
        removeFromPayroll: 'Boolean!',
        approvedBy: 'String'

    }
});

MemberJoinRequestTC.addResolver({
    name: `approve`,
    kind: 'mutation',
    type: MemberJoinRequestTC,
    args: {input:toInputObjectType(ApproveMemberJoinTC)},
    // args: toInputObjectType(LoginInputTC),
    resolve: async ({ source, args, context, info }) => {
        const {_id, addMember, addPayroll, approvedBy} = args.input
        const Model = mongoose.model("MemberJoinRequest")
        const request = await Model.findOne({_id}).exec()
        if(request.requestStatus!=="Approved")
        {
            request.requestStatus= 'Approved'
            request.approvedBy = approvedBy
            request.approvedOn = new Date()

            if(addMember)
            {
                const member = _.omit(request.toObject(), ['memberId', '_id', 'joinLetter', 'requestStatus' , 'requestDate', 'approvedOn', 'approvedBy', 'createdBy'])
               // console.log("m1",{member})
                member.joinRequests = [...(member.joinRequests||[]),request._id]
              //  console.log( member.joinRequests)
                if(!request.memberId)
              {

                    // console.log(member)

                    const res = await mongoose.model('Member').create(member)

                     request.memberId = res._id
                } else
                {

                   // console.log({member})
                    const res = await mongoose.model('Member').findByIdAndUpdate(request.memberId, {...member, status:'Active'})
                }

            }
            if(!addPayroll) {
               request.payrollStatus = 'Avoided'

            }

           return  await request.save();
        }




    },
});


MemberLeftRequestTC.addResolver({
    name: `approve`,
    kind: 'mutation',
    type: MemberLeftRequestTC,
    args: {input:toInputObjectType(ApproveMemberLeftTC)},
    // args: toInputObjectType(LoginInputTC),
    resolve: async ({ source, args, context, info }) => {
        const {_id, setInactive, removeFromPayroll} = args.input
        const Model = mongoose.model("MemberLeftRequest")
        const request = await Model.findOne({_id}).exec()
        if(request.requestStatus!=="Approved")
        {
            request.requestStatus= 'Approved'

            if(setInactive)
            {
                /// create a member
                const member = await mongoose.model('Member').findOne({_id: request.member.id}).exec();
                // console.log(member)
                if(member)
                {
                    member.status = request.reasonType
                }
                await member.save();

            }
            if(!removeFromPayroll) {
                    request.payrollStatus = 'Avoided'
            }

            return  await request.save();
        }




    },
});


MemberUpdateRequestTC.addResolver({
    name: `approve`,
    kind: 'mutation',
    type: MemberUpdateRequestTC,
    args: {input:toInputObjectType(ApproveMemberUpdateTC)},
    // args: toInputObjectType(LoginInputTC),
    resolve: async ({ source, args, context, info }) => {
        const {_id, updateMember, updatePayroll, approvedBy} = args.input
        const Model = mongoose.model("MemberUpdateRequest")
        const request = await Model.findOne({_id}).exec()
        if(request.requestStatus!=="Approved")
        {
            request.requestStatus= 'Approved'
            request.approvedBy = approvedBy
            request.approvedOn = new Date()

            if(updateMember)
            {
                const member = await mongoose.model('Member').findById(request.memberId).exec()

                if(member) {
                   if(request.updateTypes.includes('salary'))  {
                       member.earning.rate = request.salary;
                   }
                    if(request.updateTypes.includes('position'))  {
                        member.jobTitle = request.jobTitle;
                    }
                    if(request.updateTypes.includes('contractDate'))  {
                        member.endDate = request.contractEndDate;
                    }

                    if(request.updateTypes.includes('allowance'))  {
                        member.earning.additionalEarnings = request.additionalEarnings;
                    }
                    await member.save();


                }


            }
            if(!updatePayroll) {
                request.payrollStatus = 'Avoided'

            }

            return  await request.save();
        }




    },
});


const BulkWriteInputTC = schemaComposer.createObjectTC({
    name: 'BulkWriteInput',
    fields: {
        op: 'String!',
    }
});

const BulkWriteTC = schemaComposer.createObjectTC({
        name: 'BulkWriteResponse',
        fields: {
            status: 'String!',
        }
    }
)



TimesheetModelTC.addResolver({
    name: `bulkWrite`,
    kind: 'mutation',
    type: BulkWriteTC,
    args: {input:toInputObjectType(BulkWriteInputTC)},
    // args: toInputObjectType(LoginInputTC),
    resolve: async ({ source, args, context, info }) => {
        // const user = await User.findOne(args.record).exec();
        // if (!user) user = await User.create(args.record);
        // console.log(args)
        const Timesheet = mongoose.model("Timesheet")
         const res= await Timesheet.bulkWrite(JSON.parse(args.input.op))
        // throw (new Error("Invalid Credentials"))
    },
});




// OvertimeReportTC.addResolver({
//     name:'getSummery',
//     kind: 'query',
//     type:
// })


schemaComposer.Query.addFields({
    [`teams`]: TeamModelTC.getResolver('findMany'),
})
schemaComposer.Mutation.addFields({
    [`login`]: UserModelTC.getResolver('login'),
    [`bulkWrite`]: TimesheetModelTC.getResolver('bulkWrite'),
    [`approveMemberJoin`]: MemberJoinRequestTC.getResolver('approve'),
    [`approveMemberLeft`]: MemberLeftRequestTC.getResolver('approve'),
    [`approveMemberUpdate`]: MemberUpdateRequestTC.getResolver('approve'),
})

// schemaComposer.Mutation.addFields({
//
// })
//
// schemaComposer.Mutation.addFields({
//
// })

// buildSchema('Record',schemaComposer);
// buildSchema('Visit',schemaComposer);


// require('./schemas/profile')
// require('./mongooseQL')('Company',schemaComposer);
//addEntityNameRegexpSearch()
//
// const Item = mongoose.model('Item');
// const ItemTC = composeWithMongoose(Item);
//
// const entity = item
//
// schemaComposer.Query.addFields({
//     item: ItemTC.getResolver('findById'),
//     itemByIds: ItemTC.getResolver('findByIds'),
//     itemOne: ItemTC.getResolver('findOne'),
//     itemMany: ItemTC.getResolver('findMany'),
//     itemCount: ItemTC.getResolver('count'),
//     itemConnection: ItemTC.getResolver('connection'),
//     itemPagination: ItemTC.getResolver('pagination'),
// });
//
// schemaComposer.Mutation.addFields({
//     itemCreateOne: ItemTC.getResolver('createOne'),
//     itemCreateMany: ItemTC.getResolver('createMany'),
//     itemUpdateById: ItemTC.getResolver('updateById'),
//     itemUpdateOne: ItemTC.getResolver('updateOne'),
//     itemUpdateMany: ItemTC.getResolver('updateMany'),
//     itemRemoveById: ItemTC.getResolver('removeById'),
//     itemRemoveOne: ItemTC.getResolver('removeOne'),
//     itemRemoveMany: ItemTC.getResolver('removeMany'),
// });

const graphqlSchema = schemaComposer.buildSchema();
module.exports = graphqlSchema;













// const {gql } = require('apollo-server-hapi');
//
//
// module.exports = gql`
// type Item {
//   id: String
//   name: String
// }
//
// type Item {
//   name: String
// }
//
// type Query {
//   items: [Item]
//   item(id: String): Item
// }
// `;





// const graphql = require('graphql')
// const {GraphQLObjectType, GraphQLString, GraphQLSchema} = graphql;
// const ItemType = require('./ItemType');
// const mongoose = require('mongoose');
//
// const RootQuery = new GraphQLObjectType (
//     {
//         name: 'RootQueryType',
//         fields: {
//             item: {
//                 type: ItemType,
//                 args: {id: {type: GraphQLString}},
//                 resolve(parent, args) {
//
//                     return  mongoose.model('Item').findById(args.id)
//
//                 }
//             }
//         }
//     }
// )
//
// module.exports = new GraphQLSchema({
//     query: RootQuery
// });
