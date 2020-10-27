import express from 'express';
import mongoose from 'mongoose';
import { createServer } from 'http';
import { createApolloServer } from './utils/apollo-server';
import models from './models';
import schema from './schemas/schema';
import resolvers from './resolvers';
import { DB } from './config';

const connectWithRetry = function () {
  console.log("XX11: ",DB)
  // when using with docker, at the time we up containers. Mongodb take few seconds to starting, during that time NodeJS server will try to connect MongoDB until success.
  return mongoose.connect(
    DB.url,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      // user: DB.user,
      // pass: DB.pwd,
    },
    err => {
      if (err) {
        console.error(
          'Failed to connect to mongo on startup - retrying in 5 sec',
          err
        );
        setTimeout(connectWithRetry, 5000);
      }
    }
  );
};
connectWithRetry();

const app = express();
// app.use('/', (req, res) => res.send('OK'));

const server = createApolloServer(schema, resolvers, models);
server.applyMiddleware({ app, path: '/graphql' });

// Create http server and add subscriptions to it
const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);
const PORT = process.env.PORT || process.env.APP_PORT || 5000;
httpServer.listen({ port: PORT }, () => {
  console.log(`server ready at http://localhost:${PORT}${server.graphqlPath}`);
  console.log(
    `Subscriptions ready at ws://localhost:${PORT}${server.subscriptionsPath}`
  );
});
