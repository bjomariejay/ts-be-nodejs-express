import { pool } from '../config/db';

export interface User {
    id?: number;
    name: string;
    age: number;
    address: string;
}

export const getAllUsers = async (): Promise<User[]> => {
    const res = await pool.query('SELECT * FROM users ORDER BY id ASC');
    return res.rows;
};

export const createUser = async (user: User): Promise<User> => {
    const res = await pool.query(
        'INSERT INTO users (name, age, address) VALUES ($1, $2, $3) RETURNING *',
        [user.name, user.age, user.address]
    );
    return res.rows[0];
};

export const updateUser = async (id: number, user: User): Promise<User> => {
    const res = await pool.query(
        'UPDATE users SET name=$1, age=$2, address=$3 WHERE id=$4 RETURNING *',
        [user.name, user.age, user.address, id]
    );
    return res.rows[0];
};

export const deleteUser = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
};
