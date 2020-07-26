const mongoose = require('mongoose');
const { composeWithMongoose } = require('graphql-compose-mongoose');
const { schemaComposer } = require('graphql-compose');
const  model = 'Profile'
const Model = mongoose.model(model);
const ModelTC = composeWithMongoose(Model);
const extendedResolver = ModelTC.getResolver('findMany').addFilterArg({
    name: 'nameRegexp',
    type: 'String',
    description: 'Search by name in regExp',
    query: (query, value, resolveParams) => {
        //console.log("filter runiing")
        query.name = new RegExp(value, 'i'); // eslint-disable-line
    },
}).addFilterArg({
        name: 'skillSearch',
        type: '[String]',
        description: 'Search by skills',
        query: (rawQuery, value) => {
            //console.log(value)
            // console.log(value)
            if( (value.length && value.length>0))
            rawQuery.skills =  {$all: value }//{ $elemMatch: {skills: value} }
        }
    })
    .addFilterArg({
        name: 'locationSearch',
        type: '[String]',
        description: 'Search by location',
        query: (rawQuery, value) => {
            //console.log(value)
            // console.log(value)
            if( (value.length && value.length>0))
            rawQuery.locations =  {$in: value }//{ $elemMatch: {skills: value} }
        }
    })
    .addFilterArg({
        name: 'jobSearch',
        type: '[String]',
        description: 'Search by jobs',
        query: (rawQuery, value) => {
            //console.log(value)
            // console.log(value)
            if( (value.length && value.length>0))
            rawQuery.jobs =  { $elemMatch: {title: value} }
        }
    })
    .addFilterArg({
        name: 'interestSearch',
        type: '[String]',
        description: 'Search by interest',
        query: (rawQuery, value) => {
            // console.log(value)
            if( (value.length && value.length>0))
            rawQuery.interests =  {$in:  value }//{ $elemMatch: {skills: value} }
        }
    })
    .addFilterArg({
        name: 'educationSearch',
        type: '[String]',
        description: 'Search by education',
        query: (rawQuery, value) => {
            //console.log(value)
            // console.log(value)
            if( (value.length && value.length>0))
            rawQuery.educations =  { $elemMatch: {field: value} }
        }
    })
;
 extendedResolver.name = 'findMany';
 ModelTC.addResolver(extendedResolver);



const name = model.toLowerCase();
schemaComposer.Query.addFields({
    [name]: ModelTC.getResolver('findById'),
    [name+'ByIds']: ModelTC.getResolver('findByIds'),
    [name+'One']: ModelTC.getResolver('findOne'),
    [name+'s']: ModelTC.getResolver('findMany'),
    [name+'Count']: ModelTC.getResolver('count'),
    [name+'Connection']: ModelTC.getResolver('connection'),
    [name+'Pagination']: ModelTC.getResolver('pagination'),
});

schemaComposer.Mutation.addFields({
    [name+'CreateOne']: ModelTC.getResolver('createOne'),
    [name+'CreateMany']: ModelTC.getResolver('createMany'),
    [name+'UpdateById']: ModelTC.getResolver('updateById'),
    [name+'UpdateOne']: ModelTC.getResolver('updateOne'),
    [name+'UpdateMany']: ModelTC.getResolver('updateMany'),
    [name+'RemoveById']: ModelTC.getResolver('removeById'),
    [name+'RemoveOne']: ModelTC.getResolver('removeOne'),
    [name+'RemoveMany']: ModelTC.getResolver('removeMany'),
});
