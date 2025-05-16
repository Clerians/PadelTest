import { Pool } from 'pg';

export const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'Padel',
    password: 'secure-password',
    port: 5432,
});