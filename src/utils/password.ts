import bcrypt from "bcrypt";

const DEFAULT_ROUNDS = 10;
const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? DEFAULT_ROUNDS);

export const hashPassword = (password: string) => bcrypt.hash(password, saltRounds);

export const comparePassword = (password: string, hash: string) => bcrypt.compare(password, hash);
