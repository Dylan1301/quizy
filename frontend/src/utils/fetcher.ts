import { Fetcher } from "openapi-typescript-fetch";

import { paths } from "../api/quizy.generated";
import { API_URL } from "./constants";

const fetcher = Fetcher.for<paths>();
fetcher.configure({ baseUrl: API_URL });

export default fetcher;
