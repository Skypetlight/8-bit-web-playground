export const typeDefs = `
    scalar DateTime

    enum ExecutionStatus {
        SUCCESS
        COMPILE_ERROR
        RUNTIME_ERROR
        TIMEOUT
    }

    input CodeSnippet {
        sourceCode: String!
    }

    type CodeExecution {
        stdout: String
        stderr: String
        status: ExecutionStatus!
        executedAt: DateTime!
    }

    type Mutation {
        executeCode(input: CodeSnippet!): CodeExecution!
    }
`;