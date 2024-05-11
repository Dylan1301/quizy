import { defineConfig } from "orval";
export default defineConfig({
  petstore: {
    output: {
      mode: "tags-split",
      target: "src/api/quizy.ts",
      schemas: "src/api/model",
      client: "swr",
      mock: false,
      tslint: false,
    },
    input: {
      target: "http://localhost:8000/openapi.json",
    },
  },
});
