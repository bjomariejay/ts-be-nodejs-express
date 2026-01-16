import { pool } from '../config/db';

export interface User {
    id: number;
    name: string;
    age: number;
    address: string;
    username: string;
    passwordHash?: string;
}

export interface CreateUserPayload {
    name: string;
    age: number;
    address: string;
    username: string;
    passwordHash: string;
}

export interface UpdateUserPayload {
    name: string;
    age: number;
    address: string;
    username: string;
    passwordHash?: string;
}

export interface UserWithPassword extends User {
    passwordHash: string;
}

const mapRowToUser = (row: any): User => ({
    id: row.id,
    name: row.name,
    age: row.age,
    address: row.address,
    username: row.username,
    // handle snake_case + camelCase aliases from Postgres
    passwordHash: row.passwordHash ?? row.passwordhash ?? row.password ?? undefined,
});

const mapRowToUserWithPassword = (row: any): UserWithPassword => ({
    ...mapRowToUser(row),
    passwordHash: row.passwordHash ?? row.passwordhash ?? row.password,
});

export const getAllUsers = async (): Promise<User[]> => {
    const res = await pool.query('SELECT id, name, age, address, username, password as "passwordHash" FROM users ORDER BY id ASC');
    return res.rows.map(mapRowToUser);
};

export const createUser = async (user: CreateUserPayload): Promise<User> => {
    const res = await pool.query(
        'INSERT INTO users (name, age, address, username, password) VALUES ($1, $2, $3, $4, $5) RETURNING id, name, age, address, username',
        [user.name, user.age, user.address, user.username, user.passwordHash]
    );
    return mapRowToUser(res.rows[0]);
};

export const updateUser = async (id: number, user: UpdateUserPayload): Promise<User> => {
    const values: (string | number)[] = [user.name, user.age, user.address, user.username];
    let setClause = 'name=$1, age=$2, address=$3, username=$4';

    if (user.passwordHash) {
        values.push(user.passwordHash);
        setClause += `, password=$${values.length}`;
    }

    values.push(id);

    const res = await pool.query(
        `UPDATE users SET ${setClause} WHERE id=$${values.length} RETURNING id, name, age, address, username`,
        values
    );
    return mapRowToUser(res.rows[0]);
};

export const deleteUser = async (id: number): Promise<void> => {
    await pool.query('DELETE FROM users WHERE id=$1', [id]);
};

export const findByUsername = async (username: string): Promise<UserWithPassword | null> => {
    const res = await pool.query('SELECT id, name, age, address, username, password as "passwordHash" FROM users WHERE username=$1 LIMIT 1', [username]);
    const row = res.rows[0];
    return row ? mapRowToUserWithPassword(row) : null;
};

export const findById = async (id: number): Promise<User | null> => {
    const res = await pool.query('SELECT id, name, age, address, username, password as "passwordHash" FROM users WHERE id=$1 LIMIT 1', [id]);
    const row = res.rows[0];
    return row ? mapRowToUser(row) : null;
};
