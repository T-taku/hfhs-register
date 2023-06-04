// This is an example of how to read a JSON Web Token from an API route
import { getToken } from "next-auth/jwt"
import jwt from "jsonwebtoken";
import type { NextApiRequest, NextApiResponse } from "next"

const secret = process.env.NEXTAUTH_SECRET;

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // If you don't have the NEXTAUTH_SECRET environment variable set,
    // you will have to pass your secret as `secret` to `getToken`
    const token = await getToken({ req, raw:true });
    res.send(JSON.stringify(token, null, 2))
}