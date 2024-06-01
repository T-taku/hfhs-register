import { User } from "@/utils/RegiAPI";
import type React from "react";
import { createContext, useContext } from "react";
import { APIContext } from "./APIProvider";

export const UserinfoContext = createContext<Promise<User> | undefined>(undefined);

export function UserinfoProvider({ children }: { children: React.ReactNode }) {
  const api = useContext(APIContext);
  return <UserinfoContext.Provider value={
    api?.then((api) => api.getUserinfo())
  }>
    {children}
  </UserinfoContext.Provider>
}