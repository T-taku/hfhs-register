import { APIContext } from "@/components/APIProvider";
import { getSession, useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useContext, useEffect } from "react";

export const useAPI = (required: boolean = true) => {
  useRouter()
  useSession({required: required});
  return useContext(APIContext)
}