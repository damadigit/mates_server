
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const router = require('./server/api/rest/router');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const { ApolloServer, gql } = require('apollo-server-koa');
//console.log(process.env.MONGOLAB_URI)
mongoose.connect('mongodb+srv://admin:YXqFoshXrbND7pAy@cluster0.vx1t6.mongodb.net/mates_deweto?retryWrites=true&w=majority', //  'mongodb://127.0.0.1:27017/mates_db', //process.env.MONGOLAB_URI || 'mongodb+srv://finado:finadodo1!@cluster0.oufcv.mongodb.net/finadmin?retryWrites=true&w=majority', //'mongodb://127.0.0.1:27017/finadmin_db', //'mongodb://dama:yageruaga1!@ds237373.mlab.com:37373/yageruaga',
    { useNewUrlParser: true } );

mongoose.connection.once('open', () => {
    console.log('connected to database');

});
require('./server/models')();
const port =  process.env.PORT || 40018;
const schema = require('./server/api/graphql/schema');
async function StartServer() {
    const server = new ApolloServer({schema, introspection: true});

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
