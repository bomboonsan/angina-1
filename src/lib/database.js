import mariadb from 'mariadb';

const pool = mariadb.createPool({
    host: 'localhost',
    port: 3306,
    user: process.env.MARIADB_USER,
    password: process.env.MARIADB_PASSWORD,
    database: process.env.MARIADB_DATABASE,
    connectionLimit: 10,
    acquireTimeout: 30000,
    timeout: 30000,
});

export async function executeQuery(query, params = []) {
    let conn;
    try {
        conn = await pool.getConnection();
        const result = await conn.query(query, params);
        return result;
    } catch (error) {
        console.error('Database query error:', error);
        throw error;
    } finally {
        if (conn) conn.release();
    }
}

export default pool;
