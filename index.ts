import "reflect-metadata";
import { PrismaClient } from '@prisma/client';
import { buildSchema, Query, Resolver } from "type-graphql";
import { ApolloServer } from "apollo-server-express";
import { PostCrudResolver, PostRelationsResolver, ProfileCrudResolver, ProfileRelationFilter, ProfileRelationsResolver, User, UserCrudResolver, UserRelationsResolver } from "./prisma/generated/type-graphql";
import Express from 'express';
const PORT = 3000;

// interface Context {
//   prisma: PrismaClient;
// }

@Resolver()
class HelloResolver {
  @Query(() => String)
  async hello() {
    return "Hello World!";
  }
}

const main = async () => {
  const schema = await buildSchema({
    resolvers: [
      HelloResolver, 
      PostCrudResolver, 
      PostRelationsResolver,
      UserCrudResolver,
      UserRelationsResolver,
      ProfileCrudResolver,
      ProfileRelationsResolver
    ],
    // emitSchemaFile: true
  });

  const prisma = new PrismaClient();
  await prisma.$connect();

  const apolloServer = new ApolloServer({
    schema,
    context: () => ({ prisma }),
  });
  const app = Express();


  await apolloServer.start();
  apolloServer.applyMiddleware({ app })

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}/graphql`)
  })
}

main().catch(console.error);