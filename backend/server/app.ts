import cors from "cors";
import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@as-integrations/express5";

const typeDefs = `#graphql
    type Query {
        hello: String
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello world!"
    }
};

const app = express();
const PORT = 3000;

const apolloServer = new ApolloServer({
    typeDefs: typeDefs,
    resolvers: resolvers
});

async function startServer() {
    await apolloServer.start();

    app.use(
        "/graphql",
        cors(),
        express.json(),
        expressMiddleware(apolloServer, {
            context: async ({ req }) => ({
                token: req.headers.token
            })
        })
    );

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}

startServer();