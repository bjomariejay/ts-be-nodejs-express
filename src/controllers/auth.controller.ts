import { Request, Response } from "express";
import * as UserModel from "../models/user.model";

export const login = async (req: Request, res: Response) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ success: false, message: "Username and password are required" });
    }

    try {
        const user = await UserModel.findByCredentials(username, password);
        if (!user) {
            return res.status(401).json({ success: false, message: "Invalid username or password" });
        }

        return res.json({
            success: true,
            user
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
        const user = await UserModel.createUser({
            name: String(name).trim(),
            age: parsedAge,
            address: String(address).trim(),
            username: String(username).trim(),
            password: String(password)
        });

        return res.status(201).json({ success: true, user });
    } catch (error: any) {
        console.error("Signup error", error);
        if (error?.code === "23505") {
            return res.status(409).json({ success: false, message: "Username already exists" });
        }
        res.status(500).json({ success: false, message: "Unable to create account" });
    }
};
