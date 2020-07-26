const { schemaComposer } = require('graphql-compose');
const ListMetadataTC = schemaComposer.createObjectTC({
        name: 'ListMetadata',
        fields: {
            count: 'Int!',
        }
    }
)
module.exports =  ListMetadataTC
