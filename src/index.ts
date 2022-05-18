import { ApolloServer } from "apollo-server";
import { schema } from "./schema";

export const server = new ApolloServer({
  // Graphql server is created with the new schema
  schema: schema,
});

const port = 3001;

server.listen({ port }).then(({ url }) => {
  console.log(`server running on ${url}`);
});
