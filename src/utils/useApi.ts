import { Configuration, DefaultApi } from "./openapi";

export function useApi(token: (() => string) | (() => Promise<string>) ) {
  const config = new Configuration({basePath: "https://registar-api.hfhs-schoolfestival2023.fun", accessToken: token});
  return new DefaultApi(config);
}