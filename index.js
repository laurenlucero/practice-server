const { ApolloServer, gql } = require('apollo-server');

// A schema is a collection of type definitions (hence "typeDefs") 
// together they define the "shape" of queries that are executed against your data
const typeDefs = gql`
# The "Query" type is special: it lists all of the available queries that
# clients can execute, along with the return type for each. In this
# case, the "books" query returns an array of zero or more Books (defined above).
type Query {
  books: [Book]
  authors: [Author]
}

type Mutation {
  addBook(title: String, author: String): Book
}

# This "Book" type defines the queryable fields for every book in our data source.
type Book {
  title: String
  author: Author
}

type Author {
  name: String
  books: [Book]
}
`;

const resolvers = {
  Query: {
    books: () => books,
  },
};

// The ApolloServer constructor requires two parameters: 
// your schema definition and your set of resolvers
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server
server.listen().then(({ url }) => {
  console.log(`🚀  Server ready at ${url}`);
});

// example data
const books = [
  {
    title: 'The Awakening',
    author: 'Kate Chopin',
  },
  {
    title: 'City of Glass',
    author: 'Paul Auster',
  },
];