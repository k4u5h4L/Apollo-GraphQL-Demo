const { ApolloServer, gql } = require("apollo-server");
const { authors, books } = require("./data");

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
const typeDefs = gql`
    # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

    # This "Book" type defines the queryable fields for every book in our data source.
    type Book {
        id: Int
        name: String
        authorId: Int
        author: Author
    }

    type Author {
        id: Int
        name: String
        books: [Book]
    }

    # The "Query" type is special: it lists all of the available queries that
    # clients can execute, along with the return type for each. In this
    # case, the "books" query returns an array of zero or more Books (defined above).
    type Query {
        """
        Query all the books
        """
        books: [Book]

        """
        Query all the authors
        """
        authors: [Author]

        """
        Query for a single author by their ID
        """
        author(authorId: ID!): Author

        """
        Query for a single book by it's ID
        """
        book(bookId: ID!): Book
    }

    type Mutation {
        """
        Create a new Book providing its id, name and authorId
        """
        createBook(id: Int!, name: String!, authorId: Int!): Book

        """
        Create a new Author providing their id and name
        """
        createAuthor(id: Int!, name: String!): Author
    }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
const resolvers = {
    Query: {
        books: (_root, _args, _ctx) => {
            return books;
        },
        author: (_root, args, _ctx) =>
            authors.find((author) => author.id == args.authorId),
        book: (_root, args, _ctx) =>
            books.find((book) => book.id == args.bookId),
        authors: (_root, _args, _ctx) => authors,
    },

    Mutation: {
        createBook: (_root, args, _ctx) => {
            const book = {
                id: args.id,
                name: args.name,
                authorId: args.authorId,
            };

            books.push(book);

            return book;
        },
        createAuthor: (_root, args, _ctx) => {
            const author = {
                id: args.id,
                name: args.name,
            };

            authors.push(author);

            return author;
        },
    },

    // Nested queries
    Author: {
        books: (parent) => {
            return books.filter((book) => book.authorId == parent.id);
        },
    },
    Book: {
        author: (parent) => {
            return authors.find((author) => author.id == parent.authorId);
        },
    },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({ typeDefs, resolvers });

// The `listen` method launches a web server.
server.listen(8000).then(({ url }) => {
    console.log(`🚀  Server ready at ${url}`);
});
