export default {
  petstore: {
    output: {
      mode: "tags-split",
      target: "src/api/quizy.ts",
      schemas: "src/api/model",
      client: "swr",
      mock: true,
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
  },
};
