import { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
    schema: "src/app/api/graphql/schemaGQL.gql",
    generates: {
        "./src/types/generated/graphql.ts": {
            plugins: ["typescript", "typescript-resolvers"],
        }
    }
}

export default config;