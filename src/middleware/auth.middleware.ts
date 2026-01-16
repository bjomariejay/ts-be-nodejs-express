import { Response, NextFunction } from "express";
import { verifyAuthToken } from "../utils/token";
import { AuthenticatedRequest, AuthenticatedUserContext } from "../types/auth";

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
        return res.status(401).json({ success: false, message: "Authorization token missing" });
    }

    const token = header.split(" ")[1];

    try {
        const payload = verifyAuthToken(token);
        const authUser: AuthenticatedUserContext = {
            userId: payload.userId,
            username: payload.username,
        };
        req.authUser = authUser;
        next();
    } catch (error) {
        console.error("Token verification failed", error);
        return res.status(401).json({ success: false, message: "Invalid or expired token" });
    }
};
