const { ApolloServer, gql } = require('apollo-server');
const LRU = require("lru-cache");
const { generate } = require("shortid");

// A schema is a collection of type definitions (hence "typeDefs") 
// together they define the "shape" of queries that are executed against your data
const typeDefs = gql`
# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
  book(id: String!): Book
}
  # This "Book" type defines the queryable fields for every book in our data source.
  type Book {
    id: String!
    title: String!
    author: String!
  }

  type Mutation {
    addBook(type: String!): Book
    updateBook(id: String!, type: String!): Book
  }
`;

const cache = new LRU({ max: 50, maxAge: 1000 * 60 * 60 });

const resolvers = {
  Query: {
    books: () => {
      const books = []
      cache.forEach((type, id) => books.push({ type, id }))
      return books
    },
    book: (_, {id}) => {
      return {id, type: cache.get(id)}
    }
  },
  Mutation: {
    addBook: (_, {type}) => {
      const id = generate()
      const book = {type, id}
      cache.set(id, type)
      return todo
    },
    updateBook: (_, {type, id}) => {
      const book = {type, id}
      cache.set(id, type)
      return book
    }
  }
};

// The ApolloServer constructor requires two parameters: 
// your schema definition and your set of resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});
