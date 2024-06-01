import { APIContext } from "@/components/APIProvider";
import { useSession } from "next-auth/react";
import { useContext } from "react";

export const useAPI = (required: boolean = true) => {
  useSession({required: required});
  return useContext(APIContext)
}