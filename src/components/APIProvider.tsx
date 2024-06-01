import { RegiAPI } from "@/utils/RegiAPI";
import React, { useEffect, useState } from "react";
import { createContext } from "react";

export const APIContext = createContext<RegiAPI | undefined>(undefined);
const local = process.env.NEXT_PUBLIC_USE_LOCAL == "true";

export function APIProvider({ children }: { children: React.ReactNode }) {
  const [api, setAPI] = useState<RegiAPI | undefined>(undefined);
  useEffect(() => {
    fetch('/api/auth/jwt')
      .then(res => res.text())
      .then(token => setAPI(new RegiAPI(token, local)))
      .catch(() => setAPI(new RegiAPI()));
  }, [])
  return <APIContext.Provider value={api}>
    {children}
  </APIContext.Provider>
}