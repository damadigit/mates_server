
const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');

const pluralize = require('pluralize')
const ListMetadataTC = require('./schemas/listMetaData')
module.exports = function(name,schemaComposer ) {




    const Model = mongoose.model(name);

   const ModelTC= composeWithMongoose(Model);



    //const name = model;

    ModelTC.addResolver({
        name: `allMeta`,
        kind: 'query',
        type: ListMetadataTC,
        args: ModelTC.getResolver('findMany').getArgs(),
        resolve: async ({ source, args, context, info }) => {
            // const user = await User.findOne(args.record).exec();
            // if (!user) user = await User.create(args.record);
            // console.log(args)

            return {
                count: await Model.countDocuments(args.filter)
            }
        },
    });

    ModelTC.getResolver('updateMany')
        .addFilterArg({
            name: 'ids',
            type: '[String]',
            query: (query, value, resolveParams) => {

                query._id = {$in:value}
            },
        })


    ModelTC.addFields( {
        id:
            { // set `id` name for new field
        type: 'MongoID', // set type MongoID
        resolve: (source) => source._id, // write resolve method, which returns _id value for the current field
        projection: { _id: true }, // add information, that need to reques _id field from database, when you request `id` field
    }
    }
    );


    schemaComposer.Query.addFields({
        [name.toLowerCase()]: ModelTC.getResolver('findById'),
        [`byIds${name}`]: ModelTC.getResolver('findByIds'),
        [`one${name}`]: ModelTC.getResolver('findOne'),
        [`${pluralize(name).toLowerCase()}`]: ModelTC.getResolver('findMany'),
        [`_${pluralize(name).toLowerCase()}Meta`]: ModelTC.getResolver('allMeta'),
        [`count${name}`]: ModelTC.getResolver('count'),
        [`connection${name}`]: ModelTC.getResolver('connection'),
        [`pagination${name}`]: ModelTC.getResolver('pagination'),
    });





    schemaComposer.Mutation.addFields({
        [`create${name}`]: ModelTC.getResolver('createOne'),
        [`createMany${name}`]: ModelTC.getResolver('createMany'),
        [`update${name}`]: ModelTC.getResolver('updateById'),
        [`updateOne${name}`]: ModelTC.getResolver('updateOne'),
        [`updateMany${name}`]: ModelTC.getResolver('updateMany'),
        [`delete${name}`]: ModelTC.getResolver('removeById'),
        [`deleteOne${name}`]: ModelTC.getResolver('removeOne'),
        [`deleteMany${name}`]: ModelTC.getResolver('removeMany'),
    });






    return {schemaComposer, Model, ModelTC};

};
















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
