import { Fetcher, Middleware } from "openapi-typescript-fetch";

import { paths } from "../api/quizy.generated";
import { API_URL } from "./constants";

const fetcher = Fetcher.for<paths>();
const middleware: Middleware = async (url, init, next) => {
  const token = localStorage.getItem("token");
  if (token) {
    init.headers.set("Authorization", `Bearer ${token}`);
  }
  return next(url, init);
};
fetcher.configure({
  baseUrl: API_URL,
  use: [middleware],
});

export default fetcher;
