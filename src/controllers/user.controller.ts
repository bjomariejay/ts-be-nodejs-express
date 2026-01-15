import { Request, Response } from "express";
import * as UserModel from '../models/user.model';

const parseAge = (value: unknown): number | null => {
    const parsedAge = Number(value);
    return Number.isFinite(parsedAge) ? parsedAge : null;
};

export const getUsers = async (_req: Request, res: Response) => {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        console.error('Error fetching users', error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const createUser = async (req: Request, res: Response) => {
    const { name, age, address, username, password } = req.body;
    const numericAge = parseAge(age);

    if (!name || !address || !username || !password || numericAge === null) {
        return res.status(400).json({ message: 'Name, age, address, username, and password are required.' });
    }

    try {
        const user = await UserModel.createUser({
            name: name.trim(),
            age: numericAge,
            address: address.trim(),
            username: username.trim(),
            password,
        });
        res.status(201).json(user);
    } catch (error: any) {
        console.error('Error creating user', error);
        if (error?.code === '23505') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Unable to create user.' });
    }
};

export const deleteUser = async (req: Request, res: Response) => {
    try {
        await UserModel.deleteUser(Number(req.params.id));
        res.json({ message: 'Deleted successfully' });
    } catch (error) {
        console.error('Error deleting user', error);
        res.status(500).json({ message: 'Unable to delete user.' });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { name, age, address, username, password } = req.body;
    const numericAge = parseAge(age);

    if (!name || !address || !username || numericAge === null) {
        return res.status(400).json({ message: 'Name, age, address, and username are required.' });
    }

    try {
        const user = await UserModel.updateUser(id, {
            name: name.trim(),
            age: numericAge,
            address: address.trim(),
            username: username.trim(),
            password,
        });
        res.json(user);
    } catch (error: any) {
        console.error('Error updating user', error);
        if (error?.code === '23505') {
            return res.status(409).json({ message: 'Username already exists.' });
        }
        res.status(500).json({ message: 'Unable to update user.' });
    }
};
