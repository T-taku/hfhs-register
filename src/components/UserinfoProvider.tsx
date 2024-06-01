import { User } from "@/utils/RegiAPI";
import type React from "react";
import { createContext } from "react";
import { useAPI } from "@/utils/useAPI";

export const UserinfoContext = createContext<Promise<User | undefined> | undefined>(undefined);

export function UserinfoProvider({ children }: { children: React.ReactNode }) {
  const api = useAPI(false);
  return <UserinfoContext.Provider value={
    api?.then((api) => api.getUserinfo()).catch(() => undefined)
  }>
    {children}
  </UserinfoContext.Provider>
}