import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import Express from "express";
import session from "express-session";
// import connectRedis from "connect-redis";
import connectMongo from "connect-mongo";
import cors from "cors";

import { RegisterResolver } from "./modules/user/Register";
// import { redis } from "./redis";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  // This is gonna read from the ormconfig and use the settings
  await createConnection();

  // Build schema (aka typeDefs) from resolvers
  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver]
  });

  // New ApolloServer
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }) => ({ req }) // ApolloServer gives us access to the "request" object from express and we can access the sesison data based on this.
  });

  // Express Application
  const app = Express();

  const MongoStore = connectMongo(session);

  app.use(
    cors({
      credentials: true,
      origin: "http://localhost:3000" // this is the host we expect our frontend to be at
    })
  );

  // SESSION MIDDLEWARE (needs to be added before 'apolloServer.applyMiddleware' )

  app.use(
    session({
      store: new MongoStore({
        url: process.env.REACT_APP_MONGODB_URL!
      }),
      name: "qid", // this is our cookie name
      secret: process.env.REACT_APP_SECRET!,
      resave: false, // off to not constantly create a new session for user, unless we change something
      saveUninitialized: false, // off to not constantly create a new session for user, unless we change something
      cookie: {
        httpOnly: true, // so javascript cant access it
        secure: process.env.NODE_ENV === "production", // only works in https
        maxAge: 1000 * 60 * 60 * 24 * 7 * 365 // lasts for 7 years
      }
    })
  );

  // Applying middleware
  apolloServer.applyMiddleware({ app }); // app is from an existing express app

  app.listen({ port: PORT }, () =>
    console.log(
      `🚀 Server running at http://localhost:4000${apolloServer.graphqlPath}`
    )
  );
};

startServer();
