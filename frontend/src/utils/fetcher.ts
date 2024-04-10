import { Fetcher } from "openapi-typescript-fetch";

import { paths } from "../api/quizy.generated";
import { API_URL } from "./constants";

// declare fetcher for paths
const fetcher = Fetcher.for<paths>();

// global configuration
fetcher.configure({
  baseUrl: API_URL,
});

export default fetcher;
