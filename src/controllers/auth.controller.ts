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
