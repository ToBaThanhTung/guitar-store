import { ApolloServer } from 'apollo-server-express';

import { PubSub } from 'apollo-server'

export const pubSub = new PubSub();

import jwt from 'jsonwebtoken';

/**
 * Checks if client is authenticated by checking authorization key from req headers
 *
 * @param {obj} req
 */
const checkAuthorization = token => {
  return new Promise((resolve, reject) => {
    try {
      const authUser = jwt.verify(token, 'secret');
      return resolve(authUser);
    } catch (err) {
      resolve(null);
    }
  });
};

/**
 * Creates an Apollo server and identifies if user is authenticated or not
 *
 * @param {obj} schema GraphQL Schema
 * @param {array} resolvers GraphQL Resolvers
 * @param {obj} models Mongoose Models
 */

export const createApolloServer = (schema, resolvers, models) => {
  return new ApolloServer({
    typeDefs: schema,
    resolvers,
    context: async ({ req, connection }) => {
      if (connection) {
        return connection.context;
      }

      let authUser;
      if (req.headers.authorization !== 'null') {
        const user = await checkAuthorization(req.headers['authorization']);
        if (user) {
          authUser = user;
        }
      }

      return Object.assign({ authUser }, models);
    },
    subscriptions: {
      onConnect: async (connectionParams, webSocket) => {
        // Check if user is authenticated
        if (connectionParams.authorization) {
          const user = await checkAuthorization(connectionParams.authorization);

          console.log("XX 58",user)

          // Publish somthing
       
          // Add authUser to socket's context, so we have access to it, in onDisconnect method
          return {
            authUser: user,
          };
        }
      },
      onDisconnect: async (webSocket, context) => {
        // Get socket's context
        console.log("Disconnect")
      }
    }

  });
};
