
const Koa = require('koa');
const mongoose = require('mongoose');
const { ApolloServer, gql } = require('apollo-server-koa');
//console.log(process.env.MONGOLAB_URI)
mongoose.connect(process.env.MONGOLAB_URI || 'mongodb://127.0.0.1:27017/finadmin_db', // 'mongodb+srv://finado:finadodo1!@cluster0.oufcv.mongodb.net/finadmin?retryWrites=true&w=majority', //'mongodb://127.0.0.1:27017/finadmin_db', //'mongodb://dama:yageruaga1!@ds237373.mlab.com:37373/yageruaga',
    { useNewUrlParser: true } );

mongoose.connection.once('open', () => {
    console.log('connected to database');

});
require('./server/models')();
const port =  process.env.PORT || 4008;
const schema = require('./server/api/graphql/schema');
async function StartServer() {
    const server = new ApolloServer({schema, introspection: true});

    const app = new Koa();



    await server.applyMiddleware({
        app,
    });

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
