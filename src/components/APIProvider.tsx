import { RegiAPI } from "@/utils/RegiAPI";
import React from "react";
import { createContext } from "react";

export const APIContext = createContext<Promise<RegiAPI> | undefined>(undefined);
const local = process.env.NEXT_PUBLIC_USE_LOCAL == "true";

export function APIProvider({ children }: { children: React.ReactNode }) {
  const api = fetch('/api/auth/jwt')
    .then((res) => res.text()).then((token) => new RegiAPI(token, local));
  return <APIContext.Provider value={api}>
    {children}
  </APIContext.Provider>
}