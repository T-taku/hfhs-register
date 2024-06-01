import { RegiAPI } from "@/utils/RegiAPI";
import React from "react";
import { createContext } from "react";

export const APIContext = createContext<Promise<RegiAPI> | undefined>(undefined);

export function APIProvider({ children }: { children: React.ReactNode }) {
  const api = fetch('/api/auth/jwt')
    .then((res) => res.text()).then((token) => new RegiAPI(token))
  return <APIContext.Provider value={
    api
  }>
    {children}
  </APIContext.Provider>
}