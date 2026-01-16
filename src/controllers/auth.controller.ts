import { Request, Response } from "express";
import * as UserModel from "../models/user.model";
import { comparePassword, hashPassword } from "../utils/password";
import { generateAuthToken } from "../utils/token";
import { AuthenticatedRequest } from "../types/auth";

const buildUserResponse = (account: UserModel.UserWithPassword | UserModel.User) => {
    const { passwordHash, ...user } = account;
    return user;
};

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const account = await UserModel.findByUsername(username.trim());
        if (!account) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const passwordMatches = await comparePassword(password, account.passwordHash);
        if (!passwordMatches) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        const token = generateAuthToken({ userId: account.id, username: account.username });

        return res.json({
            success: true,
            token,
            user: buildUserResponse(account)
        });
    } catch (error) {
        console.error("Login error", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const signup = async (req: Request, res: Response) => {
    const { name, age, address, username, password } = req.body;
    const parsedAge = Number(age);

    if (!name || !age || !address || !username || !password || !Number.isFinite(parsedAge)) {
        return res.status(400).json({ success: false, message: "All fields are required" });
    }

    try {
        const passwordHash = await hashPassword(String(password));
        const user = await UserModel.createUser({
            name: String(name).trim(),
            age: parsedAge,
            address: String(address).trim(),
            username: String(username).trim(),
            passwordHash
        });

        const token = generateAuthToken({ userId: user.id, username: user.username });
        console.log(`Signup token issued for ${user.username}:`, token);

        return res.status(201).json({ success: true, user, token });
    } catch (error: any) {
        console.error("Signup error", error);
        if (error?.code === "23505") {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }
        res.status(500).json({ success: false, message: "Unable to create account" });
    }
};

export const getCurrentUser = async (req: AuthenticatedRequest, res: Response) => {
    if (!req.authUser) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
    }

    try {
        const account = await UserModel.findById(req.authUser.userId);
        if (!account) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.json({ success: true, user: buildUserResponse(account) });
    } catch (error) {
        console.error("Me endpoint error", error);
        res.status(500).json({ success: false, message: "Unable to fetch user" });
    }
};
