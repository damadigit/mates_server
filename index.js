
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('./server/api/rest/router');
const mongoose = require('mongoose');
// require('dotenv').config()
mongoose.Promise = global.Promise;
const { ApolloServer, gql } = require('apollo-server-koa');
console.log(process.env.MONGODB_URI)
mongoose.connect( process.env.MONGODB_URI  || 'mongodb://127.0.0.1:27017/mates_db',
    { useNewUrlParser: true } );

mongoose.connection.once('open', () => {
    console.log('connected to database');

});
require('./server/models')();
const port =  process.env.PORT || 40018;
const schema = require('./server/api/graphql/schema');
async function StartServer() {
    const server = new ApolloServer({schema,  playground: true, introspection: true});

    const app = new Koa();



    await server.applyMiddleware({
        app,
    });
    app.context.model = mongoose.model
    app.use(bodyParser());
    app.use(cors());
    app.use(router.routes()).use(router.allowedMethods());

    //await server.installSubscriptionHandlers(app.listener);

    //require('./server/api/routes')(app);
   const listener =  app.listen({ port: port}, () =>
        console.log(`🚀 Server ready at http://localhost:${port}${server.graphqlPath}`),
    );

    await server.installSubscriptionHandlers(listener);
}

StartServer().catch(error => console.log(error));

// mutation {
//     itemCreateOne(record: { name: "Pasta" }) {
//         record {
//             name,
//                 _id
//         }
//     }
// }
