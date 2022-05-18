import { objectType, extendType, nonNull, stringArg, intArg } from "nexus";
import { NexusGenObjects } from "../../nexus-typegen";

export const Link = objectType({
  // generates a new type for the Graphql schema
  name: "Link", // name of the new type
  definition(t) {
    // definition of the fields, the type t contains
    t.nonNull.int("id"); // fields can have different types and are either nonNull or nullabe
    t.nonNull.string("description");
    t.nonNull.string("url");
  },
});

let links: NexusGenObjects["Link"][] = [
  // creates mock links, since the database is not yet set up
  {
    id: 1,
    url: "www.howtographql.com",
    description: "Fullstack tutorial for GraphQL",
  },
  {
    id: 2,
    url: "graphql.org",
    description: "GraphQL official website",
  },
];

export const LinkQuery = extendType({
  // the Query type is extended, so that the feed can be fetched
  type: "Query",
  definition(t) {
    t.nonNull.list.nonNull.field("feed", {
      // the name of the field is feed and it returns a nonNull list of nonNull links
      type: "Link",
      resolve(parent, args, context, info) {
        // resolver function for the feed query, which returns the links defined above
        // resolver is required, because this field cannot be resolved with a trivial resolver
        return links;
      },
    });
    t.nullable.field("link", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        return links[args.id - 1];
      },
    });
  },
});

export const LinkMutation = extendType({
  // the Mutation type is extended, so that new Links can be created using the post field
  type: "Mutation",
  definition(t) {
    t.nonNull.field("post", {
      // the name of the field is post and it returns the link which has just been added
      type: "Link",
      args: {
        // definition of the arguments, which are used to create a new link
        // both arguments are nonNull and strings
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context, info) {
        const { description, url } = args; // argument of the field is destructured
        let id = links.length + 1; // new link is created, added to the links array and returned by the query
        const newLink = {
          id,
          description,
          url,
        };
        links.push(newLink);
        return newLink;
      },
    });
    t.nonNull.field("updateLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
        description: nonNull(stringArg()),
        url: nonNull(stringArg()),
      },
      resolve(parent, args, context, info) {
        const { id, description, url } = args;
        const link = {
          id,
          description,
          url,
        };
        links[id - 1] = link;
        return link;
      },
    });
    t.nonNull.field("deleteLink", {
      type: "Link",
      args: {
        id: nonNull(intArg()),
      },
      resolve(parent, args, context, info) {
        const { id } = args;
        const deletedLink = links[id - 1];
        links = links.filter((link) => link.id !== id);
        return deletedLink;
      },
    });
  },
});
