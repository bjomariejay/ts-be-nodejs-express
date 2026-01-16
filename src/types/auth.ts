import { Request } from "express";

export interface AuthenticatedUserContext {
    userId: number;
    username: string;
}

export interface AuthenticatedRequest extends Request {
    authUser?: AuthenticatedUserContext;
}
