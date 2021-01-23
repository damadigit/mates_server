
const mongoose = require('mongoose');
const { schemaComposer, toInputObjectType } = require('graphql-compose');
 const buildSchema  = require('./mongooseQL')

const {ModelTC:MemberModelTC} = buildSchema('Member',schemaComposer)
const {ModelTC:TeamModelTC} = buildSchema('Team',schemaComposer)
const  {ModelTC:UserModelTC} = buildSchema('User',schemaComposer)
 buildSchema('OvertimeReport',schemaComposer)
buildSchema('AbsenceReport',schemaComposer)
buildSchema('TeamOrganiseRequest',schemaComposer)
buildSchema('OvertimeDetail',schemaComposer)

MemberModelTC.addFields( {
     fullName:
         { // set `id` name for new field
          type: 'String', // set type MongoID
          resolve: (source) => `${source.name} ${source.fatherName}`, // write resolve method, which returns _id value for the current field
          projection: { name: true, fatherName: true }, // add information, that need to reques _id field from database, when you request `id` field
         },
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
})

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
