import { User } from "@/utils/RegiAPI";
import type React from "react";
import { createContext, useEffect, useState } from "react";
import { useAPI } from "@/utils/useAPI";

export const UserinfoContext = createContext<User | undefined>(undefined);

export function UserinfoProvider({ children }: { children: React.ReactNode }) {
  const api = useAPI(false);
  const [userinfo, setUserinfo] = useState<User | undefined>(undefined);
  useEffect(() => {
    api?.getUserinfo().then(user => setUserinfo(user))
  })
  return <UserinfoContext.Provider value={userinfo}>
    {children}
  </UserinfoContext.Provider>
}