import jwt, { JwtPayload, Secret } from "jsonwebtoken";
import type { StringValue } from "ms";

const DEFAULT_SECRET = "change-me";
const DEFAULT_EXPIRATION = "1h";

const JWT_SECRET: Secret = process.env.JWT_SECRET ?? DEFAULT_SECRET;
const JWT_EXPIRES_IN: StringValue | number = (process.env.JWT_EXPIRES_IN ?? DEFAULT_EXPIRATION) as StringValue;

export interface AuthTokenPayload {
    userId: number;
    username: string;
}

export const generateAuthToken = (payload: AuthTokenPayload): string =>
    jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

export const verifyAuthToken = (token: string): AuthTokenPayload & JwtPayload =>
    jwt.verify(token, JWT_SECRET) as AuthTokenPayload & JwtPayload;
