import { makeSchema } from "nexus";
import { join } from "path";
import * as types from "./graphql"; // all the types from the graphql server get imported

export const schema = makeSchema({
  // makeSchema creates a new Graphql schema
  types: types, // types, the schema uses are listed here
  outputs: {
    schema: join(process.cwd(), "schema.graphql"),
    typegen: join(process.cwd(), "nexus-typegen.ts"),
  },
});
