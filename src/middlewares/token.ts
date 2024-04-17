import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
import { currentUser } from "../interfaces/user";
import { Response, Request, NextFunction } from "express";
dotenv.config();

declare global {
    namespace Express {
        interface Request {
            user?: currentUser
        }
    }
}

export async function validationToken(req: Request, res: Response, next: NextFunction) {
    if (!req.header("Authorization")) return res.status(401).send("credentials expired");
    try { req.user = jwt.verify(req.header("Authorization")!, process.env.ACCESS_TOKEN_SECRET!) as currentUser; } catch (error) { console.log(error) }
    next();
}