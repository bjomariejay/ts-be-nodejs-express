import { Request, Response } from "express";
import { pool } from "../config/db";
import * as UserModel from '../models/user.model';

// GET all users
export const getUsers = async (req: Request, res: Response) => {
    try {
        const result = await pool.query("SELECT * FROM users");
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).send("Server Error");
    }
};

// CREATE user
export const createUser = async (req: Request, res: Response) => {
    const user = await UserModel.createUser(req.body);
    res.json(user);
};

export const deleteUser = async (req: Request, res: Response) => {
    await UserModel.deleteUser(Number(req.params.id));
    res.json({ message: 'Deleted successfully' });
}

export const updateUser = async (req: Request, res: Response) => {
    const user = await UserModel.updateUser(Number(req.params.id), req.body);
    res.json(user);
};

