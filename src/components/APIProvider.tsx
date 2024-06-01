import { RegiAPI } from "@/utils/RegiAPI";
import type React from "react";
import { createContext } from "react";

export const APIContext = createContext<RegiAPI | undefined>(undefined);

export function APIProvider({ children }: { children: React.ReactNode }) {
  const jwt = fetch('/api/auth/jwt')
    .then((res) => res.text())
  return <APIContext.Provider value={
    new RegiAPI(jwt)
  }>
    {children}
  </APIContext.Provider>
}