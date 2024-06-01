import { UserinfoContext } from "@/components/UserinfoProvider";
import { useContext } from "react";

export const useUserinfo = () => useContext(UserinfoContext)